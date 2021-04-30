package no.nav.etterlatte

import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.node.ObjectNode
import io.ktor.client.HttpClient
import io.ktor.client.request.header
import io.ktor.client.request.post
import io.ktor.content.TextContent
import io.ktor.http.ContentType
import no.nav.etterlatte.common.toJson
import org.slf4j.LoggerFactory

interface PdlService {
    suspend fun personInfo(person: String): PersonInfo
}


class PdlGraphqlKlient(
    private val uri: String,
    private val pdlTema: String = "PEN",
    private val httpClient: HttpClient

) : PdlService {
    private val logger = LoggerFactory.getLogger(PdlGraphqlKlient::class.java)

    override suspend fun personInfo(person: String): PersonInfo {
        val queryPart = """hentPerson(ident: "$person") {
            forelderBarnRelasjon {
                relatertPersonsIdent
                relatertPersonsRolle
            }
        }
        """

        val gql = """{"query":"query{ ${
            queryPart.replace(""""""", """\"""").replace("\n", """\n""")
        } } "}"""

        httpClient.post<ObjectNode>(uri) {
            header("Tema", pdlTema)
            header("Accept", "application/json")
            body = TextContent(gql, ContentType.Application.Json)
        }.also {

            logger.info(it.toPrettyString())

            val barnRelasjoner = "data.hentPerson.forelderBarnRelasjon".split(".")
                .fold(it, JsonNode::get) // it.get("data").get("hentPerson").get("forelderBarnRelasjon")
            val barn = mutableListOf<String>()
            for (i in 0 until barnRelasjoner.size())
                if (barnRelasjoner.get(i).get("relatertPersonsRolle").textValue() == "BARN")
                    barn.add(barnRelasjoner.get(i).get("relatertPersonsIdent").textValue())
            return PersonInfo("", "", barn)

        }
    }
}


class PdlMock : PdlService {
    override suspend fun personInfo(person: String): PersonInfo {
        return PersonInfo("Donald", "Duck", listOf("ole", "dole", "doffen"))
    }

}

data class PersonInfo(
    val fornavn: String,
    val etternavn: String,
    val barn: List<String>
)


