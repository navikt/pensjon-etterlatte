package no.nav.etterlatte.person

import io.ktor.server.plugins.NotFoundException
import no.nav.etterlatte.libs.common.person.Foedselsnummer
import no.nav.etterlatte.pdl.ResponseError
import no.nav.etterlatte.person.pdl.HentPerson
import org.slf4j.LoggerFactory

class PersonService(
    private val klient: PersonKlient,
) {
    private val logger = LoggerFactory.getLogger(PersonService::class.java)

    suspend fun hentPerson(fnr: Foedselsnummer): Person {
        logger.info("Henter person fra PDL")

        val response = klient.hentPerson(fnr)

        val pdlPerson = response.data?.hentPerson

        if (pdlPerson == null) {
            loggfoerFeilmeldinger(response.errors)
            throw NotFoundException()
        }

        return lagPerson(fnr, pdlPerson)
    }

    private fun lagPerson(
        fnr: Foedselsnummer,
        hentPerson: HentPerson,
    ): Person {
        val navn = hentPerson.navn.maxByOrNull { it.metadata.sisteRegistrertDato() }!!

        val foedsel =
            hentPerson.foedsel
                .maxByOrNull { it.metadata.sisteRegistrertDato() }

        return Person(
            fornavn = navn.fornavn,
            etternavn = navn.etternavn,
            foedselsnummer = fnr,
            foedselsdato = foedsel?.foedselsdato?.toString(),
            foedselsaar = foedsel?.foedselsaar,
        )
    }

    private fun loggfoerFeilmeldinger(errors: List<ResponseError>?) {
        logger.error("Kunne ikke hente person fra PDL")

        errors?.forEach {
            logger.error(it.message)
        }
    }
}