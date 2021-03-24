package no.nav.etterlatte.person

import io.ktor.application.call
import io.ktor.http.HttpStatusCode
import io.ktor.response.respond
import io.ktor.response.respondText
import io.ktor.routing.Route
import io.ktor.routing.get
import io.ktor.routing.route
import no.nav.etterlatte.common.toJson

/**
 * Endepunkter for uthenting av person
 */
fun Route.personApi(client: PersonClient) {
    route("person") {
        get("innlogget") {
            val fnr = "fnr-fra-token"

            val person = client.hentPerson(fnr)

            call.respondText { person.toJson() }
        }

        get("{fnr}") {
            val fnr = call.parameters["fnr"]!!

            val person = client.hentPerson(fnr)

            call.respond(HttpStatusCode.OK, person)
        }
    }
}
