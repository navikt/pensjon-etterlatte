package no.nav.etterlatte

import com.typesafe.config.Config
import com.typesafe.config.ConfigFactory
import io.ktor.client.HttpClient
import no.nav.etterlatte.ktortokenexchange.SecurityContextMediatorFactory

class ApplicationContext(
    config: Config = ConfigFactory.load()

) {
    val closables = mutableListOf<() -> Unit>()

    fun close() {
        closables.forEach { it() }
    }

    val pdl: Config = config
    val tokenXHttpClient: HttpClient
    val clientCredentialHttpClient: HttpClient
    val securityMediator = SecurityContextMediatorFactory.from(config)

    init {
        tokenXHttpClient = tokenSecuredEndpoint()
            .also { closables.add(it::close) }
        clientCredentialHttpClient = pdlhttpclient(config.getConfig("no.nav.etterlatte.tjenester.pdl.aad"))
            .also { closables.add(it::close) }
    }
}

fun main() {
    ApplicationContext()
        .also { Server(it).run() }
        .close()
}
