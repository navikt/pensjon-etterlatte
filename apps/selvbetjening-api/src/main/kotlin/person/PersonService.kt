package no.nav.etterlatte.person

import com.fasterxml.jackson.databind.node.ObjectNode
import io.ktor.client.HttpClient
import io.ktor.client.request.accept
import io.ktor.client.request.header
import io.ktor.client.request.post
import io.ktor.content.TextContent
import io.ktor.features.NotFoundException
import io.ktor.http.ContentType.Application.Json
import kotlinx.coroutines.runBlocking
import no.nav.etterlatte.common.mapJsonToAny
import no.nav.etterlatte.common.toJson
import no.nav.etterlatte.common.unsafeRetry
import no.nav.etterlatte.kodeverk.KodeverkService
import no.nav.etterlatte.person.model.GraphqlRequest
import no.nav.etterlatte.person.model.PersonResponse
import no.nav.etterlatte.person.model.Variables
import org.slf4j.LoggerFactory

interface PersonKlient {
    suspend fun hentPerson(fnr: String): Person
}

class PersonService(
    private val httpClient: HttpClient,
    private val kodeverkService: KodeverkService
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

        val responseNode = unsafeRetry{
            httpClient.post<ObjectNode> {
            header("Tema", TEMA)
            accept(Json)
            body = TextContent(request, Json)
        }
    }

        logger.info(responseNode.toPrettyString())

        val response = try {
            mapJsonToAny<PersonResponse>(responseNode.toJson())
        } catch (e: Exception) {
            logger.error("Error under deserialisering av pdl repons", e)
            throw e
        }

        return response.tilPerson(fnr)
    }

    private suspend fun PersonResponse.tilPerson(fnr: String): Person {
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

        val poststed = "poststed" // kodeverkService.hentPoststed(bostedsadresse?.vegadresse?.postnummer)

        return Person(
            fornavn = navn.fornavn,
            etternavn = navn.etternavn,
            foedselsnummer = fnr,
            foedselsdato = foedsel?.foedselsdato?.toString(),
            foedselsaar = foedsel?.foedselsaar,
            adresse = bostedsadresse?.vegadresse?.adressenavn,
            husnummer = bostedsadresse?.vegadresse?.husnummer,
            husbokstav = bostedsadresse?.vegadresse?.husbokstav,
            postnummer = bostedsadresse?.vegadresse?.postnummer,
            poststed = poststed,
            statsborgerskap = statsborgerskap?.land,
            sivilstatus = sivilstand?.type?.name
        )
    }
}
