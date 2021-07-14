package no.nav.etterlatte

import com.fasterxml.jackson.annotation.JsonProperty
import io.ktor.client.HttpClient
import io.ktor.client.engine.apache.Apache
import io.ktor.client.features.auth.Auth
import io.ktor.client.features.auth.providers.BasicAuthCredentials
import io.ktor.client.features.auth.providers.basic
import io.ktor.client.features.json.JacksonSerializer
import io.ktor.client.features.json.JsonFeature
import io.ktor.client.request.forms.submitForm
import io.ktor.http.Parameters
import kotlinx.coroutines.sync.Mutex
import kotlinx.coroutines.sync.withLock
import java.time.Instant

class StsClient(private val config: Config.Sts) {
    private val httpClient = HttpClient(Apache) {
        install(Auth) {
            basic {
                credentials {
                    BasicAuthCredentials(config.serviceuser.name, config.serviceuser.password)
                }

                sendWithoutRequest { true }
            }
        }
        install(JsonFeature) {
            serializer = JacksonSerializer()
        }
    }.also {
        Runtime.getRuntime().addShutdownHook(Thread { it.close() })
    }

    private val tokenLifetimeMargin = 60
    private var cachedToken: StsToken = StsToken("", "", 0)
    private var cachedTokenExpiery: Instant = Instant.MIN
    private val mutex = Mutex()

    private suspend fun fetchToken() = httpClient.submitForm<StsToken>(
        formParameters = Parameters.build {
            append("grant_type", "client_credentials")
            append("scope", "openid")
        },
        url = config.url,
    )

    private suspend fun refreshIfNeeded() {
        Instant.now().also { start ->
            if (cachedTokenExpiery.isBefore(start))
                mutex.withLock {
                    if (cachedTokenExpiery.isBefore(start)) {
                        fetchToken().also {
                            cachedToken = it
                            cachedTokenExpiery = start.plusSeconds(it.expiresIn.toLong() - tokenLifetimeMargin)
                        }
                    }
                }
        }
    }

    suspend fun getToken(): StsToken {
        refreshIfNeeded()
        return cachedToken
    }
}

data class StsToken(
    @JsonProperty(value = "access_token")
    val accessToken: String,
    @JsonProperty(value = "token_type")
    val tokenType: String,
    @JsonProperty(value = "expires_in")
    val expiresIn: Int
) {
    override fun toString() = accessToken
}

