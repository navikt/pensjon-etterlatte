package no.nav.etterlatte.mottak.admin

import com.typesafe.config.ConfigFactory
import efterlatte.prosessering.Status
import io.ktor.http.ContentType
import io.ktor.http.HttpStatusCode
import io.ktor.server.auth.authenticate
import io.ktor.server.auth.principal
import io.ktor.server.config.HoconApplicationConfig
import io.ktor.server.request.receive
import io.ktor.server.response.respond
import io.ktor.server.response.respondText
import io.ktor.server.routing.Route
import io.ktor.server.routing.RoutingContext
import io.ktor.server.routing.get
import io.ktor.server.routing.post
import io.ktor.server.routing.route
import no.nav.etterlatte.toJson
import no.nav.security.token.support.v3.TokenValidationContextPrincipal
import org.slf4j.LoggerFactory

const val ADMIN_AUTH = "prosessering-admin"
const val AZURE_ISSUER = "azure"

/** Egen token-konfigurasjon for operatører, slik at innbyggerrutene fortsatt bare godtar TokenX. */
fun azureAdminTokenConfig(
    wellKnownUrl: String,
    clientId: String,
) = HoconApplicationConfig(
    ConfigFactory.parseMap(
        mapOf(
            "no.nav.security.jwt.issuers" to
                listOf(
                    mapOf(
                        "issuer_name" to AZURE_ISSUER,
                        "discoveryurl" to wellKnownUrl,
                        "accepted_audience" to clientId,
                    ),
                ),
        ),
    ),
)

data class Operatoer(
    val ident: String,
)

data class VersjonRequest(
    val versjon: Long,
)

data class AvvikRequest(
    val versjon: Long,
    val melding: String?,
)

data class KommentarRequest(
    val melding: String?,
)

private val operatorLogg = LoggerFactory.getLogger("prosessering.operator")

/**
 * REST-kontrakten i efterlatte-verktoy (`03-prosessering-kontrakten.md`). Bare personlige Azure-tokens
 * (OBO) med NAVident og operatørgruppen slipper inn. Maskintokens og innbyggertokens avvises.
 */
fun Route.prosesseringAdminApi(
    dao: ProsesseringAdminDao,
    operatoerGruppe: String,
    node: String,
) {
    authenticate(ADMIN_AUTH) {
        route("/api/prosessering/task") {
            get("/status-oversikt") { medTilgang(operatoerGruppe) { call.respond(dao.statusOversikt()) } }

            get("/typer") { medTilgang(operatoerGruppe) { call.respond(dao.typer()) } }

            get {
                medTilgang(operatoerGruppe) {
                    val params = call.request.queryParameters
                    val status =
                        params["status"]?.let {
                            runCatching {
                                Status.valueOf(
                                    it,
                                )
                            }.getOrElse { throw UgyldigForespoersel("Ukjent status $it") }
                        }
                    val side = params["side"]?.toIntOrNull() ?: 1
                    val antallPerSide = params["antallPerSide"]?.toIntOrNull() ?: 25
                    if (side < 1 || antallPerSide !in 1..100) {
                        throw UgyldigForespoersel("side må være minst 1 og antallPerSide mellom 1 og 100")
                    }
                    call.respond(
                        dao.liste(status = status, type = params["type"], side = side, antallPerSide = antallPerSide),
                    )
                }
            }

            get("/{id}") {
                medTilgang(operatoerGruppe) { operatoer ->
                    val task = dao.finn(taskId()) ?: throw TaskIkkeFunnet(taskId())
                    operatorLogg.info("${operatoer.ident} hentet task ${task.id} med payload")
                    call.respond(task)
                }
            }

            get("/{id}/logg") { medTilgang(operatoerGruppe) { call.respond(dao.logg(taskId())) } }

            post("/{id}/rekjor") {
                medTilgang(operatoerGruppe) { operatoer ->
                    val versjon = call.receive<VersjonRequest>().versjon
                    call.respond(utfoer(dao, operatoer, taskId(), versjon, Handling.REKJOER, node))
                }
            }

            post("/{id}/avbryt") {
                medTilgang(operatoerGruppe) { operatoer ->
                    val versjon = call.receive<VersjonRequest>().versjon
                    call.respond(utfoer(dao, operatoer, taskId(), versjon, Handling.AVBRYT, node))
                }
            }

            post("/{id}/avvik") {
                medTilgang(operatoerGruppe) { operatoer ->
                    val request = call.receive<AvvikRequest>()
                    val melding =
                        request.melding?.takeIf { it.isNotBlank() } ?: throw UgyldigForespoersel("melding må være satt")
                    call.respond(
                        utfoer(dao, operatoer, taskId(), request.versjon, Handling.AVBRYT, node, avvik = melding),
                    )
                }
            }

            post("/{id}/kommentar") {
                medTilgang(operatoerGruppe) { operatoer ->
                    val melding =
                        call.receive<KommentarRequest>().melding?.takeIf { it.isNotBlank() }
                            ?: throw UgyldigForespoersel("melding må være satt")
                    call.respond(HttpStatusCode.Created, dao.kommentar(taskId(), melding, operatoer.ident, node))
                }
            }
        }
    }
}

private fun utfoer(
    dao: ProsesseringAdminDao,
    operatoer: Operatoer,
    id: Long,
    versjon: Long,
    handling: Handling,
    node: String,
    avvik: String? = null,
) = try {
    dao.utfoer(id, versjon, handling, operatoer.ident, node, avvik).also {
        operatorLogg.info(
            "${operatoer.ident}: task $id ${handling.verb}${if (avvik != null) " med avvik" else ""}, ny status ${it.status}",
        )
    }
} catch (e: AdminFeil) {
    operatorLogg.warn("${operatoer.ident}: task $id kunne ikke ${handling.verb}: ${e.detail}")
    throw e
}

private fun RoutingContext.taskId(): Long =
    call.parameters["id"]?.toLongOrNull() ?: throw UgyldigForespoersel("Ugyldig task-id")

private suspend fun RoutingContext.medTilgang(
    operatoerGruppe: String,
    haandter: suspend RoutingContext.(Operatoer) -> Unit,
) {
    val claims =
        call
            .principal<TokenValidationContextPrincipal>()
            ?.context
            ?.getJwtToken(AZURE_ISSUER)
            ?.jwtTokenClaims
    val ident = claims?.getStringClaim("NAVident")
    val grupper = runCatching { claims?.getAsList("groups") }.getOrNull().orEmpty()
    if (ident == null || operatoerGruppe !in grupper) {
        problem(HttpStatusCode.Forbidden, "Krever personlig Azure-token med operatørgruppen for prosessering")
        return
    }
    try {
        haandter(Operatoer(ident))
    } catch (e: AdminFeil) {
        problem(HttpStatusCode.fromValue(e.status), e.detail)
    } catch (e: io.ktor.server.plugins.BadRequestException) {
        problem(HttpStatusCode.BadRequest, "Ugyldig forespørsel")
    }
}

private suspend fun RoutingContext.problem(
    status: HttpStatusCode,
    detail: String,
) = call.respondText(
    text =
        mapOf(
            "type" to "about:blank",
            "title" to status.description,
            "status" to status.value,
            "detail" to detail,
        ).toJson(),
    contentType = ContentType("application", "problem+json"),
    status = status,
)