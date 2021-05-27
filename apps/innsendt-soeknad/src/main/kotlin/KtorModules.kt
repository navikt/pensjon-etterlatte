package no.nav.etterlatte

import com.fasterxml.jackson.databind.JsonNode
import com.typesafe.config.ConfigFactory
import io.ktor.application.Application
import io.ktor.application.call
import io.ktor.application.install
import io.ktor.auth.Authentication
import io.ktor.auth.authenticate
import io.ktor.auth.principal
import io.ktor.config.HoconApplicationConfig
import io.ktor.features.ContentNegotiation
import io.ktor.http.ContentType
import io.ktor.jackson.jackson
import io.ktor.request.receive
import io.ktor.response.respondText
import io.ktor.routing.Route
import io.ktor.routing.post
import io.ktor.routing.routing
import no.nav.security.token.support.ktor.TokenValidationContextPrincipal
import no.nav.security.token.support.ktor.tokenValidationSupport

fun Route.soeknadApi(db: SoeknadRepository){
    post("/api/soeknad") {
        val fnr = call.principal<TokenValidationContextPrincipal>()?.context?.firstValidToken?.get()?.jwtTokenClaims?.get("pid")!!.toString()
        val soknad = call.receive<JsonNode>()
        val lagretSoeknad = db.nySoeknad(UlagretSoeknad(fnr, soknad.toJson()))
        call.respondText(lagretSoeknad.id.toString(), ContentType.Text.Plain)
    }
}

fun Application.apiModule(routes: Route.()->Unit){
    install(Authentication) {
        tokenValidationSupport(config = HoconApplicationConfig(ConfigFactory.load()))
    }
    install(ContentNegotiation) {
        jackson()
    }

    routing {
        authenticate {
            routes()
        }
    }
}