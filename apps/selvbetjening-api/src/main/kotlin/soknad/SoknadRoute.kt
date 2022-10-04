package no.nav.etterlatte.soknad

import com.fasterxml.jackson.databind.JsonNode
import io.ktor.client.plugins.ClientRequestException
import io.ktor.http.HttpStatusCode
import io.ktor.server.application.call
import io.ktor.server.request.receive
import io.ktor.server.response.respond
import io.ktor.server.routing.Route
import io.ktor.server.routing.delete
import io.ktor.server.routing.get
import io.ktor.server.routing.post
import io.ktor.server.routing.route
import libs.common.util.RetryResult.Failure
import libs.common.util.RetryResult.Success
import no.nav.etterlatte.libs.common.innsendtsoeknad.common.SoeknadRequest


fun Route.soknadApi(service: SoeknadService) {
    route("/api/soeknad") {
        post {
            try {
                call.application.environment.log.info("SoeknadRequest mottatt!")

                val request = call.receive<SoeknadRequest>()
                val kilde = call.request.queryParameters["kilde"]!!

                when (val response = service.sendSoeknader(request, kilde)) {
                    is Success -> {
                        call.application.environment.log.info("Søknad markert som ferdigstilt")
                        call.respond(HttpStatusCode.OK)
                    }
                    is Failure -> {
                        val error = response.lastError()
                        call.application.environment.log.error("Innsending av søknad feilet ", error)

                        if (error is ClientRequestException) call.respond(error.response.status)
                        else call.respond(HttpStatusCode.InternalServerError)
                    }
                }
            } catch (ex: Exception) {
                call.application.environment.log.error("Klarte ikke å lagre søknad", ex)
            }
        }
    }

    route("/api/kladd") {
        post {
            val kilde = call.request.queryParameters["kilde"]!!
            val soeknadJson = call.receive<JsonNode>()
            when (val response = service.lagreKladd(soeknadJson, kilde)) {
                is Success -> {
                    call.application.environment.log.info("Lagret ny kladd med id ${response.content}")
                    call.respond(response.content ?: HttpStatusCode.OK)
                }
                is Failure -> {
                    call.application.environment.log.error("Klarte ikke å lagre kladd", response.lastError())
                    call.respond(HttpStatusCode.InternalServerError)
                }
            }
        }

        get {
            val kilde = call.request.queryParameters["kilde"]!!
            when (val response = service.hentKladd(kilde)) {
                is Success -> {
                    when (response.content) {
                        HttpStatusCode.NotFound -> {
                            call.application.environment.log.info("Forsøkte å hente kladd som ikke finnes")
                            call.respond(HttpStatusCode.NotFound)
                        }
                        HttpStatusCode.Conflict -> {
                            call.application.environment.log.info("Bruker har allerede innsendt søknad under arbeid.")
                            call.respond(HttpStatusCode.Conflict)
                        }
                        else -> {
                            call.application.environment.log.info("Kladd hentet OK")
                            call.respond(response.content ?: throw Exception("Lagret kladd funnet uten innhold"))
                        }
                    }
                }
                is Failure -> {
                    call.application.environment.log.error("Klarte ikke å hente kladd", response.lastError())
                    call.respond(HttpStatusCode.InternalServerError)
                }
            }
        }

        delete {
            val kilde = call.request.queryParameters["kilde"]!!
            when (val response = service.slettKladd(kilde)) {
                is Success -> {
                    call.application.environment.log.info("klarte å slette kladd")
                    call.respond(response.content ?: HttpStatusCode.NoContent)
                }
                is Failure -> {
                    call.application.environment.log.error("klarte ikke å slette kladd", response.lastError())
                    call.respond(HttpStatusCode.InternalServerError)
                }
            }
        }
    }
}
