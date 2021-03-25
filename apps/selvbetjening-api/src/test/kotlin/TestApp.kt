import com.nimbusds.jwt.SignedJWT
import io.ktor.util.KtorExperimentalAPI
import no.nav.etterlatte.ApplicationContext
import no.nav.etterlatte.Server
import no.nav.security.mock.oauth2.MockOAuth2Server
import no.nav.security.mock.oauth2.token.DefaultOAuth2TokenCallback

@KtorExperimentalAPI
fun main() {
    mockOautServer()
    val ctx = ApplicationContext("application-lokal.conf")
    Server(ctx).run()
    ctx.close()
}

fun mockOautServer() {
    val server = MockOAuth2Server()
    server.start(6666)
    val token: SignedJWT = server.issueToken(
        "lokalissuer", "thisapp", DefaultOAuth2TokenCallback(
            claims = mapOf(
                "acr" to "Level4",
                "pid" to "12321",
                "aud" to "thisapp"
            )
        )
    )
    println(token.serialize())

}