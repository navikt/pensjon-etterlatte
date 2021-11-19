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
import no.nav.etterlatte.libs.common.soeknad.Soeknad
import no.nav.etterlatte.soeknad.finnSoekere
import no.nav.etterlatte.toJson

fun Route.soeknadApi(db: SoeknadRepository) {
    post("/api/soeknad") {
        val soeknad = call.receive<Soeknad>()
        val soekere = finnSoekere(soeknad, fnrFromToken())

        soekere.forEach { soeker ->
            val oppdatertSoeknad = soeknad.copy(soeknadsType = soeker.type)
            db.ferdigstillSoeknad(UlagretSoeknad(soeker.fnr, oppdatertSoeknad.toJson()))
        }

        call.respond(HttpStatusCode.OK)
    }

    route("/api/kladd") {
        post {
            val soknad = call.receive<JsonNode>()
            val lagretkladd = db.lagreKladd(UlagretSoeknad(fnrFromToken(), soknad.toJson()))
            call.respondText(lagretkladd.id.toString(), ContentType.Text.Plain)
        }

        delete {
            db.slettKladd(fnrFromToken())
            call.respond(HttpStatusCode.OK)
        }

        get {
            val soeknad = db.finnSoeknad(fnrFromToken())

            if (soeknad == null)
                call.respond(HttpStatusCode.NotFound)
            else if (soeknad.status != Status.LAGRETKLADD)
                call.respond(HttpStatusCode.Conflict)
            else
                call.respond(soeknad)
        }
    }
}
