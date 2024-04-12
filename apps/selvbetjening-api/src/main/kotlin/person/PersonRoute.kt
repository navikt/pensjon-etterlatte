package no.nav.etterlatte.person

import io.ktor.server.application.call
import io.ktor.server.response.respondText
import io.ktor.server.routing.Route
import io.ktor.server.routing.get
import io.ktor.server.routing.route
import no.nav.etterlatte.common.Auth.Companion.innloggetBrukerFnr
import no.nav.etterlatte.common.toJson
import no.nav.etterlatte.libs.common.innsendtsoeknad.common.SoeknadType

/**
 * Endepunkter for uthenting av person
 */
fun Route.personApi(service: PersonService) {
    route("person") {
        get("innlogget") {
            val soeknadType = SoeknadType.valueOf(call.request.queryParameters["soeknadType"]!!)

            val fnr = innloggetBrukerFnr()

            val person = service.hentPerson(fnr, soeknadType)

            call.respondText(person.toJson())
        }
    }
}
