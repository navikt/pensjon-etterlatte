package no.nav.etterlatte.person

import io.ktor.server.application.call
import io.ktor.server.response.respond
import io.ktor.server.routing.Route
import io.ktor.server.routing.get
import io.ktor.server.routing.route
import no.nav.etterlatte.fnrFromToken

fun Route.person(service: PersonService) {
    route("/api/person/innlogget/forenklet") {
        get {
            val fnr = fnrFromToken()

            val person = service.hentPerson(fnr)

            call.respond(person)
        }
    }
}