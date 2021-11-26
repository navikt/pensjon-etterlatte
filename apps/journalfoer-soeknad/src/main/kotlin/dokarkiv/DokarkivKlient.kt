package dokarkiv

import io.ktor.client.HttpClient
import io.ktor.client.features.ResponseException
import io.ktor.client.request.accept
import io.ktor.client.request.header
import io.ktor.client.request.post
import io.ktor.http.ContentType
import io.ktor.http.contentType
import no.nav.etterlatte.dokarkiv.DokarkivResponse
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
            client.post(baseUrl) {
                accept(ContentType.Application.Json)
                contentType(ContentType.Application.Json)
                header("X-Correlation-ID", MDC.get("X-Correlation-ID") ?: UUID.randomUUID().toString())
                body = request
            }
        } catch (re: ResponseException) {
            if (re.response.status.value == 409) {
                logger.error("Duplikat journalpost: ", re)
            }

            throw re
        } catch (e: Exception) {
            logger.error("Feil i kall mot Dokarkiv: ", e)

            throw e
        }
    }
}
