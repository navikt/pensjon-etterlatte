package no.nav.etterlatte.routes

import io.ktor.application.*
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*
import io.ktor.request.*
import io.ktor.routing.*
import io.ktor.util.*
import no.nav.etterlatte.*
import org.json.simple.JSONObject
import java.util.*

@KtorExperimentalAPI
fun Route.pdl(
    config: Config,
    stsClient: StsClient,

    ) {
    route("/pdl") {
        post {

            val pdlUrl = config.pdl.url
            val stsToken = stsClient.getToken()
            val callId = call.request.header(HttpHeaders.NavCallId) ?: UUID.randomUUID().toString()

            try {
                val response = httpClient().post<HttpResponse>(pdlUrl) {
                    header(HttpHeaders.Authorization, "Bearer $stsToken")
                    header("Nav-Consumer-Token", "Bearer $stsToken")
                    call.request.header("Tema")?.also {
                        header("Tema", it)
                    }
                    header("X-Correlation-ID", callId)
                    method = HttpMethod.Post
                    contentType(ContentType.Application.Json)
                    accept(ContentType.Application.Json)
                    val receiveString = call.receive<JSONObject>()
                    body = receiveString
                }
                call.pipeResponse(response)
            } catch (cause: Throwable) {
                println("Feil i kall mot PDL: $cause")
                cause.printStackTrace()
            }
        }
    }
}
