package no.nav.etterlatte.kodeverk

import io.ktor.client.HttpClient
import io.ktor.client.request.accept
import io.ktor.client.request.get
import io.ktor.client.request.header
import io.ktor.http.ContentType.Application.Json
import no.nav.etterlatte.common.mapJsonToAny
import org.slf4j.LoggerFactory
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

class KodeverkService(private val httpClient: HttpClient) {
    private val logger = LoggerFactory.getLogger(KodeverkService::class.java)

    suspend fun hentPoststed(postnr: String?): String {
        if (postnr.isNullOrBlank()) return ""

        try {
            // Todo: cache postnummerliste?
            val result = httpClient.get<String> {
                accept(Json)
            }
            val current = LocalDateTime.now()
            val formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd")
            val now = current.format(formatter)

            val postnummere = mapJsonToAny<PostnummerResponse>(result)
            val gjeldendePoststed = postnummere.betydninger[postnr]?.find { postnummerInfo -> postnummerInfo.gyldigTil > now  }

            return gjeldendePoststed?.beskrivelser?.get("nb")?.tekst.orEmpty()
        } catch (e: Exception) {
            logger.error("Henting av postnummere feilet", e)
            throw e
        }
    }

}
