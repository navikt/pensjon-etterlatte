package no.nav.etterlatte.kodeverk

import io.ktor.server.application.call
import io.ktor.server.response.respondText
import io.ktor.server.routing.Route
import io.ktor.server.routing.get
import io.ktor.server.routing.route
import no.nav.etterlatte.common.toJson

fun Route.kodeverkApi(service: KodeverkService) {
    route("kodeverk") {
        get("alleland") {
            val landListe = service.hentAlleLand()
            call.respondText(landListe.toJson())
        }

        get("valutaer") {
            val valutaer = service.hentValutaer()
            call.respondText(valutaer.toJson())
        }
    }
}