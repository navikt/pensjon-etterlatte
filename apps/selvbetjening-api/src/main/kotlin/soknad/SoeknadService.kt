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

class SoeknadService(private val innsendtSoeknadKlient: HttpClient) {
    suspend fun sendSoknad(soeknad: Soeknad): RetryResult {
        soeknad.validate()

        return retry {
            innsendtSoeknadKlient.post<String> ("soeknad"){
                contentType(Json)
                body = soeknad
            }
        }
    }

    suspend fun lagreKladd(json: JsonNode): RetryResult {
        return retry {
            innsendtSoeknadKlient.post<String> ("kladd"){
                contentType(Json)
                body = json
            }
        }
    }

    suspend fun hentKladd(): RetryResult = retry {
        try {
            innsendtSoeknadKlient.get<JsonNode>("kladd")
        } catch (ex: ClientRequestException){
            if (ex.response.status == HttpStatusCode.NotFound)
                HttpStatusCode.NotFound
            else
                throw ex
        }
    }

    suspend fun slettKladd(): RetryResult = retry {
        innsendtSoeknadKlient.delete<HttpResponse>("kladd").status
    }
}
