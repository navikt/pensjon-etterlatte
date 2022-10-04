package soeknad

import com.fasterxml.jackson.databind.JsonNode
import io.ktor.http.ContentType
import io.ktor.http.HttpStatusCode
import io.ktor.server.application.call
import io.ktor.server.request.receive
import io.ktor.server.response.respond
import io.ktor.server.response.respondText
import io.ktor.server.routing.Route
import io.ktor.server.routing.delete
import io.ktor.server.routing.get
import io.ktor.server.routing.post
import io.ktor.server.routing.route
import no.nav.etterlatte.fnrFromToken
import no.nav.etterlatte.soeknad.SoeknadConflictException
import no.nav.etterlatte.soeknad.SoeknadService

fun Route.soeknadApi(service: SoeknadService) {
    post("/api/soeknad") {
        call.application.environment.log.info("SoeknadRequest mottatt i innsendt-soeknad!")

        try {
            val kilde = call.request.queryParameters["kilde"]!!
            val ferdigstiltOK = service.sendSoeknad(fnrFromToken(), call.receive(), kilde)

            call.application.environment.log.info("SoeknadRequest ferdigstilt ok: $ferdigstiltOK")
            call.respond(HttpStatusCode.OK)
        } catch (e: SoeknadConflictException) {
            call.application.environment.log.warn("Bruker har allerede en innsendt søknad under arbeid", e)
            call.respond(HttpStatusCode.Conflict)
        } catch (e: Exception) {
            call.application.environment.log.error("Klarte ikke å lagre søknaden(e)", e)
            throw e
        }
    }

    route("/api/kladd") {
        post {
            val id = service.lagreKladd(fnrFromToken(), call.receive<JsonNode>(), call.request.queryParameters["kilde"]!!)

            call.respondText(id.toString(), ContentType.Text.Plain)
        }

        delete {
            service.slettKladd(fnrFromToken(), call.request.queryParameters["kilde"]!!)

            call.respond(HttpStatusCode.OK)
        }

        get {
            val soeknad = service.hentKladd(fnrFromToken(), call.request.queryParameters["kilde"]!!)

            if (soeknad == null)
                call.respond(HttpStatusCode.NotFound)
            else if (soeknad.status != Status.LAGRETKLADD)
                call.respond(HttpStatusCode.Conflict)
            else
                call.respond(soeknad)
        }
    }
}
