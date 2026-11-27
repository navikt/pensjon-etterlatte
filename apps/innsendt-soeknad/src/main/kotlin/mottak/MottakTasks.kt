package no.nav.etterlatte.mottak

import efterlatte.prosessering.RetryPolicy
import efterlatte.prosessering.TaskType
import no.nav.etterlatte.mapper
import soeknad.SoeknadID
import tools.jackson.module.kotlin.readValue
import kotlin.time.Duration.Companion.seconds

/** Payload for alle mottakstasks. Bare søknads-id, slik at payload er idempotensnøkkel og fri for personopplysninger. */
data class SoeknadTaskPayload(
    val soeknadId: SoeknadID,
)

private fun soeknadTaskType(navn: String) =
    TaskType<SoeknadTaskPayload>(
        navn = navn,
        // Skrevet for hånd så strengen er stabil for UNIQUE(type, payload).
        serialiser = { """{"soeknadId":${it.soeknadId}}""" },
        deserialiser = { mapper.readValue(it) },
    )

object MottakTasks {
    val HENT_JOURNALFOERINGSKONTEKST = soeknadTaskType("SoeknadHentJournalfoeringskontekst")
    val JOURNALFOER = soeknadTaskType("SoeknadJournalfoer")
    val OVERLEVER_TIL_GJENNY = soeknadTaskType("SoeknadOverleverTilGjenny")
    val FULLFOER_MOTTAK = soeknadTaskType("SoeknadFullfoerMottak")

    val alle = listOf(HENT_JOURNALFOERINGSKONTEKST, JOURNALFOER, OVERLEVER_TIL_GJENNY, FULLFOER_MOTTAK)

    /** Seks forsøk med 30 s, 1 m, 2 m, 4 m og 8 m mellom feilene. Deretter STOPPET. */
    val RETRY =
        RetryPolicy(
            maxAntallFeil = 6,
            backoff = { antallFeil -> 30.seconds * (1 shl (antallFeil - 1).coerceIn(0, 4)) },
        )

    fun metadata(
        soeknadId: SoeknadID,
        mottak: SoeknadMottak? = null,
        soeknadType: String? = mottak?.soeknadType?.name,
    ): Map<String, String> =
        buildMap {
            put("soeknadId", soeknadId.toString())
            soeknadType?.let { put("soeknadType", it) }
            mottak?.kontekst?.sakId?.let { put("sakId", it.toString()) }
            mottak?.kontekst?.ukjentBruker?.let { put("ukjentBruker", it.toString()) }
            mottak?.journalpost?.journalpostId?.let { put("journalpostId", it) }
            mottak?.overlevering?.oppgaveId?.let { put("oppgaveId", it) }
        }
}