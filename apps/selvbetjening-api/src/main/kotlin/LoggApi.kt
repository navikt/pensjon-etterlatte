package no.nav.etterlatte

import io.ktor.http.HttpStatusCode
import io.ktor.server.application.call
import io.ktor.server.application.log
import io.ktor.server.request.receive
import io.ktor.server.response.respond
import io.ktor.server.routing.Route
import io.ktor.server.routing.application
import io.ktor.server.routing.post
import io.ktor.server.routing.route

fun Route.loggApi() {
    val logger = application.log
    route("logg") {
        post("") {
            val request = call.receive<LoggRequest>()
            logger.info(request.message)
            call.respond(HttpStatusCode.OK)
        }
    }
}

data class LoggRequest(val message: String)

