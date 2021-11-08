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
import no.nav.etterlatte.common.RetryResult.Failure
import no.nav.etterlatte.common.RetryResult.Success
import no.nav.etterlatte.libs.common.soeknad.Soeknad

fun Route.soknadApi(service: SoeknadService) {
    route("/api/soeknad") {
        post {
            try {
                val soeknad = call.receive<Soeknad>().apply { imageTag = call.request.headers["ImageTag"] }
                when (val response = service.sendSoeknad(soeknad)) {
                    is Success -> {
                        call.application.environment.log.info("Søknad markert som ferdigstilt")
                        call.respond(HttpStatusCode.OK)
                    }
                    is Failure -> {
                        call.application.environment.log.error("Innsending av søknad feilet ", response.lastError())
                        call.respond(HttpStatusCode.InternalServerError)
                    }
                }
            } catch (ex: Exception) {
                call.application.environment.log.error("Klarte ikke å lagre søknad", ex)
            }
        }
    }

    route("/api/kladd") {
        post {
            val soeknadJson = call.receive<JsonNode>()
            when (val response = service.lagreKladd(soeknadJson)) {
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
            when (val response = service.hentKladd()) {
                is Success -> {
                    if (response.content == HttpStatusCode.NotFound) {
                        call.application.environment.log.info("Forsøkte å hente kladd som ikke finnes")
                        call.respond(HttpStatusCode.NotFound)
                    } else {
                        call.application.environment.log.info("Kladd hentet OK")
                        call.respond(response.content ?: throw Exception("Lagret kladd funnet uten innhold"))
                    }
                }
                is Failure -> {
                    call.application.environment.log.error("Klarte ikke å hente kladd", response.lastError())
                    call.respond(HttpStatusCode.InternalServerError)
                }
            }
        }

        delete {
            when (val response = service.slettKladd()) {
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
