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
import io.prometheus.client.Counter
import no.nav.etterlatte.internal.Metrikker.registry

object Metrikker {
    private val collectorRegistry = CollectorRegistry.defaultRegistry

    val registry = PrometheusMeterRegistry(
        PrometheusConfig.DEFAULT,
        collectorRegistry,
        Clock.SYSTEM
    )

    val soeknadTotal = Counter.build()
        .name("etterlatte_soeknad_total")
        .help("Teller alle mottatte søknader")
        .labelNames("type")
        .register(collectorRegistry)

    val soeknadGradertTotal = Counter.build()
        .name("etterlatte_soeknad_gradert_total")
        .help("Teller mottatte søknader som inneholder gradert person")
        .register(collectorRegistry)
}

fun Route.metricsApi() {
    route("internal") {
        get("metrics") {
            call.respond(registry.scrape())
        }
    }
}
