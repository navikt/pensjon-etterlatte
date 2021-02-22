package no.nav.etterlatte.sts

import io.ktor.client.features.auth.*
import io.ktor.client.request.*
import io.ktor.http.*
import io.ktor.http.auth.*
import io.ktor.util.*
import io.ktor.utils.io.charsets.*
import io.ktor.utils.io.core.*

/**
 * Add [BasicAuthProvider] to client [Auth] providers.
 */
public fun Auth.sts(block: StsAuthConfig.() -> Unit) {
    with(StsAuthConfig().apply(block)) {
        providers.add(StsAuthProvider(stsClient))
    }
}

/**
 * [BasicAuthProvider] configuration.
 */
public class StsAuthConfig {
    public lateinit var stsClient: StsClient
}

/**
 * Client basic authentication provider.
 */
public class StsAuthProvider(
    private val stsClient: StsClient
) : AuthProvider {
    override val sendWithoutRequest: Boolean = true

    override fun isApplicable(auth: HttpAuthHeader): Boolean {
        return true
    }

    override suspend fun addRequestHeaders(request: HttpRequestBuilder) {
        stsClient.token().also {
            println(it)
            request.headers[HttpHeaders.Authorization] = it
            request.headers["Nav-Consumer-Token"] = it
        }

    }

}
interface StsClient{
    suspend fun token():String
}