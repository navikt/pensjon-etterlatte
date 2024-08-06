package no.nav.etterlatte.ktortokenexchange

import com.typesafe.config.Config
import io.ktor.server.application.Application
import io.ktor.server.config.HoconApplicationConfig
import io.ktor.server.routing.Route

object ThreadBoundSecCtx : ThreadLocal<SecurityContext>()

interface SecurityContext {
    fun user(): String?
}

interface SecurityContextMediator {
    fun outgoingToken(audience: String): suspend () -> String

    fun installSecurity(ktor: Application)

    fun secureRoute(
        ctx: Route,
        block: Route.() -> Unit
    )
}

object SecurityContextMediatorFactory {
    fun from(config: Config) = TokenSupportSecurityContextMediator(HoconApplicationConfig(config))
}

fun Route.secureRoutUsing(
    ctx: SecurityContextMediator,
    route: Route.() -> Unit
) {
    ctx.secureRoute(this, route)
}

fun Application.installAuthUsing(ctx: SecurityContextMediator) {
    ctx.installSecurity(this)
}