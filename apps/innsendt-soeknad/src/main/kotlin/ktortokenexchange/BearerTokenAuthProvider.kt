package no.nav.etterlatte.ktortokenexchange

import io.ktor.client.plugins.auth.AuthProvider
import io.ktor.client.request.HttpRequestBuilder
import io.ktor.client.request.header
import io.ktor.http.HttpHeaders
import io.ktor.http.auth.HttpAuthHeader

class BearerTokenAuthProvider(
    private val tokenAuthProvider: suspend () -> String?,
) : AuthProvider {
    override val sendWithoutRequest: Boolean = true

    override fun isApplicable(auth: HttpAuthHeader): Boolean = true

    override suspend fun addRequestHeaders(
        request: HttpRequestBuilder,
        authHeader: HttpAuthHeader?,
    ) {
        tokenAuthProvider().also { request.header(HttpHeaders.Authorization, "Bearer $it") }
    }
}