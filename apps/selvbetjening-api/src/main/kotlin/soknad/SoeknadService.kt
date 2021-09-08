package no.nav.etterlatte.soknad

import com.fasterxml.jackson.databind.JsonNode
import io.ktor.client.HttpClient
import io.ktor.client.request.delete
import io.ktor.client.request.get
import io.ktor.client.request.post
import io.ktor.client.statement.HttpResponse
import io.ktor.http.ContentType.Application.Json
import io.ktor.http.HttpStatusCode
import io.ktor.http.contentType
import io.ktor.http.isSuccess
import no.nav.etterlatte.common.RetryResult
import no.nav.etterlatte.common.retry

class SoeknadService(private val innsendtSoeknadKlient: HttpClient) {
    suspend fun sendSoknad(json: JsonNode): RetryResult {
        return retry {
            innsendtSoeknadKlient.post<String> ("soeknad"){
                contentType(Json)
                body = json
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
        innsendtSoeknadKlient.get<JsonNode>("kladd")
    }

    suspend fun slettKladd(): RetryResult = retry {
        val status = innsendtSoeknadKlient.delete<HttpResponse>("kladd").status
        if (status.isSuccess() || status == HttpStatusCode.Gone){
            status
        } else {
            throw RuntimeException("Unhandled httpcode from innsendt soeknad")
        }
    }
}
