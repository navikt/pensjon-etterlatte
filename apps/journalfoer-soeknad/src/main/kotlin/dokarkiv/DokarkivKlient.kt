package dokarkiv

import io.ktor.client.HttpClient
import io.ktor.client.call.body
import io.ktor.client.plugins.ResponseException
import io.ktor.client.request.accept
import io.ktor.client.request.header
import io.ktor.client.request.post
import io.ktor.client.request.setBody
import io.ktor.client.statement.HttpResponse
import io.ktor.http.ContentType
import io.ktor.http.HttpStatusCode
import io.ktor.http.contentType
import io.ktor.http.isSuccess
import no.nav.etterlatte.dokarkiv.DokarkivErrorResponse
import no.nav.etterlatte.dokarkiv.DokarkivResponse
import no.nav.etterlatte.mapper
import org.slf4j.LoggerFactory
import org.slf4j.MDC
import java.util.*

interface Dokarkiv {
    suspend fun journalfoerDok(request: JournalpostRequest): DokarkivResponse
}

class DokarkivKlient(private val client: HttpClient, private val baseUrl: String) : Dokarkiv {
    private val logger = LoggerFactory.getLogger(DokarkivKlient::class.java)

    override suspend fun journalfoerDok(request: JournalpostRequest): DokarkivResponse {
        return try {
            val response = client.post(baseUrl) {
                accept(ContentType.Application.Json)
                contentType(ContentType.Application.Json)
                header("X-Correlation-ID", MDC.get("X-Correlation-ID") ?: UUID.randomUUID().toString())
                header("Nav-CallId", MDC.get("X-Correlation-ID") ?: UUID.randomUUID().toString())
                setBody(request)
            }

            if (response.status.isSuccess()) response.body()
            else if (response.status == HttpStatusCode.Conflict) {
                throw ResponseException(
                    response,
                    "Duplikat journalpost - søknaden med tittel '${request.tittel}' har allerede blitt journalført"
                )
            } else {
                val error = response.body<DokarkivErrorResponse>()
                logger.error(mapper.writeValueAsString(error))

                throw ResponseException(response, error.message ?: response.toString())
            }
        } catch (e: Exception) {
            logger.error("Feil i kall mot Dokarkiv: ", e)

            throw e
        }
    }
}
