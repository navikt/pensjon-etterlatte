package no.nav.etterlatte.soeknad

import com.fasterxml.jackson.databind.JsonNode
import io.ktor.http.HttpStatusCode
import libs.common.util.RetryResult
import libs.common.util.retry
import no.nav.etterlatte.adressebeskyttelse.AdressebeskyttelseService
import no.nav.etterlatte.adressebeskyttelse.finnUnikeBarn
import no.nav.etterlatte.adressebeskyttelse.fjernStedslokaliserendeInfo
//import no.nav.etterlatte.internal.Metrikker
import no.nav.etterlatte.libs.common.innsendtsoeknad.common.SoeknadRequest
import no.nav.etterlatte.libs.common.person.Foedselsnummer
import no.nav.etterlatte.pdl.Gradering
import org.slf4j.LoggerFactory
import soeknad.Status

internal fun SoeknadRequest.hentSaktype() = this.soeknader.first().type

class SoeknadService2(
	//private val innsendtSoeknadKlient: HttpClient,
	private val service: SoeknadService,
	private val adressebeskyttelseService: AdressebeskyttelseService
) {
	private val logger = LoggerFactory.getLogger(SoeknadService::class.java)

	suspend fun sendSoeknader(
		fnr: Foedselsnummer,
		request: SoeknadRequest,
		kilde: String
	): HttpStatusCode {
		logger.info("Mottatt fullført søknad. Forsøker å sende til lagring.")

		/*
		 TODO Metrics
		request.soeknader.forEach {
			Metrikker.soeknadTotal.labels(it.type.name).inc()
		}
		*/

		try {
			val ferdigstiltOK = service.sendSoeknad(fnr, vurderAdressebeskyttelse(request), kilde)
			logger.info("SoeknadRequest ferdigstilt ok: $ferdigstiltOK")
			return HttpStatusCode.OK
		} catch (e: SoeknadConflictException) {
			logger.warn("Bruker har allerede en innsendt søknad under arbeid", e)
			return HttpStatusCode.Conflict
		} catch (e: Exception) {
			logger.error("Klarte ikke å lagre søknaden(e)", e)
			throw e
		}
	}

	private suspend fun vurderAdressebeskyttelse(request: SoeknadRequest): SoeknadRequest {
		val barnMedAdressebeskyttelse =
			adressebeskyttelseService
				.hentGradering(request.finnUnikeBarn(), request.hentSaktype())
				.filter { listOf(Gradering.STRENGT_FORTROLIG, Gradering.STRENGT_FORTROLIG_UTLAND).contains(it.value) }
				.map { it.key }

		//Metrikker.soeknadGradertTotal.inc(barnMedAdressebeskyttelse.size.toDouble()) TODO Metrics

		return if (barnMedAdressebeskyttelse.isNotEmpty()) {
			logger.info("Fjerner informasjon om utenlandsadresse før søknaden(e) sendes til lagring.")
			request.fjernStedslokaliserendeInfo(barnMedAdressebeskyttelse)
		} else {
			request
		}
	}

	suspend fun lagreKladd(
		fnr: Foedselsnummer,
		json: JsonNode,
		kilde: String
	): RetryResult =
		retry {
			logger.info("Lagrer kladd for innlogget bruker.")
			service.lagreKladd(fnr, json, kilde)
		}

	suspend fun hentKladd(fnr: Foedselsnummer, kilde: String): RetryResult =
		retry {
			logger.info("Henter kladd for innlogget bruker.")
            val soeknad = service.hentKladd(fnr, kilde)

            if (soeknad == null) {
                HttpStatusCode.NotFound
            } else if (soeknad.status != Status.LAGRETKLADD) {
                HttpStatusCode.Conflict
            } else {
                soeknad
            }
		}

	suspend fun slettKladd(fnr: Foedselsnummer, kilde: String): RetryResult =
		retry {
			logger.info("Sletter kladd for innlogget bruker.")
			service.slettKladd(fnr, kilde)
			HttpStatusCode.OK
		}
}