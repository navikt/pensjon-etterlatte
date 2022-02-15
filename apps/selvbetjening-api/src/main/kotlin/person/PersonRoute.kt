package no.nav.etterlatte.person

import io.ktor.application.call
import io.ktor.response.respondText
import io.ktor.routing.Route
import io.ktor.routing.get
import io.ktor.routing.route
import no.nav.etterlatte.common.Auth.Companion.innloggetBrukerFnr
import no.nav.etterlatte.common.toJson

/**
 * Endepunkter for uthenting av person
 */
fun Route.personApi(service: PersonService) {
    route("person") {
        get("innlogget") {
            val fnr = innloggetBrukerFnr()

            val person = service.hentPerson(fnr)

            call.respondText(person.toJson())
        }
    }
}
