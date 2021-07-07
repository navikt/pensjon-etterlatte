package no.nav.etterlatte.soknad

import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.node.ObjectNode
import io.ktor.application.call
import io.ktor.client.HttpClient
import io.ktor.client.request.post
import io.ktor.http.ContentType
import io.ktor.http.HttpStatusCode
import io.ktor.http.contentType
import io.ktor.request.receive
import io.ktor.response.respond
import io.ktor.routing.Route
import io.ktor.routing.post
import io.ktor.routing.route
import no.nav.etterlatte.common.unsafeRetry
import no.nav.etterlatte.ktortokenexchange.ThreadBoundSecCtx
import java.time.LocalDate
import java.time.ZoneId

fun Route.soknadApi(innsendtSoeknadEndpint: HttpClient) {
    route("/api/soeknad") {
        post {
            val fnr = ThreadBoundSecCtx.get().user()!!
            call.application.environment.log.info("Mottatt søknad for $fnr")

            val soknadId = unsafeRetry{ innsendtSoeknadEndpint.post<String> {
                contentType(ContentType.Application.Json)
                body = call.receive<JsonNode>().also(::addMottattDato)
            }}

            if (soknadId.isBlank())
                call.respond(HttpStatusCode.InternalServerError)
            else
                call.respond(soknadId)
        }
    }
}

private fun addMottattDato(soeknad: JsonNode) {
    if (soeknad is ObjectNode) {
        if (!soeknad.has("stoenadType")) {
            soeknad.putObject("stoenadType")
        } else {
            soeknad.get("stoenadType") as ObjectNode
        }.put("mottattDato", LocalDate.now(ZoneId.of("Europe/Oslo")).toString())
    }
}