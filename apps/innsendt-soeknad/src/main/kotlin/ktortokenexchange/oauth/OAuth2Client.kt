package no.nav.etterlatte.oauth

import com.fasterxml.jackson.annotation.JsonProperty
import com.github.benmanes.caffeine.cache.AsyncLoadingCache
import com.nimbusds.oauth2.sdk.GrantType
import com.nimbusds.oauth2.sdk.auth.ClientAuthenticationMethod
import com.nimbusds.oauth2.sdk.auth.JWTAuthentication
import io.ktor.client.HttpClient
import io.ktor.client.call.body
import io.ktor.client.request.forms.submitForm
import io.ktor.client.request.get
import io.ktor.client.request.header
import io.ktor.http.Parameters
import io.ktor.http.ParametersBuilder
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.future.await
import kotlinx.coroutines.runBlocking
import no.nav.security.token.support.client.core.ClientAuthenticationProperties
import no.nav.security.token.support.client.core.OAuth2ParameterNames
import no.nav.security.token.support.client.core.auth.ClientAssertion
import no.nav.security.token.support.client.core.oauth2.OAuth2AccessTokenResponse
import java.net.URI
import java.nio.charset.StandardCharsets
import java.util.Base64

class OAuth2Client(
    private val httpClient: HttpClient,
    private val wellKnownUrl: String,
    private val clientAuthProperties: ClientAuthenticationProperties,
    private val cacheConfig: OAuth2CacheConfig = OAuth2CacheConfig(enabled = true, maximumSize = 1000, evictSkew = 5),
) {
    private val wellKnown: WellKnown = runBlocking { httpClient.get(wellKnownUrl).body() }

    private val coroutineScope = CoroutineScope(Dispatchers.Default + SupervisorJob())

    private val cache: AsyncLoadingCache<GrantRequest, OAuth2AccessTokenResponse> =
        cacheConfig.cache(coroutineScope) {
            httpClient.tokenRequest(
                tokenEndpointUrl = wellKnown.tokenEndpointUrl,
                clientAuthProperties = clientAuthProperties,
                grantRequest = it,
            )
        }

    suspend fun tokenExchange(
        token: String,
        audience: String,
    ) = accessToken(GrantRequest.tokenExchange(token, audience))

    suspend fun accessToken(grantRequest: GrantRequest): OAuth2AccessTokenResponse =
        if (cacheConfig.enabled) {
            cache.get(grantRequest).await()
        } else {
            httpClient.tokenRequest(
                tokenEndpointUrl = wellKnown.tokenEndpointUrl,
                clientAuthProperties = clientAuthProperties,
                grantRequest = grantRequest,
            )
        }

    data class WellKnown(
        @JsonProperty("token_endpoint")
        val tokenEndpointUrl: String,
    )
}

data class GrantRequest(
    val grantType: GrantType,
    val params: Map<String, String> = emptyMap(),
) {
    companion object {
        fun tokenExchange(
            token: String,
            audience: String,
        ): GrantRequest =
            GrantRequest(
                grantType = GrantType.TOKEN_EXCHANGE,
                params =
                    mapOf(
                        OAuth2ParameterNames.SUBJECT_TOKEN_TYPE to "urn:ietf:params:oauth:token-type:jwt",
                        OAuth2ParameterNames.SUBJECT_TOKEN to token,
                        OAuth2ParameterNames.AUDIENCE to audience,
                    ),
            )
    }
}

internal suspend fun HttpClient.tokenRequest(
    tokenEndpointUrl: String,
    clientAuthProperties: ClientAuthenticationProperties,
    grantRequest: GrantRequest,
): OAuth2AccessTokenResponse =
    submitForm(
        url = tokenEndpointUrl,
        formParameters =
            Parameters.build {
                appendClientAuthParams(
                    tokenEndpointUrl = tokenEndpointUrl,
                    clientAuthProperties = clientAuthProperties,
                )
                append(OAuth2ParameterNames.GRANT_TYPE, grantRequest.grantType.value)
                grantRequest.params.forEach {
                    append(it.key, it.value)
                }
            },
    ) {
        if (clientAuthProperties.clientAuthMethod == ClientAuthenticationMethod.CLIENT_SECRET_BASIC) {
            clientAuthProperties.clientSecret?.let {
                header(
                    "Authorization",
                    "Basic ${basicAuth(clientAuthProperties.clientId, it)}",
                )
            } ?: throw IllegalArgumentException("Client secret ikke satt")
        }
    }.body()

private fun ParametersBuilder.appendClientAuthParams(
    tokenEndpointUrl: String,
    clientAuthProperties: ClientAuthenticationProperties,
) = apply {
    when (clientAuthProperties.clientAuthMethod) {
        ClientAuthenticationMethod.CLIENT_SECRET_POST -> {
            append(OAuth2ParameterNames.CLIENT_ID, clientAuthProperties.clientId)
            append(
                OAuth2ParameterNames.CLIENT_SECRET,
                clientAuthProperties.clientSecret ?: throw IllegalArgumentException("Client secret ikke satt"),
            )
        }

        ClientAuthenticationMethod.PRIVATE_KEY_JWT -> {
            val clientAssertion = ClientAssertion(URI.create(tokenEndpointUrl), clientAuthProperties)
            append(OAuth2ParameterNames.CLIENT_ID, clientAuthProperties.clientId)
            append(OAuth2ParameterNames.CLIENT_ASSERTION_TYPE, JWTAuthentication.CLIENT_ASSERTION_TYPE)
            append(OAuth2ParameterNames.CLIENT_ASSERTION, clientAssertion.assertion())
        }
    }
}

private fun basicAuth(
    clientId: String,
    clientSecret: String,
) = Base64.getEncoder().encodeToString("$clientId:$clientSecret".toByteArray(StandardCharsets.UTF_8))