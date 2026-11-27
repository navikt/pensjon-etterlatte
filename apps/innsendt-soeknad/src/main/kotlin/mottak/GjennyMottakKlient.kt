package no.nav.etterlatte.mottak

import io.ktor.client.HttpClient
import io.ktor.client.call.body
import io.ktor.client.request.accept
import io.ktor.client.request.post
import io.ktor.client.request.setBody
import io.ktor.client.statement.HttpResponse
import io.ktor.http.ContentType
import io.ktor.http.HttpStatusCode
import io.ktor.http.contentType
import io.ktor.http.isSuccess
import no.nav.etterlatte.libs.common.innsendtsoeknad.common.SoeknadType

/**
 * Kontrakten mot Gjennys søknadsmottak via etterlatte-api. Gjenny avgjør sak, enhet og oppgave.
 * Innsendt-soeknad sender bare det som trengs for avgjørelsen, aldri hele søknaden.
 */
data class JournalfoeringskontekstRequest(
    val soeknadType: SoeknadType,
    /** Søkerens fødselsnummer slik det står i søknaden. Null gir ukjent bruker. */
    val foedselsnummer: String?,
)

data class JournalfoeringskontekstResponse(
    val ukjentBruker: Boolean,
    val sakId: Long?,
    val sakType: String,
    val tema: String,
    val journalfoerendeEnhet: String,
)

data class OverleveringRequest(
    /** Stabil nøkkel per søknad. Samme nøkkel med annet innhold avvises av Gjenny. */
    val mottaksnoekkel: String,
    val soeknadType: SoeknadType,
    val sakId: Long,
    val journalpostId: String,
    val dokumentInfoIder: List<String>,
)

data class OverleveringResponse(
    val mottaksnoekkel: String,
    val sakId: Long,
    val journalpostId: String,
    val oppgaveId: String,
)

/** Gjenny svarte med en feil som tyder på feil i kontrakten eller dataene, ikke midlertidig utilgjengelighet. */
class GjennyAvvisteForespoersel(
    sti: String,
    status: HttpStatusCode,
) : RuntimeException("Gjenny avviste $sti med status ${status.value}")

/** Gjenny svarte ikke som forventet, typisk 5xx eller nettverksfeil. Prøves på nytt av motoren. */
class GjennyUtilgjengelig(
    sti: String,
    status: HttpStatusCode,
) : RuntimeException("Gjenny svarte ${status.value} på $sti")

class GjennyMottakKlient(
    private val httpClient: HttpClient,
    private val apiUrl: String,
) {
    suspend fun hentJournalfoeringskontekst(request: JournalfoeringskontekstRequest): JournalfoeringskontekstResponse =
        post(KONTEKST_STI, request).body()

    suspend fun overlever(request: OverleveringRequest): OverleveringResponse =
        post(OVERLEVERING_STI, request).body<OverleveringResponse>().also {
            check(it.mottaksnoekkel == request.mottaksnoekkel && it.journalpostId == request.journalpostId) {
                "Gjenny svarte med et overleveringsresultat for en annen søknad"
            }
        }

    private suspend fun post(
        sti: String,
        body: Any,
    ): HttpResponse {
        val response =
            httpClient.post("$apiUrl$sti") {
                accept(ContentType.Application.Json)
                contentType(ContentType.Application.Json)
                setBody(body)
            }
        return when {
            response.status.isSuccess() -> response
            response.status.value in 400..499 -> throw GjennyAvvisteForespoersel(sti, response.status)
            else -> throw GjennyUtilgjengelig(sti, response.status)
        }
    }

    companion object {
        const val KONTEKST_STI = "/api/soeknad/mottak/journalfoeringskontekst"
        const val OVERLEVERING_STI = "/api/soeknad/mottak/overlevering"
    }
}