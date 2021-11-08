package no.nav.etterlatte

import com.fasterxml.jackson.databind.JsonNode
import com.typesafe.config.ConfigFactory
import soeknad.SoeknadRepository
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
import soeknad.UlagretSoeknad
import no.nav.etterlatte.libs.common.soeknad.Soeknad
import no.nav.etterlatte.libs.common.soeknad.SoeknadType
import no.nav.etterlatte.libs.common.soeknad.Valg
import no.nav.security.token.support.ktor.TokenValidationContextPrincipal
import no.nav.security.token.support.ktor.tokenValidationSupport

fun Route.soeknadApi(db: SoeknadRepository) {
    post("/api/soeknad") {
        val soeknad = call.receive<Soeknad>()
        val soekere = finnSoekere(soeknad, fnrFromToken())

        soekere.forEach { soeker ->
            val oppdatertSoeknad = soeknad.copy(soeknadsType = soeker.type)
            val lagretSoeknad = db.lagreSoeknad(UlagretSoeknad(soeker.fnr, oppdatertSoeknad.toJson()))
            db.soeknadFerdigstilt(lagretSoeknad.id)
        }

        call.respond(HttpStatusCode.OK)
    }

    route("/api/kladd") {
        post {
            val soknad = call.receive<JsonNode>()
            val lagretkladd = db.lagreKladd(UlagretSoeknad(fnrFromToken(), soknad.toJson()))
            call.respondText(lagretkladd.id.toString(), ContentType.Text.Plain)
        }

        delete {
            db.slettKladd(fnrFromToken())
            call.respond(HttpStatusCode.OK)
        }

        get {
            call.respond(db.finnKladd(fnrFromToken()) ?: HttpStatusCode.NotFound)
        }
    }
}

data class Soeker(val fnr: String, val type: SoeknadType)
fun finnSoekere(soeknad: Soeknad, gjenlevendeFnr: String): List<Soeker> {
    val gjenlevende = Soeker(gjenlevendeFnr, SoeknadType.Gjenlevendepensjon)
    val barnepensjon: List<Soeker> = soeknad.utfyltSoeknad.opplysningerOmBarn.barn
        .filter { it.barnepensjon?.soeker == Valg.JA }
        .map { Soeker(it.foedselsnummer, SoeknadType.Barnepensjon) }

    return listOf(gjenlevende) + barnepensjon
}

fun PipelineContext<Unit, ApplicationCall>.fnrFromToken() = call.principal<TokenValidationContextPrincipal>()
    ?.context?.firstValidToken?.get()?.jwtTokenClaims?.get("pid")!!.toString()

fun Application.apiModule(routes: Route.() -> Unit) {
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
