package no.nav.etterlatte

import com.fasterxml.jackson.annotation.JsonProperty
import io.ktor.client.request.get
import io.ktor.config.ApplicationConfig
import io.ktor.util.KtorExperimentalAPI

data class Config(
    val sts: Sts,
    val pdl: PDL,
    val dok: DOK,
    val aad: AAD,
    val tokenX: TokenX
) {
    data class PDL(
        val url: String
    )
    data class DOK(
        val url: String
    )

    data class Sts(
        val url: String,
        val serviceuser: ServiceUser,
    ) {
        data class ServiceUser(
            val name: String,
            val password: String,
        ) {
            override fun toString(): String {
                return "name=$name, password=<REDACTED>"
            }
        }
    }

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

@KtorExperimentalAPI
suspend fun ApplicationConfig.load() = Config(
    pdl = Config.PDL(url = property("pdl.url").getString()),
    dok = Config.DOK(url = property("dok.url").getString()),
    sts = Config.Sts(
        url = property("sts.url").getString(),
        serviceuser = Config.Sts.ServiceUser(
            name = property("serviceuser.name").getString(),
            password = property("serviceuser.password").getString(),
        )
    ),
    aad = Config.AAD(
        metadata = httpClientWithProxy().get(property("aad.wellKnownUrl").getString()),
        clientId = property("aad.clientId").getString()
    ),
    tokenX = Config.TokenX(
        metadata = httpClient().get(property("tokenx.wellKnownUrl").getString()),
        clientId = property("tokenx.clientId").getString()
    )
)
