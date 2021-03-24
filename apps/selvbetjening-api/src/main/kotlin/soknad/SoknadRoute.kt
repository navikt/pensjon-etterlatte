package no.nav.etterlatte.soknad

import io.ktor.application.call
import io.ktor.http.HttpStatusCode
import io.ktor.request.receive
import io.ktor.response.respond
import io.ktor.routing.Route
import io.ktor.routing.post
import io.ktor.routing.route
import org.slf4j.LoggerFactory


fun Route.soknadApi() {
    route("soknad") {
        post {
            val soknad = call.receive<Any>()

            call.respond(HttpStatusCode.OK)
        }
    }
}