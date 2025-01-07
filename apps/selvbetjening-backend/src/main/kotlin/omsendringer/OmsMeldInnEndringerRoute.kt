package no.nav.etterlatte.omsendringer

import io.ktor.http.HttpStatusCode
import io.ktor.server.application.call
import io.ktor.server.request.receive
import io.ktor.server.response.respond
import io.ktor.server.routing.Route
import io.ktor.server.routing.post
import io.ktor.server.routing.route
import no.nav.etterlatte.fnrFromToken
import no.nav.etterlatte.libs.common.person.Foedselsnummer
import java.time.Instant
import java.util.UUID

fun Route.omsMeldInnEndring(service: OmsMeldInnEndringService) {
    route("/api/oms/meld_inn_endringer") {
        post {
            val fnr = fnrFromToken()
            val request = call.receive<OmsMeldtInnEndringRequest>()
            service.lagreEndringer(fnr, request)
            call.respond(HttpStatusCode.OK)
        }
    }
}

data class OmsMeldtInnEndringRequest(
    val type: OmsEndringType,
    val endringer: String,
)

data class OmsMeldtInnEndring(
    val id: UUID,
    val fnr: Foedselsnummer,
    val type: OmsEndringType,
    val endringer: String,
    val tidspunkt: Instant,
)

enum class OmsEndringType {
    INNTEKT,
    INNTEKT_OG_AKTIVITET,
    ANNET,
}