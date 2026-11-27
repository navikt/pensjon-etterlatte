package no.nav.etterlatte.mottak.steg

import com.github.navikt.tbd_libs.rapids_and_rivers.JsonMessage
import com.github.navikt.tbd_libs.rapids_and_rivers_api.MessageContext
import com.github.navikt.tbd_libs.rapids_and_rivers_api.OutgoingMessage
import efterlatte.prosessering.RetryPolicy
import efterlatte.prosessering.TaskKontekst
import efterlatte.prosessering.TaskStep
import efterlatte.prosessering.TaskType
import efterlatte.prosessering.postgres.jdbcConnection
import kotlinx.coroutines.runBlocking
import no.nav.etterlatte.EventName
import no.nav.etterlatte.libs.common.innsendtsoeknad.common.SoeknadType
import no.nav.etterlatte.libs.utils.logging.CORRELATION_ID
import no.nav.etterlatte.libs.utils.logging.getCorrelationId
import no.nav.etterlatte.mapper
import no.nav.etterlatte.mottak.GjennyMottakKlient
import no.nav.etterlatte.mottak.Journalfoeringskontekst
import no.nav.etterlatte.mottak.JournalfoeringskontekstRequest
import no.nav.etterlatte.mottak.Journalpostreferanse
import no.nav.etterlatte.mottak.MottakTasks
import no.nav.etterlatte.mottak.OverleveringRequest
import no.nav.etterlatte.mottak.Overleveringsresultat
import no.nav.etterlatte.mottak.SoeknadMottak
import no.nav.etterlatte.mottak.SoeknadMottakDao
import no.nav.etterlatte.mottak.SoeknadTaskPayload
import no.nav.etterlatte.mottak.journalfoering.AvsenderMottaker
import no.nav.etterlatte.mottak.journalfoering.Bruker
import no.nav.etterlatte.mottak.journalfoering.DokarkivKlient
import no.nav.etterlatte.mottak.journalfoering.DokumentVariant
import no.nav.etterlatte.mottak.journalfoering.JournalpostDokument
import no.nav.etterlatte.mottak.journalfoering.JournalpostSak
import no.nav.etterlatte.mottak.journalfoering.OpprettJournalpostRequest
import no.nav.etterlatte.mottak.journalfoering.PdfgenKlient
import no.nav.etterlatte.toJson
import org.slf4j.LoggerFactory
import soeknad.LagretSoeknad
import soeknad.Mottaksflyt
import soeknad.PostgresSoeknadRepository
import soeknad.SoeknadID
import soeknad.Status
import tools.jackson.databind.JsonNode
import java.sql.Connection
import java.util.Base64

/** PDF-malen utvidet OMS skal bruke. Ingen fallback til andre maler eller ey-pdfgen. */
const val UTVIDET_OMS_PDF_MAL = "utvidet_omstillingsstoenad_v1"

/** Nøkkelen i kompatibilitetseventet som skjermer det mot gamle kvitteringsrivers. */
const val MOTTAKSFLYT_NOEKKEL = "@mottaksflyt"

fun mottaksnoekkel(soeknadId: SoeknadID) = "innsendt-soeknad:$soeknadId"

/**
 * Felles ramme for mottakstasks. Steget kjører på motorens connection. Alle lokale skriv og neste task
 * committer sammen med FULLFØRT, eller rulles tilbake. Feilmeldinger skal ikke inneholde fnr eller søknadsinnhold.
 */
