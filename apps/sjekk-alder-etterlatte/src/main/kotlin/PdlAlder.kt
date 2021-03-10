
import com.fasterxml.jackson.databind.node.ObjectNode
import io.ktor.client.HttpClient
import io.ktor.client.request.header
import io.ktor.client.request.post
import io.ktor.http.ContentType
import io.ktor.http.content.TextContent
import java.time.LocalDate
import java.time.Period

class PdlAlder(private val client: HttpClient, private val apiUrl: String): SjekkAlderForEtterlatte {
    override suspend fun sjekkAlderForEtterlatte(etterlatt:String): Int {

        val queryPart = """hentPerson(ident: "$etterlatt") {
        foedsel {
            foedselsdato
        }
    }
"""

        val gql = """{"query":"query{ ${queryPart.replace(""""""", """\"""").replace("\n", """\n""")} } "}"""
        client.post<ObjectNode>(apiUrl){
            header("Tema", "PEN")
            header("Accept", "application/json")
            body = TextContent(gql, ContentType.Application.Json)
        }.also {
            val foedselsdato = it.get("data").get("hentPerson").get("foedsel").get("foedselsdato")

            val dato = LocalDate.parse(foedselsdato.textValue())
            return Period.between(dato, LocalDate.now()).years
        }
    }

}