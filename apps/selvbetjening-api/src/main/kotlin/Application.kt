package no.nav.etterlatte

import com.fasterxml.jackson.annotation.JsonInclude
import com.fasterxml.jackson.databind.DeserializationFeature
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule
import com.typesafe.config.Config
import com.typesafe.config.ConfigFactory
import io.ktor.client.HttpClient
import io.ktor.client.engine.cio.CIO
import io.ktor.client.features.auth.Auth
import io.ktor.client.features.defaultRequest
import io.ktor.client.features.json.JacksonSerializer
import io.ktor.client.features.json.JsonFeature
import io.ktor.http.takeFrom
import no.nav.etterlatte.kodeverk.KodeverkService
import no.nav.etterlatte.ktortokenexchange.SecurityContextMediatorFactory
import no.nav.etterlatte.ktortokenexchange.bearerToken
import no.nav.etterlatte.person.PersonService
import no.nav.etterlatte.soknad.SoeknadService

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

    init {
        kodeverkService = KodeverkService(tokenSecuredEndpoint(config.getConfig("no.nav.etterlatte.tjenester.kodeverk")))
        personService = tokenSecuredEndpoint(config.getConfig("no.nav.etterlatte.tjenester.pdl"))
            .let {
                closables.add(it::close)
                PersonService(it, kodeverkService)
            }

        soeknadService = tokenSecuredEndpoint(config.getConfig("no.nav.etterlatte.tjenester.innsendtsoeknad"))
            .let {
                closables.add(it::close)
                SoeknadService(it)
            }
    }

    private fun tokenSecuredEndpoint(endpointConfig:Config) = HttpClient(CIO) {
        install(JsonFeature) {
            serializer = JacksonSerializer {
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
}

fun main() {
    ApplicationContext()
        .also { Server(it).run() }
        .close()

}
