package no.nav.etterlatte.soknad

import com.fasterxml.jackson.databind.JsonNode
import io.ktor.application.call
import io.ktor.http.HttpStatusCode
import io.ktor.request.receive
import io.ktor.response.respond
import io.ktor.routing.Route
import io.ktor.routing.delete
import io.ktor.routing.get
import io.ktor.routing.post
import io.ktor.routing.route
import no.nav.etterlatte.libs.common.soeknad.Soeknad

fun Route.soknadApi(service: SoeknadService) {
    route("/api/soeknad") {
        post {
            try {
                val soeknad = call.receive<Soeknad>()
                    .apply { imageTag = call.request.headers["ImageTag"] }
                val response = service.sendSoeknad(soeknad)

                if (response.response == null) {
                    call.application.environment.log.error("Innsending av søknad feilet ", response.lastError())
                    call.respond(HttpStatusCode.InternalServerError)
                } else {
                    call.application.environment.log.info("Søknad ${response.response} markert som ferdigstilt")
                    call.respond(response.response)
                }
            } catch (ex: Exception) {
                call.application.environment.log.error("Klarte ikke å lagre søknad", ex.message)
            }
        }
    }

    route("/api/kladd") {
        post {
            val soeknadJson = call.receive<JsonNode>()

            val response = service.lagreKladd(soeknadJson)

            if (response.response == null) {
                call.application.environment.log.error("Klarte ikke å lagre kladd", response.lastError())
                call.respond(HttpStatusCode.InternalServerError)
            } else {
                call.application.environment.log.info("Lagret ny kladd med id ${response.response}")

                call.respond(response.response)
            }
        }

        get {
            val response = service.hentKladd()

            if (response.response == null) {
                call.application.environment.log.error("Klarte ikke å hente kladd", response.lastError())

                call.respond(HttpStatusCode.InternalServerError)
            } else {
                if (response.response == HttpStatusCode.NotFound) {
                    call.application.environment.log.info("Forsøkte å hente kladd som ikke finnes")
                } else {
                    call.application.environment.log.info("Kladd hentet OK")
                }

                call.respond(response.response)
            }
        }

        delete {
            val response = service.slettKladd()

            if (response.response == null) {
                call.application.environment.log.error("klarte ikke å slette kladd", response.lastError())
                call.respond(HttpStatusCode.InternalServerError)
            } else {
                call.application.environment.log.info("klarte å slette kladd")
                call.respond(response.response)
            }
        }
    }
}
