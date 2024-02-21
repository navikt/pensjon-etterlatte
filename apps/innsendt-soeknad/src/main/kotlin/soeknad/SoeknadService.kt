package no.nav.etterlatte.soeknad

import com.fasterxml.jackson.databind.JsonNode
import no.nav.etterlatte.SoeknadPubliserer
import no.nav.etterlatte.libs.common.innsendtsoeknad.common.SoeknadRequest
import no.nav.etterlatte.libs.common.person.Foedselsnummer
import no.nav.etterlatte.sikkerLogg
import no.nav.etterlatte.toJson
import org.slf4j.LoggerFactory
import soeknad.LagretSoeknad
import soeknad.SoeknadID
import soeknad.SoeknadRepository
import soeknad.Status
import soeknad.UlagretSoeknad

class SoeknadService(private val db: SoeknadRepository, private val publiserSoeknad: SoeknadPubliserer) {
    private val logger = LoggerFactory.getLogger(SoeknadService::class.java)

    fun sendSoeknad(innloggetBrukerFnr: Foedselsnummer, request: SoeknadRequest, kilde: String): Boolean {
        sikkerLogg.info("Mottok ${request.soeknader.size} søknad(er) fra bruker $innloggetBrukerFnr")
        logger.info("Forsøker lagring av mottatte søknader (antall=${request.soeknader.size})")
        // Verifisere at det er innlogget bruker som er registrert som innsender
        validerInnsender(innloggetBrukerFnr, request)

        val ider = validerOgFerdigstillSoeknader(request, kilde)

        return if (ider.size == request.soeknader.size) {
            logger.info("Lagret alle (${ider.size}) innsendte søknader.")

            val innsenderSoekerIkke = request.soeknader.none { it.soeker.foedselsnummer.svar == innloggetBrukerFnr }
            if (innsenderSoekerIkke) {
                db.slettOgKonverterKladd(innloggetBrukerFnr.value, kilde)
            }

            true
        } else {
            logger.error("Kun ${ider.size} av ${request.soeknader.size} ble lagret.")
            sikkerLogg.error("Feil ved lagring av søknad: \n${request.toJson()}")
            false
        }
    }

    private fun validerInnsender(innloggetBrukerFnr: Foedselsnummer, request: SoeknadRequest) {
        val innsenderErInnlogget = request.soeknader.all { innloggetBrukerFnr == it.innsender.foedselsnummer.svar }

        if (!innsenderErInnlogget) {
            val innsenderListe = request.soeknader.map { it.innsender.foedselsnummer.svar.value }

            logger.error("Søknad innsender er ikke samme som innlogget bruker!")
            sikkerLogg.error(
                "Innsender er ikke samme som innlogget bruker ($innloggetBrukerFnr): \n" +
                        "${request.soeknader.size} søknad(er) med innsendere: $innsenderListe \n" +
                        request.toJson()
            )
            throw RuntimeException("Ugyldig innsender")
        }
    }

    private fun validerOgFerdigstillSoeknader(request: SoeknadRequest, kilde: String): List<SoeknadID> {
        val soeknader = request.soeknader
            .map { UlagretSoeknad(it.soeker.foedselsnummer.svar.value, it.toJson(), kilde, it.type) }

        val finnesKonlflikter = soeknader
            .mapNotNull { db.finnKladd(it.fnr, it.kilde)?.status }
            .any { it != Status.LAGRETKLADD }

        if (finnesKonlflikter) throw SoeknadConflictException()

        return soeknader.map {
            db.ferdigstillSoeknad(it).also { ferdigstiltID ->
                logger.info("Ferdigstilt søknad $ferdigstiltID (type=${it.type})")
                publiserSoeknad.publiserDeleteUtkastFraMinSide(it.fnr, ferdigstiltID)
            }
        }
    }

    fun hentKladd(innloggetBruker: Foedselsnummer, kilde: String): LagretSoeknad? {
        return db.finnKladd(innloggetBruker.value, kilde)
            ?.also { logger.info("Fant kladd (id=${it.id})") }
    }

    fun lagreKladd(innloggetBruker: Foedselsnummer, soeknad: JsonNode, kilde: String): SoeknadID {
        val lagretkladd = db.lagreKladd(UlagretSoeknad(innloggetBruker.value, soeknad.toJson(), kilde))
            .also { logger.info("Lagret kladd (id=${it.id})") }

        publiserSoeknad.publiserCreateUtkastTilMinSide(lagretkladd, kilde)

        return lagretkladd.id
    }

    fun slettKladd(innloggetBruker: Foedselsnummer, kilde: String) {
        db.slettKladd(innloggetBruker.value, kilde)
            ?.also {
                logger.info("Slettet kladd (id=${it})")
                publiserSoeknad.publiserDeleteUtkastFraMinSide(innloggetBruker.value, it)
            }
    }
}

class SoeknadConflictException : RuntimeException("Bruker")
