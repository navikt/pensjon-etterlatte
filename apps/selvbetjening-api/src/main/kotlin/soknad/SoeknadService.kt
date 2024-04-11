package no.nav.etterlatte.soknad

import com.fasterxml.jackson.databind.JsonNode
import io.ktor.client.HttpClient
import io.ktor.client.call.body
import io.ktor.client.plugins.ClientRequestException
import io.ktor.client.request.delete
import io.ktor.client.request.get
import io.ktor.client.request.header
import io.ktor.client.request.parameter
import io.ktor.client.request.post
import io.ktor.client.request.setBody
import io.ktor.http.ContentType.Application.Json
import io.ktor.http.HttpStatusCode
import io.ktor.http.contentType
import io.ktor.http.isSuccess
import no.nav.etterlatte.adressebeskyttelse.AdressebeskyttelseService
import no.nav.etterlatte.internal.Metrikker
import no.nav.etterlatte.libs.common.innsendtsoeknad.common.SoeknadRequest
import no.nav.etterlatte.libs.pdl.Gradering
import org.slf4j.LoggerFactory
import libs.common.util.RetryResult
import libs.common.util.retry
import no.nav.etterlatte.libs.utils.logging.X_CORRELATION_ID
import no.nav.etterlatte.libs.utils.logging.getCorrelationId


internal fun SoeknadRequest.hentSaktype() = this.soeknader.first().type

class SoeknadService(
    private val innsendtSoeknadKlient: HttpClient,
    private val adressebeskyttelseService: AdressebeskyttelseService
) {
    private val logger = LoggerFactory.getLogger(SoeknadService::class.java)

    suspend fun sendSoeknader(request: SoeknadRequest, kilde: String): RetryResult {
        logger.info("Mottatt fullført søknad. Forsøker å sende til lagring.")

        request.soeknader.forEach {
            Metrikker.soeknadTotal.labels(it.type.name).inc()
        }

        return retry(0) {
            innsendtSoeknadKlient.post("soeknad") {
                contentType(Json)
                header("kilde", kilde)
                header(X_CORRELATION_ID, getCorrelationId())
                parameter("kilde", kilde)
                setBody(vurderAdressebeskyttelse(request))
            }.body<String>()
        }
    }

    private suspend fun vurderAdressebeskyttelse(request: SoeknadRequest): SoeknadRequest {
        val barnMedAdressebeskyttelse = adressebeskyttelseService.hentGradering(request.finnUnikeBarn(), request.hentSaktype())
            .filter { listOf(Gradering.STRENGT_FORTROLIG, Gradering.STRENGT_FORTROLIG_UTLAND).contains(it.value) }
            .map { it.key }

        Metrikker.soeknadGradertTotal.inc(barnMedAdressebeskyttelse.size.toDouble())

        return if (barnMedAdressebeskyttelse.isNotEmpty()) {
            logger.info("Fjerner informasjon om utenlandsadresse før søknaden(e) sendes til lagring.")
            request.fjernStedslokaliserendeInfo(barnMedAdressebeskyttelse)
        } else request
    }

    suspend fun lagreKladd(json: JsonNode, kilde: String): RetryResult {
        return retry {
            logger.info("Lagrer kladd for innlogget bruker.")

            innsendtSoeknadKlient.post("kladd") {
                parameter("kilde", kilde)
                header(X_CORRELATION_ID, getCorrelationId())
                contentType(Json)
                setBody(json)
            }.body<String>()
        }
    }

    suspend fun hentKladd(kilde: String): RetryResult = retry {
        try {
            logger.info("Henter kladd for innlogget bruker.")

            val response = innsendtSoeknadKlient.get("kladd") {
                parameter("kilde", kilde)
                header(X_CORRELATION_ID, getCorrelationId())
            }

            if (response.status.isSuccess()) response.body<JsonNode>()
            else throw ClientRequestException(response, response.toString())
        } catch (ex: ClientRequestException) {
            when (ex.response.status) {
                HttpStatusCode.NotFound -> HttpStatusCode.NotFound
                HttpStatusCode.Conflict -> HttpStatusCode.Conflict
                else -> throw ex
            }
        }
    }

    suspend fun slettKladd(kilde: String): RetryResult = retry {
        logger.info("Sletter kladd for innlogget bruker.")

        innsendtSoeknadKlient.delete("kladd") {
            parameter("kilde", kilde)
            header(X_CORRELATION_ID, getCorrelationId())
        }.status
    }
}
