package no.nav.etterlatte.soeknad

import com.fasterxml.jackson.databind.JsonNode
import io.ktor.http.HttpStatusCode
import libs.common.util.RetryResult
import libs.common.util.retry
import no.nav.etterlatte.libs.common.innsendtsoeknad.common.SoeknadRequest
import no.nav.etterlatte.libs.common.person.Foedselsnummer
import org.slf4j.LoggerFactory
import soeknad.SoeknadID
import soeknad.Status

class SoeknadService2(
	private val service: SoeknadService
) {
	private val logger = LoggerFactory.getLogger(SoeknadService::class.java)

	suspend fun sendSoeknader(
		fnr: Foedselsnummer,
		request: SoeknadRequest,
		kilde: String
	): Boolean {
		return service.sendSoeknad(fnr, request, kilde)
	}

	fun lagreKladd(
		fnr: Foedselsnummer,
		json: JsonNode,
		kilde: String
	): SoeknadID = service.lagreKladd(fnr, json, kilde)

	fun hentKladd(fnr: Foedselsnummer, kilde: String) = service.hentKladd(fnr, kilde)

	fun slettKladd(fnr: Foedselsnummer, kilde: String) = service.slettKladd(fnr, kilde)

}