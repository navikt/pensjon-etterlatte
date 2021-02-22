package no.nav.etterlatte.pdl

import FinnEtterlatteForPerson
import com.fasterxml.jackson.databind.node.ObjectNode
import io.ktor.client.*
import io.ktor.client.request.*
import io.ktor.http.*
import io.ktor.http.content.*

class Pdl(private val client: HttpClient, private val apiUrl: String):FinnEtterlatteForPerson {
    suspend fun call(){
        val queryPart = """hentPerson(ident: "07028500992") {
        navn(historikk: false) {
            fornavn
            mellomnavn
            etternavn
            forkortetNavn
        }
        folkeregisteridentifikator(historikk: false){
            identifikasjonsnummer
        }
        foedsel {
            foedselsdato
        }
        familierelasjoner {
            relatertPersonsIdent
            relatertPersonsRolle
            minRolleForPerson
        }
        forelderBarnRelasjon {
            relatertPersonsIdent
            relatertPersonsRolle
            minRolleForPerson
        }
    }
"""

        val gql = """{"query":"query{ ${queryPart.replace(""""""", """\"""").replace("\n", """\n""")} } "}"""

        println(gql)
        client.post<ObjectNode>(apiUrl){
            header("Tema", "PEN")
            header("Accept", "application/json")
            body = TextContent(gql, ContentType.Application.Json)
        }.also {
            println(it)
            val barnRelasjoner = it.get("data").get("hentPerson").get("forelderBarnRelasjon")
            for(i in 0 until barnRelasjoner.size())
                println(barnRelasjoner.get(i).get("minRolleForPerson"))
        }
    }

    override fun finnEtterlatteForPerson(): List<String> {
        return emptyList()
    }

}