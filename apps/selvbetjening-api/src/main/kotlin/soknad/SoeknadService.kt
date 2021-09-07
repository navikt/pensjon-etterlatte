package no.nav.etterlatte.soknad

import com.fasterxml.jackson.databind.JsonNode
import io.ktor.client.HttpClient
import io.ktor.client.request.get
import io.ktor.client.request.post
import io.ktor.http.ContentType.Application.Json
import io.ktor.http.contentType
import no.nav.etterlatte.common.RetryResult
import no.nav.etterlatte.common.innloggetBrukerFnr
import no.nav.etterlatte.common.retry
import org.slf4j.Logger
import org.slf4j.LoggerFactory

class SoeknadService(private val innsendtSoeknadKlient: HttpClient) {
    private val logger: Logger = LoggerFactory.getLogger(SoeknadService::class.java)

    suspend fun sendSoknad(json: JsonNode): RetryResult {
        logger.info("Mottatt søknad for person: ${innloggetBrukerFnr()}")

        return retry {
            innsendtSoeknadKlient.post<String> ("soeknad"){
                contentType(Json)
                body = json
            }
        }
    }

    suspend fun lagreKladd(json: JsonNode): RetryResult {
        logger.info("Mottatt kladd for ${innloggetBrukerFnr()}")

        return retry {
            innsendtSoeknadKlient.post<String> ("kladd"){
                contentType(Json)
                body = json
            }
        }
    }

    suspend fun hentKladd(): RetryResult = retry {
        innsendtSoeknadKlient.get<JsonNode>("kladd")
    }
}