abstract class MottakSteg(
    final override val type: TaskType<SoeknadTaskPayload>,
    protected val soeknader: PostgresSoeknadRepository,
    protected val mottakDao: SoeknadMottakDao,
    final override val retry: RetryPolicy,
) : TaskStep<SoeknadTaskPayload> {
    protected val logger = LoggerFactory.getLogger(this::class.java)

    final override fun utfor(kontekst: TaskKontekst<SoeknadTaskPayload>) {
        val c = kontekst.transaksjon.jdbcConnection()
        val soeknadId = kontekst.payload.soeknadId
        val flyt = soeknader.mottaksflyt(c, soeknadId)
        check(flyt == Mottaksflyt.PROSESSERING) { "Søknad $soeknadId tilhører mottaksflyt $flyt, ikke prosessering" }
        val mottak = mottakDao.hent(c, soeknadId) ?: error("Søknad $soeknadId mangler mottaksdata")
        check(mottak.fullfoert == null) { "Mottaket for søknad $soeknadId er allerede fullført" }
        utfoer(c, mottak, kontekst)
    }

    protected abstract fun utfoer(
        c: Connection,
        mottak: SoeknadMottak,
        kontekst: TaskKontekst<SoeknadTaskPayload>,
    )

    protected fun hentInnhold(
        c: Connection,
        soeknadId: SoeknadID,
    ): LagretSoeknad =
        soeknader.hentInnsendtSoeknad(c, soeknadId)
            ?: error("Søknad $soeknadId mangler innhold. Mottaket må følges opp manuelt")

    protected fun opprettNeste(
        kontekst: TaskKontekst<SoeknadTaskPayload>,
        type: TaskType<SoeknadTaskPayload>,
        mottak: SoeknadMottak,
    ) {
        kontekst.opprettNesteTask(
            type = type,
            payload = SoeknadTaskPayload(mottak.soeknadId),
            metadata = MottakTasks.metadata(mottak.soeknadId, mottak),
        )
    }
}

internal fun JsonNode.tekst(vararg sti: String): String? =
    sti.fold(this) { node, felt -> node.path(felt) }.takeIf { it.isString }?.asString()

/** T1: Gjenny finner eller oppretter sak etter dagens regler og avgjør tema og journalførende enhet. */
class HentJournalfoeringskontekstSteg(
    soeknader: PostgresSoeknadRepository,
    mottakDao: SoeknadMottakDao,
    private val gjenny: GjennyMottakKlient,
    retry: RetryPolicy = MottakTasks.RETRY,
) : MottakSteg(MottakTasks.HENT_JOURNALFOERINGSKONTEKST, soeknader, mottakDao, retry) {
    override fun utfoer(
        c: Connection,
        mottak: SoeknadMottak,
        kontekst: TaskKontekst<SoeknadTaskPayload>,
    ) {
        check(mottak.kontekst == null) { "Søknad ${mottak.soeknadId} har allerede journalføringskontekst" }
        val skjema = mapper.readTree(hentInnhold(c, mottak.soeknadId).payload)
        val foedselsnummer = skjema.tekst("soeker", "foedselsnummer", "svar")

        val svar =
            runBlocking {
                gjenny.hentJournalfoeringskontekst(JournalfoeringskontekstRequest(mottak.soeknadType, foedselsnummer))
            }
        val journalfoeringskontekst =
            Journalfoeringskontekst(
                ukjentBruker = svar.ukjentBruker,
                sakId = svar.sakId,
                sakType = svar.sakType,
                tema = svar.tema,
                journalfoerendeEnhet = svar.journalfoerendeEnhet,
            )
        logger.info(
            "Søknad ${mottak.soeknadId}: journalføringskontekst hentet (ukjentBruker=${svar.ukjentBruker}, sakId=${svar.sakId})",
        )

        mottakDao.lagreKontekst(c, mottak.soeknadId, journalfoeringskontekst)
        opprettNeste(kontekst, MottakTasks.JOURNALFOER, mottak.copy(kontekst = journalfoeringskontekst))
    }
}

