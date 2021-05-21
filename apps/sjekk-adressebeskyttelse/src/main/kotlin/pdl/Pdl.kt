package no.nav.etterlatte.pdl

import com.fasterxml.jackson.databind.node.ObjectNode
import io.ktor.client.HttpClient
import io.ktor.client.request.header
import io.ktor.client.request.post
import io.ktor.http.ContentType
import io.ktor.http.content.TextContent
import no.nav.etterlatte.FinnAdressebeskyttelseForFnr

class Pdl(private val client: HttpClient, private val apiUrl: String) : FinnAdressebeskyttelseForFnr {
    override suspend fun finnAdressebeskyttelseForFnr(forelder: String): List<String> {
        forelder.sp
        val queryPart = """hentPersonBolk(ident: "$forelder") {
        person {
            adressebeskyttelse(historikk: false) {
                gradering
            }
        }
    }
"""

        val gql = """{"query":"query{ ${queryPart.replace(""""""", """\"""").replace("\n", """\n""")} } "}"""
        client.post<ObjectNode>(apiUrl) {
            header("Tema", "PEN")
            header("Accept", "application/json")
            body = TextContent(gql, ContentType.Application.Json)
        }.also {

            val barnRelasjoner = it.get("data").get("hentPerson").get("forelderBarnRelasjon")
            val barn = mutableListOf<String>()
            for (i in 0 until barnRelasjoner.size())
                if (barnRelasjoner.get(i).get("relatertPersonsRolle").textValue() == "BARN")
                    barn.add(barnRelasjoner.get(i).get("relatertPersonsIdent").textValue())
            return barn

        }
    }
}
