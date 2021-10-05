package no.nav.etterlatte.kodeverk

import io.ktor.client.HttpClient
import io.ktor.client.request.accept
import io.ktor.client.request.get
import io.ktor.http.ContentType
import no.nav.etterlatte.common.mapJsonToAny
import org.slf4j.LoggerFactory

interface Kodeverk {
    suspend fun hentPoststed(postnummer: String): PostnummerResponse
}

class KodeverkKlient(private val httpClient: HttpClient): Kodeverk {
    private val logger = LoggerFactory.getLogger(KodeverkService::class.java)

    override suspend fun hentPoststed(postnummer: String): PostnummerResponse {
        try {
            val result = httpClient.get<String> {
                accept(ContentType.Application.Json)
            }

            return mapJsonToAny(result)
        } catch (e: Exception) {
            logger.error("Henting av postnummere feilet", e)
            throw e
        }
    }
}
