package no.nav.etterlatte

import com.fasterxml.jackson.databind.node.ObjectNode
import io.ktor.client.HttpClient
import io.ktor.client.request.header
import io.ktor.client.request.post
import io.ktor.http.ContentType
import io.ktor.http.content.TextContent
import java.time.LocalDate

class PdlAlder(private val client: HttpClient, private val apiUrl: String) : SjekkAlderForEtterlatte {
    override suspend fun sjekkAlderForEtterlatte(etterlatt: String): LocalDate {

        val queryPart = """hentPerson(ident: "$etterlatt") {
        foedsel {
            foedselsdato
        }
    }
"""

        val gql = """{"query":"query{ ${queryPart.replace(""""""", """\"""").replace("\n", """\n""")} } "}"""
        return client.post<ObjectNode>(apiUrl) {
            header("Tema", "PEN")
            header("Accept", "application/json")
            body = TextContent(gql, ContentType.Application.Json)
        }.let {
            val foedselsdato = it.get("data").get("hentPerson").get("foedsel").get(0).get("foedselsdato")
            LocalDate.parse(foedselsdato.textValue())
        }
    }

}