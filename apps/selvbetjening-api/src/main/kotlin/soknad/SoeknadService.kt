package no.nav.etterlatte.soknad

import com.fasterxml.jackson.databind.JsonNode
import io.ktor.client.HttpClient
import io.ktor.client.features.ClientRequestException
import io.ktor.client.request.delete
import io.ktor.client.request.get
import io.ktor.client.request.post
import io.ktor.client.statement.HttpResponse
import io.ktor.http.ContentType.Application.Json
import io.ktor.http.HttpStatusCode
import io.ktor.http.contentType
import no.nav.etterlatte.common.RetryResult
import no.nav.etterlatte.common.retry
import no.nav.etterlatte.libs.common.soeknad.Soeknad
import org.slf4j.LoggerFactory

class SoeknadService(private val innsendtSoeknadKlient: HttpClient) {
    private val logger = LoggerFactory.getLogger(SoeknadService::class.java)

    suspend fun sendSoeknad(soeknad: Soeknad): RetryResult {
        logger.info("Mottatt fullført søknad. Forsøker å sende til lagring.")

        return retry {
            innsendtSoeknadKlient.post<String> ("soeknad"){
                contentType(Json)
                body = soeknad
            }
        }
    }

    suspend fun lagreKladd(json: JsonNode): RetryResult {
        return retry {
            logger.info("Lagrer kladd for innlogget bruker.")

            innsendtSoeknadKlient.post<String> ("kladd"){
                contentType(Json)
                body = json
            }
        }
    }

    suspend fun hentKladd(): RetryResult = retry {
        try {
            logger.info("Henter kladd for innlogget bruker.")

            innsendtSoeknadKlient.get<JsonNode>("kladd")
        } catch (ex: ClientRequestException){
            if (ex.response.status == HttpStatusCode.NotFound)
                HttpStatusCode.NotFound
            else
                throw ex
        }
    }

    suspend fun slettKladd(): RetryResult = retry {
        logger.info("Sletter kladd for innlogget bruker.")

        innsendtSoeknadKlient.delete<HttpResponse>("kladd").status
    }
}
