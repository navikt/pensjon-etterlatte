package no.nav.etterlatte.soknad

import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.node.ObjectNode
import io.ktor.application.call
import io.ktor.http.HttpStatusCode
import io.ktor.request.receive
import io.ktor.response.respond
import io.ktor.routing.Route
import io.ktor.routing.post
import io.ktor.routing.route
import no.nav.etterlatte.Rapid
import no.nav.etterlatte.ThreadBoundSecCtx
import no.nav.etterlatte.common.toJson

val mapper: ObjectMapper = ObjectMapper()

fun Route.soknadApi(rapid: Rapid) {
    route("soknad") {
        post {
            val fnr = ThreadBoundSecCtx.get().user()!!
            call.application.environment.log.info("Mottatt søknad for $fnr")

            val soknad = call.receive<JsonNode>()

            val rapidMessage = mapper.createObjectNode()
            rapidMessage.put("@event_name", "soeknad_innsendt")
            rapidMessage.set<ObjectNode>("@skjema_info", soknad)
            rapidMessage.set<ObjectNode>("@journalpostInfo", mapper.valueToTree(JournalPostInfo("tittel", AvsenderMottaker(fnr, "navn", "FNR"), Bruker(fnr, "FNR"))))
            rapidMessage.put("@template", "soeknad")

            rapid.publish(rapidMessage.toJson()).join()
            call.respond(HttpStatusCode.OK)
        }
    }
}

data class JournalPostInfo(
    val tittel: String,
    val avsenderMottaker: AvsenderMottaker,
    val bruker: Bruker
    )

data class AvsenderMottaker(
    val id: String,
    val navn:String,
    val idType: String
)

data class Bruker(
    val id: String,
    val idType: String
)