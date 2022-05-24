package no.nav.etterlatte

import io.ktor.application.Application
import io.ktor.application.install
import io.ktor.auth.authenticate
import io.ktor.features.CallLogging
import io.ktor.features.ContentNegotiation
import io.ktor.http.ContentType
import io.ktor.jackson.JacksonConverter
import io.ktor.request.header
import io.ktor.request.path
import io.ktor.routing.IgnoreTrailingSlash
import io.ktor.routing.route
import io.ktor.routing.routing
import kotlinx.coroutines.runBlocking
import no.nav.etterlatte.routes.dok
import no.nav.etterlatte.routes.internal
import no.nav.etterlatte.routes.kodeverk
import no.nav.etterlatte.libs.common.logging.CORRELATION_ID
import no.nav.etterlatte.libs.common.logging.X_CORRELATION_ID
import org.slf4j.event.Level
import java.util.*

fun main(args: Array<String>): Unit = io.ktor.server.netty.EngineMain.main(args)

@Suppress("unused") // Referenced in application.conf
fun Application.module() {
    val config = runBlocking { environment.config.load() }
    val stsClient = StsClient(config.sts)
    installAuthentication(config.aad, config.tokenX)

    install(ContentNegotiation) {
        register(ContentType.Application.Json, JacksonConverter())
    }
    install(IgnoreTrailingSlash)

    install(CallLogging) {
        level = Level.INFO
        filter { call -> !call.request.path().startsWith("/internal") }
        mdc(CORRELATION_ID) { call -> call.request.header(X_CORRELATION_ID) ?: UUID.randomUUID().toString() }
    }

    routing {
        internal()
        authenticate("aad") {
            route("/aad") {
                dok(config, stsClient)
            }
        }
        authenticate("tokenX") {
            route("/tokenx") {
                kodeverk(config)
            }
        }
    }
}

