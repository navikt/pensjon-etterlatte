package no.nav.etterlatte

import com.fasterxml.jackson.annotation.JsonProperty
import io.ktor.client.request.get
import io.ktor.config.ApplicationConfig

data class Config(
    val pdl: PDL,
    val aad: AAD,
    val tokenX: TokenX
) {
    data class PDL(
        val url: String
    )

    data class TokenX(
        val metadata: Metadata,
        val clientId: String,
    ) {
        data class Metadata(
            @JsonProperty("issuer") val issuer: String,
            @JsonProperty("jwks_uri") val jwksUri: String,
        )
    }

    data class AAD(
        val metadata: Metadata,
        val clientId: String,
    ) {
        data class Metadata(
            @JsonProperty("issuer") val issuer: String,
            @JsonProperty("jwks_uri") val jwksUri: String,
        )
    }

}

suspend fun ApplicationConfig.load() = Config(
    pdl = Config.PDL(url = property("pdl.url").getString()),
    aad = Config.AAD(
        metadata = httpClientWithProxy().use{ it.get(property("aad.wellKnownUrl").getString())},
        clientId = property("aad.clientId").getString()
    ),
    tokenX = Config.TokenX(
        metadata = jsonClient().use{ it.get(property("tokenx.wellKnownUrl").getString())},
        clientId = property("tokenx.clientId").getString()
    )
)
