package no.nav.etterlatte

import dokarkiv.AvsenderMottaker
import dokarkiv.Bruker
import dokarkiv.Dokarkiv
import dokarkiv.JournalPostType
import dokarkiv.JournalpostDokument
import dokarkiv.JournalpostRequest
import dokarkiv.Sak
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.runBlocking
import no.nav.etterlatte.dokarkiv.DokarkivResponse
import no.nav.etterlatte.libs.common.innsendtsoeknad.common.InnsendtSoeknad
import no.nav.etterlatte.libs.common.pdl.Gradering
import org.slf4j.LoggerFactory

class JournalfoeringService(private val klient: Dokarkiv) {
    private val logger = LoggerFactory.getLogger(JournalfoeringService::class.java)

    fun journalfoer(
        soeknadId: String,
        fnrSoeker: String,
        gradering: Gradering,
        dokument: JournalpostDokument,
        soeknad: InnsendtSoeknad,
        tema: String,
        behandlingstema: String?,
        forsoekFerdigstill: Boolean,
        sakId: String?,
        tittel: String
    ): DokarkivResponse {
        logger.info("Oppretter journalpost for søknad ID $soeknadId")

        val request = JournalpostRequest(
            tittel = tittel,
            tema = tema,
            journalpostType = JournalPostType.INNGAAENDE,
            behandlingstema = behandlingstema,
            journalfoerendeEnhet = finnJournalfoerendeEnhet(soeknad, gradering, forsoekFerdigstill),
            avsenderMottaker = AvsenderMottaker(id = fnrSoeker),
            bruker = Bruker(id = fnrSoeker),
            eksternReferanseId = "etterlatte:${soeknad.type.toString().lowercase()}:$soeknadId",
            dokumenter = listOf(dokument),
            sak = if(forsoekFerdigstill) Sak(sakId!!) else null
        )

        return runBlocking(Dispatchers.IO) {
            klient.journalfoerDok(request, forsoekFerdigstill)
        }.also {
            logger.info("Journalført PDF (søknad id $soeknadId) med respons: $it")
        }
    }
}
