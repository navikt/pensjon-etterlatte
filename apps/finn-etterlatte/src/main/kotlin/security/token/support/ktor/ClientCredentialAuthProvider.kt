package security.token.support.ktor

import io.ktor.client.features.auth.*
import io.ktor.client.request.*
import io.ktor.http.*
import io.ktor.http.auth.*
import io.ktor.util.*
import io.ktor.utils.io.charsets.*
import io.ktor.utils.io.core.*
import no.nav.security.token.support.client.core.oauth2.ClientCredentialsTokenClient
import no.nav.security.token.support.client.core.oauth2.OAuth2AccessTokenService
import no.nav.security.token.support.ktor.http.DefaultOAuth2HttpClient
import no.nav.security.token.support.ktor.oauth.ClientPropertiesConfig

/**
 * Add [BasicAuthProvider] to client [Auth] providers.
 */
fun Auth.clientCredential(block: ClientCredentialAuthConfig.() -> Unit) {
    with(ClientCredentialAuthConfig().apply(block)) {
        providers.add(ClientCredentialAuthProvider())
    }
}

/**
 * [BasicAuthProvider] configuration.
 */
class ClientCredentialAuthConfig {
}

/**
 * Client basic authentication provider.
 */
class ClientCredentialAuthProvider : AuthProvider {
    override val sendWithoutRequest: Boolean = true
    private val clientPropertiesConfig = ClientPropertiesConfig()
    private val httpClient = DefaultOAuth2HttpClient()
    private val accessTokenService = setupOAuth2AccessTokenService(httpClient = httpClient,)

    override fun isApplicable(auth: HttpAuthHeader): Boolean {
        return true
    }

    override suspend fun addRequestHeaders(request: HttpRequestBuilder) {
        accessTokenService.getAccessToken(clientPropertiesConfig.clientConfig).accessToken.also {
            request.headers[HttpHeaders.Authorization] = "Bearer $it"
        }
    }
}

internal fun setupOAuth2AccessTokenService(httpClient: DefaultOAuth2HttpClient, ): OAuth2AccessTokenService {
    return OAuth2AccessTokenService(
        null,
        null,
        ClientCredentialsTokenClient(httpClient),
        null
    )
}