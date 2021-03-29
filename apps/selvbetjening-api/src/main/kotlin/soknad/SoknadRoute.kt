package no.nav.etterlatte.soknad

import com.fasterxml.jackson.databind.JsonNode
import io.ktor.application.call
import io.ktor.http.HttpStatusCode
import io.ktor.request.receive
import io.ktor.response.respond
import io.ktor.routing.Route
import io.ktor.routing.post
import io.ktor.routing.route
import no.nav.etterlatte.Rapid
import no.nav.etterlatte.common.toJson


fun Route.soknadApi(rapid: Rapid) {
    route("soknad") {
        post {
            val soknad = call.receive<JsonNode>()
            rapid.publish(soknad.toJson()).join()
            call.respond(HttpStatusCode.OK)
        }
    }
}