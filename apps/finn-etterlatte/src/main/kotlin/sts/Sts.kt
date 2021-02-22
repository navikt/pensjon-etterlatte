package no.nav.etterlatte.sts

import io.ktor.client.*
import io.ktor.client.engine.okhttp.*
import io.ktor.client.features.auth.*
import io.ktor.client.features.auth.providers.*
import io.ktor.client.features.json.*
import io.ktor.client.request.*


class Sts(private val client: HttpClient, private val url: String):StsClient{

    init{
        Runtime.getRuntime().addShutdownHook(Thread{client.close()})
    }

    override suspend fun token():String {
        return client.post<StsToken>(url) {
            header("accept", "application/json")
        }.let {
            "${it.token_type} ${it.access_token}"
        }
    }
}

data class StsToken(
    val access_token: String,
    val token_type: String,
    val expires_in: Int
)