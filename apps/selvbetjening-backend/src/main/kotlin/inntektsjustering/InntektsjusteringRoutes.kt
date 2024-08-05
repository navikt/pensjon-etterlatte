package no.nav.etterlatte.inntektsjustering

import io.ktor.http.HttpStatusCode
import io.ktor.server.application.call
import io.ktor.server.response.respond
import io.ktor.server.routing.Route
import io.ktor.server.routing.post
import io.ktor.server.routing.route

fun Route.inntektsjustering(
	service: InntektsjusteringService
) {
	route("/api/inntektsjustering") {
		post {
			// TODO
			call.respond(HttpStatusCode.OK)
		}
	}
}