/** T2: Genererer PDF og journalfører. Gjentatte forsøk gir samme journalpost via eksternReferanseId og 409. */
class JournalfoerSteg(
    soeknader: PostgresSoeknadRepository,
    mottakDao: SoeknadMottakDao,
    private val pdfgen: PdfgenKlient,
    private val dokarkiv: DokarkivKlient,
    retry: RetryPolicy = MottakTasks.RETRY,
) : MottakSteg(MottakTasks.JOURNALFOER, soeknader, mottakDao, retry) {
    private val encoder = Base64.getEncoder()

    override fun utfoer(
        c: Connection,
        mottak: SoeknadMottak,
        kontekst: TaskKontekst<SoeknadTaskPayload>,
    ) {
        val journalfoeringskontekst =
            checkNotNull(mottak.kontekst) { "Søknad ${mottak.soeknadId} mangler journalføringskontekst" }
        check(mottak.journalpost == null) { "Søknad ${mottak.soeknadId} er allerede journalført" }
        check(mottak.soeknadType == SoeknadType.UTVIDET_OMSTILLINGSSTOENAD) {
            "Søknadstype ${mottak.soeknadType} journalføres ikke i prosesseringsløpet"
        }

        val innhold = hentInnhold(c, mottak.soeknadId)
        val mal = mapper.readTree(innhold.payload).tekst("template")
        check(
            mal == UTVIDET_OMS_PDF_MAL,
        ) { "Søknad ${mottak.soeknadId} har PDF-mal $mal, forventet $UTVIDET_OMS_PDF_MAL" }

        val tittel = "Søknad om utvidet omstillingsstønad"
        val ukjent = journalfoeringskontekst.ukjentBruker
        val response =
            runBlocking {
                val pdf = pdfgen.genererPdf(mal = mal, soeknadJson = innhold.payload)
                val request =
                    OpprettJournalpostRequest(
                        tittel = tittel,
                        tema = journalfoeringskontekst.tema,
                        journalfoerendeEnhet = journalfoeringskontekst.journalfoerendeEnhet,
                        avsenderMottaker = if (ukjent) null else AvsenderMottaker(innhold.fnr),
                        bruker = if (ukjent) null else Bruker(innhold.fnr),
                        eksternReferanseId = eksternReferanseId(mottak.soeknadId, journalfoeringskontekst.sakType),
                        sak = if (ukjent) null else JournalpostSak(journalfoeringskontekst.sakId.toString()),
                        dokumenter =
                            listOf(
                                JournalpostDokument(
                                    tittel = tittel,
                                    dokumentvarianter =
                                        listOf(
                                            DokumentVariant.ArkivPDF(encoder.encodeToString(pdf)),
                                            DokumentVariant.OriginalJson(
                                                encoder.encodeToString(innhold.payload.toByteArray()),
                                            ),
                                        ),
                                ),
                            ),
                    )
                dokarkiv.opprettJournalpost(request, forsoekFerdigstill = !ukjent)
            }

        val journalpost =
            Journalpostreferanse(
                journalpostId = response.journalpostId,
                ferdigstilt = response.journalpostferdigstilt,
                dokumentInfoIder = response.dokumenter.map { it.dokumentInfoId },
            )
        mottakDao.lagreJournalpost(c, mottak.soeknadId, journalpost)
        opprettNeste(kontekst, MottakTasks.OVERLEVER_TIL_GJENNY, mottak.copy(journalpost = journalpost))
    }

    companion object {
        /** Samme nøkkel som dagens journalføring i Gjenny, slik at dokarkiv dedupliserer på tvers av forsøk. */
        fun eksternReferanseId(
            soeknadId: SoeknadID,
            sakType: String,
        ) = "etterlatte:${sakType.lowercase()}:$soeknadId"
    }
}

/** T3: Overleverer den journalførte søknaden til Gjenny, som dedupliserer på mottaksnøkkelen. */
class OverleverTilGjennySteg(
    soeknader: PostgresSoeknadRepository,
    mottakDao: SoeknadMottakDao,
    private val gjenny: GjennyMottakKlient,
    retry: RetryPolicy = MottakTasks.RETRY,
) : MottakSteg(MottakTasks.OVERLEVER_TIL_GJENNY, soeknader, mottakDao, retry) {
    override fun utfoer(
        c: Connection,
        mottak: SoeknadMottak,
        kontekst: TaskKontekst<SoeknadTaskPayload>,
    ) {
        val journalfoeringskontekst =
            checkNotNull(mottak.kontekst) { "Søknad ${mottak.soeknadId} mangler journalføringskontekst" }
        val journalpost = checkNotNull(mottak.journalpost) { "Søknad ${mottak.soeknadId} er ikke journalført" }
        check(mottak.overlevering == null) { "Søknad ${mottak.soeknadId} er allerede overlevert" }

        val resultat =
            if (journalfoeringskontekst.ukjentBruker) {
                // B4: søknad på ukjent bruker journalføres uten sak, og Gjenny lager ingen oppgave.
                logger.info(
                    "Søknad ${mottak.soeknadId} er journalført på ukjent bruker. Ingen overlevering til Gjenny.",
                )
                Overleveringsresultat(oppgaveId = null)
            } else {
                val svar =
                    runBlocking {
                        gjenny.overlever(
                            OverleveringRequest(
                                mottaksnoekkel = mottaksnoekkel(mottak.soeknadId),
                                soeknadType = mottak.soeknadType,
                                sakId = checkNotNull(journalfoeringskontekst.sakId),
                                journalpostId = journalpost.journalpostId,
                                dokumentInfoIder = journalpost.dokumentInfoIder,
                            ),
                        )
                    }
                logger.info("Søknad ${mottak.soeknadId} overlevert til Gjenny (oppgaveId=${svar.oppgaveId})")
                Overleveringsresultat(oppgaveId = svar.oppgaveId)
            }

        mottakDao.lagreOverlevering(c, mottak.soeknadId, resultat)
        opprettNeste(kontekst, MottakTasks.FULLFOER_MOTTAK, mottak.copy(overlevering = resultat))
    }
}

