package no.nav.etterlatte.internal

import io.ktor.http.HttpStatusCode
import io.ktor.server.application.call
import io.ktor.server.response.respond
import io.ktor.server.routing.Route
import io.ktor.server.routing.get
import io.ktor.server.routing.route

fun Route.selftestApi() {
    route("internal") {
        get("selftest") {
            call.respond(HttpStatusCode.OK)
        }
    }
}