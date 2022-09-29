package no.nav.etterlatte

import com.fasterxml.jackson.annotation.JsonInclude
import com.fasterxml.jackson.databind.DeserializationFeature
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule
import com.typesafe.config.Config
import com.typesafe.config.ConfigFactory
import io.ktor.client.HttpClient
import io.ktor.client.engine.cio.CIO
import io.ktor.client.engine.okhttp.OkHttp
import io.ktor.client.plugins.auth.Auth
import io.ktor.client.plugins.contentnegotiation.ContentNegotiation
import io.ktor.client.plugins.defaultRequest
import io.ktor.http.encodedPath
import io.ktor.http.takeFrom
import io.ktor.serialization.jackson.jackson
import no.nav.etterlatte.adressebeskyttelse.AdressebeskyttelseService
import no.nav.etterlatte.kodeverk.KodeverkKlient
import no.nav.etterlatte.kodeverk.KodeverkService
import no.nav.etterlatte.ktortokenexchange.SecurityContextMediatorFactory
import no.nav.etterlatte.ktortokenexchange.bearerToken
import no.nav.etterlatte.libs.common.pdl.AdressebeskyttelseKlient
import no.nav.etterlatte.person.PersonKlient
import no.nav.etterlatte.person.PersonService
import no.nav.etterlatte.person.krr.KrrKlient
import no.nav.etterlatte.security.ktor.clientCredential
import no.nav.etterlatte.soknad.SoeknadService

const val PDL_URL = "PDL_URL"

class ApplicationContext(configLocation: String? = null) {
    private val closables = mutableListOf<() -> Unit>()
    private val config: Config = configLocation?.let { ConfigFactory.load(it) } ?: ConfigFactory.load()

    fun close() {
        closables.forEach { it() }
    }

    val personService: PersonService
    val soeknadService: SoeknadService
    val kodeverkService: KodeverkService
    val securityMediator = SecurityContextMediatorFactory.from(config)
    private val krrKlient: KrrKlient
    private val adressebeskyttelseService: AdressebeskyttelseService

    init {
        kodeverkService = tokenSecuredEndpoint(config.getConfig("no.nav.etterlatte.tjenester.kodeverk"))
            .also { closables.add(it::close) }
            .let { KodeverkService(KodeverkKlient(it)) }

        krrKlient = tokenSecuredEndpoint(config.getConfig("no.nav.etterlatte.tjenester.krr"))
            .also { closables.add(it::close) }
            .let { KrrKlient(it) }

        personService = tokenSecuredEndpoint(config.getConfig("no.nav.etterlatte.tjenester.pdl"))
            .also { closables.add(it::close) }
            .let { PersonService(PersonKlient(it), kodeverkService, krrKlient) }

        adressebeskyttelseService = systemPdlHttpClient()
            .also { closables.add(it::close) }
            .let { AdressebeskyttelseService(AdressebeskyttelseKlient(it, System.getenv(PDL_URL))) }

        soeknadService = tokenSecuredEndpoint(config.getConfig("no.nav.etterlatte.tjenester.innsendtsoeknad"))
            .also { closables.add(it::close) }
            .let { SoeknadService(it, adressebeskyttelseService) }
    }

    private fun tokenSecuredEndpoint(endpointConfig: Config) = HttpClient(CIO) {
        install(ContentNegotiation) {
            jackson {
                configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)
                setSerializationInclusion(JsonInclude.Include.NON_NULL)
                registerModule(JavaTimeModule())
            }
        }

        install(Auth) {
            bearerToken {
                tokenprovider = securityMediator.outgoingToken(endpointConfig.getString("audience"))
            }
        }

        defaultRequest {
            url.takeFrom(endpointConfig.getString("url") + url.encodedPath)
        }
    }

    // OBS: Denne klienten kaller PDL med en systembruker.
    // Informasjon fra denne klienten kan inneholde informasjon sluttbruker ikke har rett til å se.
    private fun systemPdlHttpClient() = HttpClient(OkHttp) {
        install(ContentNegotiation) { jackson() }
        install(Auth) {
            clientCredential {
                config = System.getenv().toMutableMap()
                    .apply { put("AZURE_APP_OUTBOUND_SCOPE", requireNotNull(get("PDL_AZURE_SCOPE"))) }
            }
        }
    }
}

fun main() {
    ApplicationContext()
        .also { Server(it).run() }
        .close()
}
