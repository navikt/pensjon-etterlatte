package no.nav.etterlatte

import com.fasterxml.jackson.annotation.JsonProperty
import io.ktor.client.HttpClient
import io.ktor.client.engine.apache.Apache
import io.ktor.client.features.auth.Auth
import io.ktor.client.features.auth.providers.basic
import io.ktor.client.features.json.JacksonSerializer
import io.ktor.client.features.json.JsonFeature
import io.ktor.client.request.forms.submitForm
import io.ktor.http.Parameters

class StsClient(private val config: Config.Sts) {
    private val httpClient = HttpClient(Apache) {
        install(Auth) {
            basic {
                username = config.serviceuser.name
                password = config.serviceuser.password
                sendWithoutRequest = true
            }
        }
        install(JsonFeature) {
            serializer = JacksonSerializer()
        }
    }

    // todo - should probably cache token
    suspend fun getToken(): StsToken = httpClient.submitForm(
        formParameters = Parameters.build {
            append("grant_type", "client_credentials")
            append("scope", "openid")
        },
        url = config.url,
    )
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
