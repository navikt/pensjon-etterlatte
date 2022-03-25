package soeknad

import com.fasterxml.jackson.databind.JsonNode
import io.ktor.application.call
import io.ktor.http.ContentType
import io.ktor.http.HttpStatusCode
import io.ktor.request.receive
import io.ktor.response.respond
import io.ktor.response.respondText
import io.ktor.routing.Route
import io.ktor.routing.delete
import io.ktor.routing.get
import io.ktor.routing.post
import io.ktor.routing.route
import no.nav.etterlatte.fnrFromToken
import no.nav.etterlatte.soeknad.SoeknadService

fun Route.soeknadApi(service: SoeknadService) {
    post("/api/soeknad") {
        call.application.environment.log.info("SoeknadRequest mottatt i innsendt-soeknad!")

        try {
            val kilde = call.request.queryParameters["kilde"]!!
            val ferdigstiltOK = service.sendSoeknad(fnrFromToken(), call.receive(), kilde)
            call.application.environment.log.info("SoeknadRequest ferdigstilt ok: $ferdigstiltOK")
        } catch (e: Exception) {
            call.application.environment.log.error("Klarte ikke å lagre søknaden(e)", e)
            throw e
        }

        call.respond(HttpStatusCode.OK)
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
