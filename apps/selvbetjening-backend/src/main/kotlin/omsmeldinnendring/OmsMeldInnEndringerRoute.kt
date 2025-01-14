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
import java.time.temporal.ChronoUnit
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
    val type: OmsEndring,
    val endringer: String,
)

data class OmsMeldtInnEndring(
    val id: UUID = UUID.randomUUID(),
    val fnr: Foedselsnummer,
    val endring: OmsEndring,
    val beskrivelse: String,
    val tidspunkt: Instant = Instant.now().truncatedTo(ChronoUnit.SECONDS),
)

enum class OmsEndring {
    INNTEKT,
    AKTIVITET_OG_INNTEKT,
    ANNET,
}

enum class OmsMeldtInnEndringStatus {
    LAGRET,
    SENDT,
    FERDIGSTILT,
}