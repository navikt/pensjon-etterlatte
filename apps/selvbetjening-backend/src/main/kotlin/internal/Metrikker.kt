package no.nav.etterlatte.internal

import io.ktor.server.application.call
import io.ktor.server.response.respond
import io.ktor.server.routing.Route
import io.ktor.server.routing.get
import io.ktor.server.routing.route
import io.micrometer.core.instrument.Clock
import io.micrometer.prometheus.PrometheusConfig
import io.micrometer.prometheus.PrometheusMeterRegistry
import io.prometheus.client.CollectorRegistry
import no.nav.etterlatte.internal.Metrikker.registry

object Metrikker {
    private val collectorRegistry = CollectorRegistry.defaultRegistry

    val registry =
        PrometheusMeterRegistry(
            PrometheusConfig.DEFAULT,
            collectorRegistry,
            Clock.SYSTEM,
        )
    // TODO
}

fun Route.metricsApi() {
    route("internal") {
        get("metrics") {
            call.respond(registry.scrape())
        }
    }
}