/**
 * T4: Publiserer kompatibilitetseventet for integrasjonene som i dag lytter på journalført søknad
 * (etterlatte-notifikasjoner), og fullfører mottaket lokalt. ARKIVERT settes først her, siden
 * slettejobben fjerner innholdet etter ARKIVERT.
 */
class FullfoerMottakSteg(
    soeknader: PostgresSoeknadRepository,
    mottakDao: SoeknadMottakDao,
    private val rapid: () -> MessageContext,
    retry: RetryPolicy = MottakTasks.RETRY,
) : MottakSteg(MottakTasks.FULLFOER_MOTTAK, soeknader, mottakDao, retry) {
    override fun utfoer(
        c: Connection,
        mottak: SoeknadMottak,
        kontekst: TaskKontekst<SoeknadTaskPayload>,
    ) {
        val journalfoeringskontekst =
            checkNotNull(mottak.kontekst) { "Søknad ${mottak.soeknadId} mangler journalføringskontekst" }
        val journalpost = checkNotNull(mottak.journalpost) { "Søknad ${mottak.soeknadId} er ikke journalført" }
        checkNotNull(mottak.overlevering) { "Søknad ${mottak.soeknadId} er ikke overlevert" }
        val innhold = hentInnhold(c, mottak.soeknadId)

        val dokarkivRetur =
            mapOf(
                "journalpostId" to journalpost.journalpostId,
                "journalpostferdigstilt" to journalpost.ferdigstilt,
                "dokumenter" to journalpost.dokumentInfoIder.map { mapOf("dokumentInfoId" to it) },
            )
        val melding =
            JsonMessage.newMessage(
                buildMap {
                    put("@event_name", EventName.SOEKNAD_INNSENDT)
                    put("@lagret_soeknad_id", mottak.soeknadId)
                    put("@skjema_info", minimaltSkjema(innhold.payload))
                    put("@fnr_soeker", innhold.fnr)
                    put("@dokarkivRetur", dokarkivRetur)
                    put("soeknadFordelt", false)
                    journalfoeringskontekst.sakId?.let { put("sakId", it) }
                    put(MOTTAKSFLYT_NOEKKEL, Mottaksflyt.PROSESSERING.name)
                    put(CORRELATION_ID, getCorrelationId())
                },
            )
        val (_, feilet) = rapid().publish(listOf(OutgoingMessage(melding.toJson(), mottak.soeknadId.toString())))
        if (feilet.isNotEmpty()) {
            throw IllegalStateException(
                "Klarte ikke å publisere mottatt søknad ${mottak.soeknadId}",
                feilet.first().error,
            )
        }

        soeknader.nyStatus(c, mottak.soeknadId, Status.ARKIVERT, dokarkivRetur.toJson())
        mottakDao.markerFullfoert(c, mottak.soeknadId)
        logger.info("Mottaket av søknad ${mottak.soeknadId} er fullført")
    }

    /** Bare feltene etterlatte-notifikasjoner leser. Hele søknaden sendes ikke på Kafka i dette løpet. */
    private fun minimaltSkjema(payload: String): Map<String, Any?> {
        val skjema = mapper.readTree(payload)
        return mapOf(
            "type" to skjema.tekst("type"),
            "innsender" to
                mapOf("foedselsnummer" to mapOf("svar" to skjema.tekst("innsender", "foedselsnummer", "svar"))),
        )
    }
}