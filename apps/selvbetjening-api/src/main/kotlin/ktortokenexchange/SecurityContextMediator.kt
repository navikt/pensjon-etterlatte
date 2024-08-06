package no.nav.etterlatte.ktortokenexchange

import io.ktor.server.application.Application
import io.ktor.server.routing.Route

object ThreadBoundSecCtx : ThreadLocal<SecurityContext>()

interface SecurityContext {
    fun user(): String?
}

fun Route.secureRoutUsing(
    ctx: TokenSupportSecurityContextMediator,
    route: Route.() -> Unit
) {
    ctx.secureRoute(this, route)
}

fun Application.installAuthUsing(ctx: TokenSupportSecurityContextMediator) {
    ctx.installSecurity(this)
}