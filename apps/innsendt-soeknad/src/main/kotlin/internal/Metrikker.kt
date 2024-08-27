package no.nav.etterlatte.internal

import io.ktor.server.application.call
import io.ktor.server.response.respond
import io.ktor.server.routing.Route
import io.ktor.server.routing.get
import io.ktor.server.routing.route
import io.micrometer.prometheusmetrics.PrometheusConfig
import io.micrometer.prometheusmetrics.PrometheusMeterRegistry
import no.nav.etterlatte.internal.Metrikker.registry

object Metrikker {
    val registry = PrometheusMeterRegistry(PrometheusConfig.DEFAULT)
}

fun Route.metricsApi() {
    route("internal") {
        get("metrics") {
            call.respond(registry.scrape())
        }
    }
}