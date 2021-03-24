package no.nav.etterlatte

import com.fasterxml.jackson.annotation.JsonInclude
import com.fasterxml.jackson.databind.DeserializationFeature
import com.typesafe.config.Config
import com.typesafe.config.ConfigFactory
import io.ktor.application.ApplicationCall
import io.ktor.application.call
import io.ktor.auth.principal
import io.ktor.client.HttpClient
import io.ktor.client.engine.cio.CIO
import io.ktor.client.features.json.JacksonSerializer
import io.ktor.client.features.json.JsonFeature
import io.ktor.client.features.logging.DEFAULT
import io.ktor.client.features.logging.LogLevel
import io.ktor.client.features.logging.Logger
import io.ktor.client.features.logging.Logging
import io.ktor.client.request.HttpRequestBuilder
import io.ktor.client.request.header
import io.ktor.config.HoconApplicationConfig
import io.ktor.util.KtorExperimentalAPI
import io.ktor.util.pipeline.PipelineContext
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.async
import no.nav.etterlatte.oauth.ClientConfig
import no.nav.etterlatte.oauth.OAuth2Client
import no.nav.security.token.support.core.jwt.JwtToken
import no.nav.security.token.support.ktor.TokenValidationContextPrincipal
import oauth.mockOautServer


interface Context {
    fun securityContext(): SecurityContext
    fun config(): Config
    fun httpClient(): HttpClient
}

object ApplicationContext : Context {
    private val config: Config =
        if (System.getenv().containsKey("NAIS_APP_NAME")) ConfigFactory.load() else ConfigFactory.load(
            "application-lokal.conf"
        )
    private val defaultHttpClient = HttpClient(CIO) {
        install(JsonFeature) {
            serializer = JacksonSerializer {
                configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)
                setSerializationInclusion(JsonInclude.Include.NON_NULL)
            }
        }

        install(Logging) {
            logger = Logger.DEFAULT
            level = LogLevel.ALL
        }
    }

    fun close() = defaultHttpClient.close()
    val oauth2Client: OAuth2Client

    init {
        if (config.hasPath("no.nav.etterlatte.env.oauth.mock") && config.getBoolean("no.nav.etterlatte.env.oauth.mock")) mockOautServer()
        oauth2Client = checkNotNull(ClientConfig(HoconApplicationConfig(config), defaultHttpClient).clients["tokenx"])
    }

    override fun config() = config
    override fun httpClient() = defaultHttpClient
    override fun securityContext() = NoSecurity()


}


object BeanFactory {
    fun pdl(ctx: Context): PdlService {
        val conf = ctx.config().getConfig("tjenester.pdl")
        return if ("mock".let { conf.hasPath(it) && conf.getBoolean(it) }) {
            PdlMock()
        } else {
            pdlGraphql(ctx, conf)
        }
    }

    private fun pdlGraphql(ctx: Context, conf: Config): PdlService {
        return SecureUri(conf).let {
            PdlGraphqlKlient(
                uri = it,
                httpClient = ctx.httpClient(),
                outpountSecurity = ctx.securityContext().re(it)
            )
        }
    }
}


@KtorExperimentalAPI
fun main() {
    Server().run()
    ApplicationContext.close()
}


fun PipelineContext<*, ApplicationCall>.requestContext(): RequestContext =
    RequestContext(TokenxSecurityContext(call.principal<TokenValidationContextPrincipal>()?.context?.firstValidToken?.get()!!))

class RequestContext(private val secCtx: SecurityContext) : Context by ApplicationContext {
    override fun securityContext() = secCtx
}

class TokenxSecurityContext(val inToken: JwtToken) : SecurityContext {
    override fun re(uri: SecureUri): suspend HttpRequestBuilder.() -> Unit {
        val oAuth2Response = GlobalScope.async {
            ApplicationContext.oauth2Client.tokenExchange(
                inToken.tokenAsString,
                uri.securityScope
            )
        }
        return {
            header("Authorization", "Bearer ${oAuth2Response.await().accessToken}")
        }
    }

    override fun user() = inToken.jwtTokenClaims?.get("pid")?.toString()
}

class NoSecurity : SecurityContext {
    override fun re(uri: SecureUri): suspend HttpRequestBuilder.() -> Unit = { }
    override fun user() = throw RuntimeException("No user")
}

interface SecurityContext {
    fun re(uri: SecureUri): suspend HttpRequestBuilder.() -> Unit
    fun user(): String?
}

class SecureUri(
    val url: String,
    val securityScope: String
) {
    constructor(conf: Config) : this(
        conf.getString("url"),
        conf.getString("tilbyder")
    )
}
