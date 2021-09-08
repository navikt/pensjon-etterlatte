package no.nav.etterlatte

import com.fasterxml.jackson.databind.JsonNode
import com.typesafe.config.ConfigFactory
import io.ktor.application.Application
import io.ktor.application.ApplicationCall
import io.ktor.application.call
import io.ktor.application.install
import io.ktor.auth.Authentication
import io.ktor.auth.authenticate
import io.ktor.auth.principal
import io.ktor.config.HoconApplicationConfig
import io.ktor.features.ContentNegotiation
import io.ktor.http.ContentType
import io.ktor.http.HttpStatusCode
import io.ktor.jackson.jackson
import io.ktor.request.receive
import io.ktor.response.respond
import io.ktor.response.respondText
import io.ktor.routing.IgnoreTrailingSlash
import io.ktor.routing.Route
import io.ktor.routing.delete
import io.ktor.routing.get
import io.ktor.routing.post
import io.ktor.routing.route
import io.ktor.routing.routing
import io.ktor.util.pipeline.PipelineContext
import no.nav.security.token.support.ktor.TokenValidationContextPrincipal
import no.nav.security.token.support.ktor.tokenValidationSupport

fun Route.soeknadApi(db: SoeknadRepository){
    post("/api/soeknad") {
        val soknad = call.receive<JsonNode>()
        val lagretSoeknad = db.lagreSoeknad(UlagretSoeknad(fnrFromToken(), soknad.toJson()))
        db.soeknadFerdigstilt(lagretSoeknad)
        call.respondText(lagretSoeknad.id.toString(), ContentType.Text.Plain)
    }
    route("/api/kladd"){
        post {
            val soknad = call.receive<JsonNode>()
            val lagretkladd = db.lagreKladd(UlagretSoeknad(fnrFromToken(), soknad.toJson()))
            call.respondText(lagretkladd.id.toString(), ContentType.Text.Plain)
        }

        delete {
            call.respond(if(db.slettKladd(fnrFromToken())) HttpStatusCode.NoContent else HttpStatusCode.Gone)
        }

        get {
            call.respond(db.finnKladd(fnrFromToken())?:HttpStatusCode.NotFound)
        }
    }

}
fun PipelineContext<Unit, ApplicationCall>.fnrFromToken() = call.principal<TokenValidationContextPrincipal>()?.context?.firstValidToken?.get()?.jwtTokenClaims?.get("pid")!!.toString()


fun Application.apiModule(routes: Route.()->Unit){
    install(Authentication) {
        tokenValidationSupport(config = HoconApplicationConfig(ConfigFactory.load()))
    }
    install(ContentNegotiation) {
        jackson()
    }
    install(IgnoreTrailingSlash)

    routing {
        authenticate {
            routes()
        }
    }
}