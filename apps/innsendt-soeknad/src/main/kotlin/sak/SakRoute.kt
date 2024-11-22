package no.nav.etterlatte.sak

import io.ktor.server.application.call
import io.ktor.server.response.respond
import io.ktor.server.routing.Route
import io.ktor.server.routing.get
import io.ktor.server.routing.route
import no.nav.etterlatte.fnrFromToken

fun Route.sak(service: SakService) {
    route("/api/sak") {
        route("/oms") {
            get("/har_sak") {
                val fnr = fnrFromToken()

                val harOMSSak = service.harOMSSak(fnr)

                call.respond(HarOMSSakIGjennyResponse(harOMSSak))
            }
        }
    }
}