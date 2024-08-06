package no.nav.etterlatte.inntektsjustering

import io.ktor.http.HttpStatusCode
import io.ktor.server.application.call
import io.ktor.server.request.receive
import io.ktor.server.response.respond
import io.ktor.server.routing.Route
import io.ktor.server.routing.get
import io.ktor.server.routing.post
import io.ktor.server.routing.route

fun Route.inntektsjustering(
	service: InntektsjusteringService
) {
	route("/api/inntektsjustering") {
		get {
			val fnr = "123"
			val inntektsjustering = service.hentInntektsjustering(fnr)
			when (inntektsjustering) {
				null -> call.respond(HttpStatusCode.NotFound)
				else -> call.respond(inntektsjustering)
			}
		}
		post {
			val fnr = "123"
			val request = call.receive<Inntektsjustering>()
			service.lagreInntektsjustering(fnr, request)
			call.respond(HttpStatusCode.OK)
		}
	}
}