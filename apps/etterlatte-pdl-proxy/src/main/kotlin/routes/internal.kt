package no.nav.etterlatte.routes

import io.ktor.application.call
import io.ktor.http.ContentType
import io.ktor.response.respondText
import io.ktor.response.respondTextWriter
import io.ktor.routing.Route
import io.ktor.routing.get
import io.ktor.routing.route
import io.prometheus.client.CollectorRegistry
import io.prometheus.client.exporter.common.TextFormat

fun Route.internal() {
    route("/internal") {
        get("/is_alive") {
            call.respondText { "Alive" }
        }
        get("/is_ready") {
            call.respondText { "Ready" }
        }
        get("/metrics") {
            val names = call.request.queryParameters.getAll("name[]")?.toSet() ?: emptySet()
            call.respondTextWriter(ContentType.parse(TextFormat.CONTENT_TYPE_004)) {
                TextFormat.write004(this, CollectorRegistry.defaultRegistry.filteredMetricFamilySamples(names))
            }
        }
    }
}
