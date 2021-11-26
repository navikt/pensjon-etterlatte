package no.nav.etterlatte

import dokarkiv.AvsenderMottaker
import dokarkiv.Bruker
import dokarkiv.Dokarkiv
import dokarkiv.JournalPostType
import dokarkiv.JournalpostDokument
import dokarkiv.JournalpostRequest
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.runBlocking
import no.nav.etterlatte.Konstanter.ENHET_VIKAFOSSEN
import no.nav.etterlatte.Konstanter.SOEKNAD_TITTEL
import no.nav.etterlatte.dokarkiv.DokarkivResponse
import no.nav.etterlatte.libs.common.pdl.Gradering
import no.nav.etterlatte.libs.common.soeknad.SoeknadType
import org.slf4j.LoggerFactory

class JournalfoeringService(private val klient: Dokarkiv) {
    private val logger = LoggerFactory.getLogger(JournalfoeringService::class.java)

    fun journalfoer(
        soeknadId: String,
        fnrSoeker: String,
        gradering: Gradering,
        dokument: JournalpostDokument,
        soeknadType: SoeknadType
    ): DokarkivResponse {
        logger.info("Oppretter journalpost for søknad ID $soeknadId")

        val request = JournalpostRequest(
            tittel = SOEKNAD_TITTEL,
            journalpostType = JournalPostType.INNGAAENDE,
            behandlingstema = soeknadType.behandlingstema,
            journalfoerendeEnhet = finnEnhet(gradering),
            avsenderMottaker = AvsenderMottaker(id = fnrSoeker),
            bruker = Bruker(id = fnrSoeker),
            eksternReferanseId = SOEKNAD_TITTEL + soeknadId,
            dokumenter = listOf(dokument)
        )

        return runBlocking(Dispatchers.IO) {
            klient.journalfoerDok(request)
        }.also {
            logger.info("Journalført PDF (søknad id $soeknadId) med respons: $it")
        }
    }

    private fun finnEnhet(gradering: Gradering): String? =
        when (gradering) {
            Gradering.STRENGT_FORTROLIG_UTLAND,
            Gradering.STRENGT_FORTROLIG -> ENHET_VIKAFOSSEN
            Gradering.FORTROLIG,
            Gradering.UGRADERT -> null
        }
}
