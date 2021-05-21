package no.nav.etterlatte.pdl

import com.fasterxml.jackson.databind.node.ObjectNode
import io.ktor.client.HttpClient
import io.ktor.client.request.header
import io.ktor.client.request.post
import io.ktor.http.ContentType
import io.ktor.http.content.TextContent
import no.nav.etterlatte.FinnAdressebeskyttelseForFnr

class Pdl(private val client: HttpClient, private val apiUrl: String) : FinnAdressebeskyttelseForFnr {

    val KODE6 = "STRENGT FORTROLIG"
    val KODE7= "FORTROLIG"
    val KODE19 = "STRENGT_FORTROLIG_UTLAND"
    val INGENBESKYTTELSE = "INGEN BESKYTTELSE"
    override suspend fun finnAdressebeskyttelseForFnr(identer: List<String>): String {

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

            //TODO endre logikken til å hente ut adressebeskyttelse
            val graderinger = it.get("data").get("Person").get("adressebeskyttelse").get("gradering")
            var kode7 = false
            var kode19 = true
            for (i in 0 until graderinger.size())
                when(graderinger.get(i).textValue()) {
                    KODE6 -> return KODE6
                    KODE19 -> kode19 = true
                    KODE7 -> kode7 = true
                }
                if(kode19) return KODE19
                if(kode7) return KODE7
                return INGENBESKYTTELSE
        }
    }
    fun getGraphqlResource(file: String): String =
        javaClass.getResource(file).readText().replace(Regex("[\n\t]"), "")
}
