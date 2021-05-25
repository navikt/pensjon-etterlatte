package no.nav.etterlatte.pdl

import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.node.ObjectNode
import io.ktor.client.HttpClient
import io.ktor.client.request.header
import io.ktor.client.request.post
import io.ktor.http.ContentType
import io.ktor.http.content.TextContent
import no.nav.etterlatte.FinnAdressebeskyttelseForFnr

class Pdl(private val client: HttpClient, private val apiUrl: String) : FinnAdressebeskyttelseForFnr {


    override suspend fun finnAdressebeskyttelseForFnr(identer: List<String>): JsonNode {

        var query = getGraphqlResource("/hentAdressebeskyttelse.graphql")
      /*  val queryPart = """hentPersonBolk(ident: "$fnrListe") {
        person {
            adressebeskyttelse(historikk: false) {
                gradering
            }
        }
    }
"""

       */

        //val gql = """{"query":"query{ ${queryPart.replace(""""""", """\"""").replace("\n", """\n""")} } "}"""
        client.post<ObjectNode>(apiUrl) {
            header("Tema", "PEN")
            header("Accept", "application/json")
            body = TextContent(query, ContentType.Application.Json)
        }.also {

        return it.get("data").get("Person").get("adressebeskyttelse").get("gradering")
        }
    }
    fun getGraphqlResource(file: String): String =
        javaClass.getResource(file).readText().replace(Regex("[\n\t]"), "")
}
