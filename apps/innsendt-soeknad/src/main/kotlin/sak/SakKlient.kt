package no.nav.etterlatte.sak

import io.ktor.client.HttpClient
import io.ktor.client.call.body
import io.ktor.client.request.accept
import io.ktor.client.request.post
import io.ktor.client.request.setBody
import io.ktor.http.ContentType
import io.ktor.http.contentType
import no.nav.etterlatte.libs.common.person.Foedselsnummer
import org.slf4j.LoggerFactory

class SakKlient(
    private val httpClient: HttpClient,
    private val apiUrl: String,
) {
    private val logger = LoggerFactory.getLogger(SakKlient::class.java)

    suspend fun harOMSLoependeSakIGjenny(fnr: Foedselsnummer): HarOMSSakIGjennyResponse {
        logger.info("Spør etterlatte-api om innbygger har løpende OMS sak i gjenny")

        return httpClient
            .post("$apiUrl/api/sak/oms/har-loepende-sak") {
                accept(ContentType.Application.Json)
                contentType(ContentType.Application.Json)
                setBody(HarOMSSakIGjennyRequestBody(foedselsnummer = fnr.value))
            }.body<HarOMSSakIGjennyResponse>()
    }
}

data class HarOMSSakIGjennyRequestBody(
    val foedselsnummer: String,
)

data class HarOMSSakIGjennyResponse(
    val harOMSSak: Boolean,
)