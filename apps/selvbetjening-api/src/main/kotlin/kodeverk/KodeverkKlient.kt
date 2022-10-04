package no.nav.etterlatte.kodeverk

import io.ktor.client.HttpClient
import io.ktor.client.call.body
import io.ktor.client.request.accept
import io.ktor.client.request.get
import io.ktor.client.request.header
import io.ktor.http.ContentType
import io.ktor.http.HttpHeaders
import no.nav.etterlatte.person.krr.NavCallId
import no.nav.etterlatte.person.krr.NavConsumerId
import org.slf4j.LoggerFactory
import java.util.UUID

interface Kodeverk {
    suspend fun hentPostnummer(): KodeverkResponse
    suspend fun hentLandkoder(): KodeverkResponse
}

/**
 * Klient som kaller på kodeverksklienten via
 */
class KodeverkKlient(
    private val httpClient: HttpClient,
    private val url: String
) : Kodeverk {
    private val logger = LoggerFactory.getLogger(KodeverkService::class.java)

    override suspend fun hentPostnummer(): KodeverkResponse =
        try {
            logger.info("Henter alle postnummer fra Kodeverk")

            httpClient.get("$url/Postnummer/koder/betydninger?ekskluderUgyldige=true&spraak=nb") {
                accept(ContentType.Application.Json)
                header(HttpHeaders.NavConsumerId, "etterlatte-selvbetjening-api")
                header(HttpHeaders.NavCallId, UUID.randomUUID())
            }.body()
        } catch (e: Exception) {
            logger.error("Henting av postnummere feilet", e)
            throw e
        }

    override suspend fun hentLandkoder(): KodeverkResponse =
        try {
            logger.info("Henter alle landkoder fra Kodeverk")

            httpClient.get("$url/Landkoder/koder/betydninger?ekskluderUgyldige=false&spraak=nb") {
                accept(ContentType.Application.Json)
                header(HttpHeaders.NavConsumerId, "etterlatte-selvbetjening-api")
                header(HttpHeaders.NavCallId, UUID.randomUUID())
            }.body()
        } catch (e: Exception) {
            logger.error("Henting av landkoder feilet", e)
            throw e
        }
}
