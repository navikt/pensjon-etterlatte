package no.nav.etterlatte.internal

import io.ktor.client.HttpClient
import io.ktor.client.request.get
import io.ktor.client.request.header
import io.ktor.http.ContentType
import io.ktor.http.HttpStatusCode
import io.ktor.http.contentType
import io.ktor.http.isSuccess
import io.ktor.server.application.call
import io.ktor.server.response.respond
import io.ktor.server.routing.Route
import io.ktor.server.routing.get
import io.ktor.server.routing.route
import no.nav.etterlatte.libs.utils.logging.X_CORRELATION_ID
import no.nav.etterlatte.libs.utils.logging.getCorrelationId

fun Route.selftestApi(unsecuredSoeknadHttpClient: HttpClient) {
    route("internal") {
        get("selftest") {
            val statusinnsendtSoeknad = unsecuredSoeknadHttpClient.get("/isready") {
                contentType(ContentType.Application.Json)
                header(X_CORRELATION_ID, getCorrelationId())
            }.status
            if(statusinnsendtSoeknad.isSuccess()) {
                call.respond(HttpStatusCode.OK)
            } else {
                call.respond(HttpStatusCode.InternalServerError)
            }
        }
    }
}