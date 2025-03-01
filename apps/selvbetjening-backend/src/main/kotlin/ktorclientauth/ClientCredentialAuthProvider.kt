package no.nav.etterlatte.ktorclientauth

import com.nimbusds.oauth2.sdk.GrantType
import com.nimbusds.oauth2.sdk.auth.ClientAuthenticationMethod
import io.ktor.client.plugins.auth.AuthProvider
import io.ktor.client.request.HttpRequestBuilder
import io.ktor.http.HttpHeaders
import io.ktor.http.auth.HttpAuthHeader
import no.nav.security.token.support.client.core.ClientAuthenticationProperties
import no.nav.security.token.support.client.core.ClientProperties
import no.nav.security.token.support.client.core.oauth2.ClientCredentialsTokenClient
import no.nav.security.token.support.client.core.oauth2.OAuth2AccessTokenService
import no.nav.security.token.support.client.core.oauth2.OnBehalfOfTokenClient
import no.nav.security.token.support.client.core.oauth2.TokenExchangeClient
import java.net.URI

class ClientCredentialAuthProvider(
    config: Map<String, String>,
) : AuthProvider {
    override val sendWithoutRequest: Boolean = true
    private val clientPropertiesConfig =
        ClientProperties(
            tokenEndpointUrl = null,
            wellKnownUrl = config["AZURE_APP_WELL_KNOWN_URL"]?.let { URI(it) },
            grantType = GrantType.CLIENT_CREDENTIALS,
            scope = config["AZURE_APP_OUTBOUND_SCOPE"]?.split(",") ?: emptyList(),
            authentication =
                ClientAuthenticationProperties
                    .builder(
                        clientId = config.getOrThrow("AZURE_APP_CLIENT_ID"),
                        clientAuthMethod = ClientAuthenticationMethod.PRIVATE_KEY_JWT,
                    ).clientJwk(config.getOrThrow("AZURE_APP_JWK"))
                    .build(),
            resourceUrl = null,
            tokenExchange = null,
        )

    private fun Map<String, String>.getOrThrow(key: String) =
        this[key]
            ?: throw IllegalArgumentException("Missing configuration property '$key'")

    private val httpClient = DefaultOAuth2HttpClient()
    private val accessTokenService = setupOAuth2AccessTokenService(httpClient = httpClient)

    override fun isApplicable(auth: HttpAuthHeader): Boolean = true

    override suspend fun addRequestHeaders(
        request: HttpRequestBuilder,
        authHeader: HttpAuthHeader?,
    ) {
        accessTokenService.getAccessToken(clientPropertiesConfig).access_token.also {
            request.headers[HttpHeaders.Authorization] = "Bearer $it"
        }
    }
}

internal fun setupOAuth2AccessTokenService(httpClient: DefaultOAuth2HttpClient): OAuth2AccessTokenService =
    OAuth2AccessTokenService(
        tokenResolver = { throw IllegalArgumentException("Ikke i bruk") },
        onBehalfOfTokenClient = OnBehalfOfTokenClient(httpClient),
        clientCredentialsTokenClient = ClientCredentialsTokenClient(httpClient),
        tokenExchangeClient = TokenExchangeClient(httpClient),
    )