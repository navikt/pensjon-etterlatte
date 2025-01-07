package no.nav.etterlatte.endringer

import io.ktor.http.HttpStatusCode
import io.ktor.server.application.call
import io.ktor.server.request.receive
import io.ktor.server.response.respond
import io.ktor.server.routing.Route
import io.ktor.server.routing.post
import io.ktor.server.routing.route
import no.nav.etterlatte.fnrFromToken
import no.nav.etterlatte.libs.common.person.Foedselsnummer
import no.nav.etterlatte.no.nav.etterlatte.endringer.EndringerService
import java.time.Instant
import java.util.UUID

fun Route.endringer(service: EndringerService) {
    route("/api/endringer") {
        post {
            val fnr = fnrFromToken()
            val request = call.receive<EndringerRequest>()
            service.lagreEndringer(fnr, request)
            call.respond(HttpStatusCode.OK)
        }
    }
}

data class EndringerRequest(
    val type: EndringType,
    val endringer: String,
)

data class Endringer(
    val id: UUID,
    val fnr: Foedselsnummer,
    val type: EndringType,
    val endringer: String,
    val tidspunkt: Instant,
)

enum class EndringType {
    INNTEKT,
    INNTEKT_OG_AKTIVITET,
    ANNET,
}