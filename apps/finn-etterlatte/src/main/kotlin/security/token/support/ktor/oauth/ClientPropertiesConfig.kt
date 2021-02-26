package no.nav.security.token.support.ktor.oauth

import com.nimbusds.oauth2.sdk.auth.ClientAuthenticationMethod
import no.nav.security.token.support.client.core.ClientAuthenticationProperties
import no.nav.security.token.support.client.core.ClientProperties
import no.nav.security.token.support.client.core.OAuth2GrantType
import java.net.URI

class ClientPropertiesConfig {

    internal val clientConfig: ClientProperties =
        ClientProperties(
            null, //URI(conf["token_endpoint_url"]!!),
            System.getenv("AZURE_APP_WELL_KNOWN_URL")?.let { URI(it) },
            OAuth2GrantType("client_credentials"),
            listOf("api://dev-fss.etterlatte.etterlatte-proxy/.default"),
            ClientAuthenticationProperties(
                System.getenv("AZURE_APP_CLIENT_ID"),
                ClientAuthenticationMethod.PRIVATE_KEY_JWT,
                null,
                System.getenv("AZURE_APP_JWK")
            ),
            null, //conf["resource_url"]?.let { URI(it) },
            null
        )

    companion object CommonConfigurationAttributes {
        const val COMMON_PREFIX = "no.nav.security.jwt.client.registration"
        const val CLIENTS_PATH = "${COMMON_PREFIX}.clients"
        const val CACHE_PATH = "${COMMON_PREFIX}.cache"
    }
}