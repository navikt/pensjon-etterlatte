package no.nav.etterlatte.soknad

import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.node.ObjectNode
import io.ktor.application.ApplicationCall
import io.ktor.application.call
import io.ktor.client.HttpClient
import io.ktor.client.request.get
import io.ktor.client.request.post
import io.ktor.http.ContentType
import io.ktor.http.HttpStatusCode
import io.ktor.http.contentType
import io.ktor.request.receive
import io.ktor.response.respond
import io.ktor.routing.Route
import io.ktor.routing.get
import io.ktor.routing.post
import io.ktor.routing.route
import io.ktor.util.pipeline.PipelineContext
import no.nav.etterlatte.common.innloggetBrukerFnr
import no.nav.etterlatte.common.retry
import java.time.LocalDate
import java.time.ZoneId

fun Route.soknadApi(innsendtSoeknadEndpint: HttpClient) {
    route("/api/soeknad") {
        post {
            call.application.environment.log.debug("Mottatt søknad for ${innloggetBrukerFnr()}")
            retry { videresendSoeknad(innsendtSoeknadEndpint, "soeknad") }.also { svarKlient(it) }
        }
    }
    route("/api/kladd") {
        post {
            call.application.environment.log.debug("Mottatt kladd for ${innloggetBrukerFnr()}")
            retry { videresendSoeknad(innsendtSoeknadEndpint, "kladd") }.also { svarKlient(it) }
        }
        get {
            retry { innsendtSoeknadEndpint.get<JsonNode>("kladd") }.also { svarKlient(it) }
        }
    }
}

private suspend fun PipelineContext<Unit, ApplicationCall>.videresendSoeknad(
    innsendtSoeknadEndpint: HttpClient,
    endpoint: String
) = innsendtSoeknadEndpint.post<String> (endpoint){
    contentType(ContentType.Application.Json)
    body = call.receive<JsonNode>().also(::addMottattDato)
}

private suspend fun PipelineContext<Unit, ApplicationCall>.svarKlient(resultat: Pair<Any?, List<Exception>>) {
    resultat.first?.also {
        call.application.environment.log.info("Lagret ny søknad med id $it")
    }
    call.respond(resultat.first ?: HttpStatusCode.InternalServerError.also { loggSisteFeil(resultat.second) })
}

private fun PipelineContext<Unit, ApplicationCall>.loggSisteFeil(feil: List<Exception>) {
    call.application.environment.log.error(
        "Klarte ikke å sende søknad til innsendt-søknad",
        feil.last()
    )
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