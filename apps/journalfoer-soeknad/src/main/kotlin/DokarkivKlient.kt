package no.nav.etterlatte

import com.fasterxml.jackson.databind.JsonNode
import io.ktor.client.HttpClient
import io.ktor.client.call.receive
import io.ktor.client.features.ResponseException
import io.ktor.client.request.accept
import io.ktor.client.request.header
import io.ktor.client.request.post
import io.ktor.client.statement.HttpResponse
import io.ktor.http.ContentType
import io.ktor.http.contentType
import no.nav.etterlatte.libs.common.journalpost.JournalpostRequest
import no.nav.etterlatte.libs.common.objectMapper
import org.slf4j.LoggerFactory
import org.slf4j.MDC
import java.util.UUID

interface Dokarkiv {
    suspend fun journalfoerDok(request: JournalpostRequest): JsonNode
}

class DokarkivKlient(private val client: HttpClient, private val baseUrl: String) : Dokarkiv {
    private val logger = LoggerFactory.getLogger(DokarkivKlient::class.java)

    override suspend fun journalfoerDok(request: JournalpostRequest): JsonNode {
        return try {
            val retur = client.post<HttpResponse>(baseUrl) {
                accept(ContentType.Application.Json)
                contentType(ContentType.Application.Json)
                header("X-Correlation-ID", MDC.get("X-Correlation-ID") ?: UUID.randomUUID().toString())
                body = request
            }

            retur.receive()
        } catch (cause: ResponseException) {
            if (cause.response.status.value == 409) {
                logger.error("Duplikat journalpost: ", cause)
            }

            cause.response.receive()
        } catch (cause: Throwable) {
            logger.error("Feil i kall mot Dokarkiv: ", cause)

            objectMapper.readTree(cause.message)
        }
    }
}