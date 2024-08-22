package no.nav.etterlatte.soeknad

import com.fasterxml.jackson.databind.JsonNode
import io.ktor.http.HttpStatusCode
import io.ktor.server.application.call
import io.ktor.server.request.receive
import io.ktor.server.response.respond
import io.ktor.server.routing.Route
import io.ktor.server.routing.delete
import io.ktor.server.routing.get
import io.ktor.server.routing.post
import io.ktor.server.routing.route
import no.nav.etterlatte.fnrFromToken
import no.nav.etterlatte.libs.common.innsendtsoeknad.common.SoeknadRequest
import soeknad.Status

fun Route.soknadApi(service: SoeknadService) {
    route("/api/soeknad") {
        post {
            try {
                call.application.environment.log
                    .info("SoeknadRequest mottatt!")

                val request = call.receive<SoeknadRequest>()
                val kilde = call.request.queryParameters["kilde"]!!

                val ferdigstiltOK  = service.sendSoeknad(fnrFromToken(), request, kilde)

                call.application.environment.log.info("SoeknadRequest ferdigstilt ok: $ferdigstiltOK")
                call.respond(HttpStatusCode.OK)
            } catch (e: SoeknadConflictException) {
                call.application.environment.log.warn("Bruker har allerede en innsendt søknad under arbeid", e)
                call.respond(HttpStatusCode.Conflict)
            } catch (e: Exception) {
                call.application.environment.log.error("Klarte ikke å lagre søknaden(e)", e)
                call.respond(HttpStatusCode.InternalServerError)
            }
        }
    }

    route("/api/kladd") {
        post {
            val kilde = call.request.queryParameters["kilde"]!!
            val soeknadJson = call.receive<JsonNode>()
            try {
                val response = service.lagreKladd(fnrFromToken(), soeknadJson, kilde)
                call.application.environment.log
                    .info("Lagret ny kladd med id $response")
                call.respond(response)
            } catch (e: Exception) {
                call.application.environment.log
                    .error("Klarte ikke å lagre kladd", e)
                call.respond(HttpStatusCode.InternalServerError)
            }
        }

        get {
            val kilde = call.request.queryParameters["kilde"]!!

            try {
                val soeknad = service.hentKladd(fnrFromToken(), kilde)
                if (soeknad == null) {
                    call.application.environment.log.info("Forsøkte å hente kladd som ikke finnes")
                    call.respond(HttpStatusCode.NotFound)
                } else if (soeknad.status != Status.LAGRETKLADD) {
                    call.application.environment.log.info("Bruker har allerede innsendt søknad under arbeid.")
                    call.respond(HttpStatusCode.Conflict)
                } else {
                    call.application.environment.log.info("Kladd hentet OK")
                    call.respond(soeknad)
                }
            } catch (e: Exception) {
                call.application.environment.log.error("Klarte ikke å hente kladd", e)
                call.respond(HttpStatusCode.InternalServerError)
            }
        }

        delete {
            val kilde = call.request.queryParameters["kilde"]!!
            try {
                service.slettKladd(fnrFromToken(), kilde)
                call.application.environment.log.info("klarte å slette kladd")
                call.respond(HttpStatusCode.OK)
            } catch (e: Exception) {
                call.application.environment.log.error("klarte ikke å slette kladd", e)
                call.respond(HttpStatusCode.InternalServerError)
            }
        }
    }
}