package no.nav.etterlatte.person

import io.ktor.application.*
import io.ktor.http.*
import io.ktor.response.*
import io.ktor.routing.*
import no.nav.etterlatte.common.innloggetBrukerFnr
import no.nav.etterlatte.common.toJson
import no.nav.etterlatte.libs.common.person.Foedselsnummer
import no.nav.etterlatte.libs.common.person.InvalidFoedselsnummer

/**
 * Endepunkter for uthenting av person
 */
fun Route.personApi(service: PersonService) {
    route("person") {
        get("innlogget") {
            val fnr = innloggetBrukerFnr()

            call.application.environment.log.debug("Henter innlogget person med fnr: $fnr")

            val person = service.hentPerson(fnr)

            call.respondText(person.toJson())
        }

        get("{fnr}") {
            val innloggetFnr = innloggetBrukerFnr()
            val fnr = Foedselsnummer.of(call.parameters["fnr"]!!)

            if (innloggetFnr != innloggetFnr)
                call.respond(HttpStatusCode.Forbidden)

            val person = service.hentPerson(fnr)

            call.respondText(person.toJson())
        }

        get("/gyldig/{fnr}") {
            try {
                val fnr = Foedselsnummer.of(call.parameters["fnr"]!!)
                when (service.gyldigFnr(fnr)) {
                    true -> call.respond(HttpStatusCode.OK)
                    false -> call.respond(HttpStatusCode.NotFound)
                }
            } catch (ex: InvalidFoedselsnummer) {
                call.respond(HttpStatusCode.NotFound)
            }
        }
    }
}
