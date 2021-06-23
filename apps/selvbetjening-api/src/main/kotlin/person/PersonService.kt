package no.nav.etterlatte.person

import com.fasterxml.jackson.databind.node.ObjectNode
import io.ktor.client.HttpClient
import io.ktor.client.request.accept
import io.ktor.client.request.header
import io.ktor.client.request.post
import io.ktor.content.TextContent
import io.ktor.features.NotFoundException
import io.ktor.http.ContentType.Application.Json
import no.nav.etterlatte.common.mapJsonToAny
import no.nav.etterlatte.common.toJson
import no.nav.etterlatte.common.typeRefs
import no.nav.etterlatte.person.model.GraphqlRequest
import no.nav.etterlatte.person.model.PersonResponse
import no.nav.etterlatte.person.model.Variables
import org.slf4j.LoggerFactory

interface PersonKlient {
    suspend fun hentPerson(fnr: String): Person
}

class PersonService(
    private val httpClient: HttpClient
): PersonKlient {
    private val logger = LoggerFactory.getLogger(PersonService::class.java)

    companion object {
        private const val TEMA = "PEN"
    }

    override suspend fun hentPerson(fnr: String): Person {
        val query = javaClass.getResource("/pdl/hentPerson.graphql")
            .readText()
            .replace(Regex("[\n\t]"), "")

        val request = GraphqlRequest(query, Variables(ident = fnr)).toJson()

        val responseNode = httpClient.post<ObjectNode> {
            header("Tema", TEMA)
            accept(Json)
            body = TextContent(request, Json)
        }

        logger.info(responseNode.toPrettyString())

        val response = try {
            mapJsonToAny(responseNode.toJson(), typeRefs<PersonResponse>())
        } catch (e: Exception) {
            logger.error("Error under deserialisering av pdl repons", e)
            throw e
        }

        return response.tilPerson(fnr)
    }

    private fun PersonResponse.tilPerson(fnr: String): Person {
        val hentPerson = this.data?.hentPerson
        if (hentPerson === null) {
            logger.error("Kunne ikke hente person fra PDL")
            throw NotFoundException()
        }

        val navn = hentPerson.navn.singleOrNull()!!

        val bostedsadresse = hentPerson.bostedsadresse
            .maxByOrNull { it.metadata.sisteRegistrertDato() }

        val statsborgerskap = hentPerson.statsborgerskap
            .maxByOrNull { it.metadata.sisteRegistrertDato() }

        val sivilstand = hentPerson.sivilstand
            .maxByOrNull { it.metadata.sisteRegistrertDato() }

        val foedsel = hentPerson.foedsel
            .maxByOrNull { it.metadata.sisteRegistrertDato() }

        return Person(
            fornavn = navn.fornavn,
            etternavn = navn.etternavn,
            foedselsnummer = fnr,
            foedselsdato = foedsel?.foedselsdato?.toString(),
            foedselsaar = foedsel?.foedselsaar,
            adresse = bostedsadresse?.vegadresse?.toString(),
            statsborgerskap = statsborgerskap?.land,
            sivilstatus = sivilstand?.type?.name
        )
    }
}
