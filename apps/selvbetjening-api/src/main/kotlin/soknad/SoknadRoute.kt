package no.nav.etterlatte.soknad

import com.fasterxml.jackson.databind.JsonNode
import io.ktor.application.call
import io.ktor.client.HttpClient
import io.ktor.client.request.post
import io.ktor.client.statement.HttpStatement
import io.ktor.http.ContentType
import io.ktor.http.HttpStatusCode
import io.ktor.http.contentType
import io.ktor.http.isSuccess
import io.ktor.request.receive
import io.ktor.response.respond
import io.ktor.routing.Route
import io.ktor.routing.post
import io.ktor.routing.route
import no.nav.etterlatte.ThreadBoundSecCtx

fun Route.soknadApi(innsendtSoeknadEndpint: HttpClient) {
    route("/api/soeknad") {
        post {
            val fnr = ThreadBoundSecCtx.get().user()!!
            call.application.environment.log.info("Mottatt søknad for $fnr")
            val responseFromSoeknad = innsendtSoeknadEndpint.post<HttpStatement> {
                contentType(ContentType.Application.Json)
                body = call.receive<JsonNode>()
            }.execute()
            if(responseFromSoeknad.status.isSuccess())
                call.respond(HttpStatusCode.Created)
            else
                call.respond(HttpStatusCode.InternalServerError)
        }
    }
}