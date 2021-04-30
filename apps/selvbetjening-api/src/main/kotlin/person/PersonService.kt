package no.nav.etterlatte.person

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import com.fasterxml.jackson.annotation.JsonInclude
import com.fasterxml.jackson.core.type.TypeReference
import com.fasterxml.jackson.databind.node.ObjectNode
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import io.ktor.client.HttpClient
import io.ktor.client.request.header
import io.ktor.client.request.post
import io.ktor.content.TextContent
import io.ktor.features.NotFoundException
import io.ktor.http.ContentType
import no.nav.etterlatte.common.mapJsonToAny
import no.nav.etterlatte.common.toJson
import no.nav.etterlatte.common.typeRefs
import no.nav.etterlatte.person.model.GraphqlRequest
import no.nav.etterlatte.person.model.PersonResponse
import no.nav.etterlatte.person.model.Variables
import org.codehaus.jackson.JsonNode
import org.slf4j.LoggerFactory

interface PersonKlient {
    suspend fun hentPerson(fnr: String): Person
}

class PersonService(
    private val uri: String,
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

        val responseNode = httpClient.post<ObjectNode>(uri) {
            header("Tema", TEMA)
            header("Accept", "application/json")
            body = TextContent(request, ContentType.Application.Json)
        }

        logger.info(responseNode.toPrettyString())

        val response = mapJsonToAny(responseNode.toJson(), typeRefs<PersonResponse>())

        val hentPerson = response.data?.hentPerson
        if (hentPerson === null) {
            logger.error("Kunne ikke hente person fra PDL")
            throw NotFoundException()
        }

        val navn = hentPerson.navn.singleOrNull()!!

        // TODO: Uthenting av data fra person

        val bostedsadresse = hentPerson.bostedsadresse
            .maxByOrNull { it.metadata.sisteRegistrertDato() }

        val statsborgerskap = hentPerson.statsborgerskap
            .maxByOrNull { it.metadata.sisteRegistrertDato() }

        val sivilstand = hentPerson.sivilstand
            .maxByOrNull { it.metadata.sisteRegistrertDato() }

        return Person(
            fornavn = navn.fornavn,
            etternavn = navn.etternavn,
            fødselsnummer = fnr,
            adresse = bostedsadresse?.vegadresse?.toString(),
            statsborgerskap = statsborgerskap?.land,
            sivilstatus = sivilstand?.type?.name
        )
    }
}
