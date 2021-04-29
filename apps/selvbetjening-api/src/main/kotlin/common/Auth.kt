package no.nav.etterlatte.common

import io.ktor.application.ApplicationCall
import io.ktor.application.call
import io.ktor.auth.principal
import io.ktor.util.pipeline.PipelineContext
import no.nav.security.token.support.ktor.TokenValidationContextPrincipal

fun PipelineContext<Unit, ApplicationCall>.innloggetBrukerFnr() =
    call.principal<TokenValidationContextPrincipal>()?.context!!
        .getClaims("tokenx")
        .getStringClaim("pid")

