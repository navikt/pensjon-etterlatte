package no.nav.etterlatte.person

import io.ktor.application.call
import io.ktor.auth.principal
import io.ktor.response.respondText
import io.ktor.routing.Route
import io.ktor.routing.get
import io.ktor.routing.route
import no.nav.etterlatte.common.toJson
import no.nav.security.token.support.ktor.TokenValidationContextPrincipal

/**
 * Endepunkter for uthenting av person
 */
fun Route.personApi(client: PersonClient) {
    route("person") {
        get("innlogget") {
            val fnr = call.principal<TokenValidationContextPrincipal>()?.context!!
                .getClaims("tokenx")
                .getStringClaim("pid")

            call.application.environment.log.info("Henter innlogget person med fnr: $fnr")

            val person = client.hentPerson(fnr)

            call.respondText(person.toJson())
        }

        get("{fnr}") {
            val fnr = call.parameters["fnr"]!!

            val person = client.hentPerson(fnr)

            call.respondText(person.toJson())
        }
    }
}
