package no.nav.etterlatte.soknad

import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.node.ObjectNode
import io.ktor.application.ApplicationCall
import io.ktor.application.call
import io.ktor.http.HttpStatusCode
import io.ktor.request.receive
import io.ktor.response.respond
import io.ktor.routing.Route
import io.ktor.routing.get
import io.ktor.routing.post
import io.ktor.routing.route
import io.ktor.util.pipeline.PipelineContext
import no.nav.etterlatte.common.RetryResult
import java.time.LocalDate
import java.time.ZoneId

fun Route.soknadApi(service: SoeknadService) {
    route("/api/soeknad") {
        post {
            val soeknadJson = call.receive<JsonNode>().also(::addMottattDato)

            val response = service.sendSoknad(soeknadJson)

            svarKlient(response)
        }
    }

    route("/api/kladd") {
        post {
            val soeknadJson = call.receive<JsonNode>().also(::addMottattDato)

            val response = service.lagreKladd(soeknadJson)

            svarKlient(response)
        }

        get {
            val response = service.hentKladd()

            svarKlient(response)
        }
    }
}

private suspend fun PipelineContext<Unit, ApplicationCall>.svarKlient(resultat: RetryResult) {
    if (resultat.response == null) {
        call.application.environment.log.error("Klarte ikke å sende søknad til innsendt-søknad", resultat.lastError())

        call.respond(HttpStatusCode.InternalServerError)
    } else {
        call.application.environment.log.info("Lagret ny søknad med id ${resultat.response}")

        call.respond(resultat.response)
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