package no.nav.etterlatte.ktortokenexchange

import io.ktor.server.routing.Route

object ThreadBoundSecCtx : ThreadLocal<TokenSecurityContext>()

fun Route.secureRoutUsing(
    ctx: TokenSupportSecurityContextMediator,
    route: Route.() -> Unit
) {
    ctx.secureRoute(this, route)
}