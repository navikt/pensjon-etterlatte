package no.nav.etterlatte.mottak

import com.fasterxml.jackson.annotation.JsonInclude
import com.github.navikt.tbd_libs.rapids_and_rivers_api.MessageContext
import efterlatte.prosessering.RetryPolicy
import io.ktor.client.HttpClient
import io.ktor.client.engine.okhttp.OkHttp
import io.ktor.client.plugins.HttpTimeout
import io.ktor.client.plugins.contentnegotiation.ContentNegotiation
import io.ktor.serialization.jackson3.jackson
import no.nav.etterlatte.funksjonsbrytere.FeatureToggleProperties
import no.nav.etterlatte.funksjonsbrytere.FeatureToggleService
import no.nav.etterlatte.httpClientClientCredentials
import no.nav.etterlatte.mottak.admin.ProsesseringAdminDao
import no.nav.etterlatte.mottak.journalfoering.DokarkivKlient
import no.nav.etterlatte.mottak.journalfoering.PdfgenKlient
import no.nav.etterlatte.mottak.steg.FullfoerMottakSteg
import no.nav.etterlatte.mottak.steg.HentJournalfoeringskontekstSteg
import no.nav.etterlatte.mottak.steg.JournalfoerSteg
import no.nav.etterlatte.mottak.steg.OverleverTilGjennySteg
import soeknad.PostgresSoeknadRepository
import tools.jackson.databind.DeserializationFeature
import javax.sql.DataSource
import kotlin.time.Duration
import kotlin.time.Duration.Companion.seconds

/**
 * Konfigurasjon for søknadsmottaket i prosesseringsløpet. Finnes bare der det er slått på med
 * `SOEKNAD_MOTTAK_PROSESSERING=aktivert` (dev). Uten den starter appen som før, uten motor og admin-API,
 * og alle søknader går til Kafka-løpet.
 */
data class MottakKonfig(
    val etterlatteApiUrl: String,
    val etterlatteApiScope: String,
    val dokarkivUrl: String,
    val dokarkivScope: String,
    val pdfgenrsUrl: String,
    val unleash: FeatureToggleProperties,
    val prosesseringRolleGruppe: String,
    val azureWellKnownUrl: String,
    val azureClientId: String,
    val node: String,
) {
    companion object {
        const val AKTIVERT = "aktivert"

        fun fraEnv(env: Map<String, String>): MottakKonfig? {
            if (env["SOEKNAD_MOTTAK_PROSESSERING"] != AKTIVERT) return null

            fun krev(navn: String) =
                requireNotNull(env[navn]) {
                    "$navn må være satt når søknadsmottak med prosessering er aktivert"
                }
            return MottakKonfig(
                etterlatteApiUrl = krev("ETTERLATTE_API_URL"),
                etterlatteApiScope = krev("ETTERLATTE_API_AZURE_SCOPE"),
                dokarkivUrl = krev("DOKARKIV_URL"),
                dokarkivScope = krev("DOKARKIV_SCOPE"),
                pdfgenrsUrl = krev("PDFGENRS_URL"),
                unleash =
                    FeatureToggleProperties(
                        applicationName = krev("NAIS_APP_NAME"),
                        host = krev("UNLEASH_SERVER_API_URL"),
                        apiKey = krev("UNLEASH_SERVER_API_TOKEN"),
                    ),
                prosesseringRolleGruppe = krev("PROSESSERING_ROLLE_GROUPID"),
                azureWellKnownUrl = krev("AZURE_APP_WELL_KNOWN_URL"),
                azureClientId = krev("AZURE_APP_CLIENT_ID"),
                node = env["HOSTNAME"] ?: krev("NAIS_APP_NAME"),
            )
        }
    }
}

/** Alt søknadsmottaket trenger, koblet sammen. Klientene opprettes bare når mottaket er konfigurert. */
class SoeknadMottakKontekst(
    val konfig: MottakKonfig,
    dataSource: DataSource,
    soeknader: PostgresSoeknadRepository,
    rapid: () -> MessageContext,
    toggles: FeatureToggleService = FeatureToggleService.initialiser(konfig.unleash),
    gjennyHttpClient: HttpClient = httpClientClientCredentials(konfig.etterlatteApiScope, timeoutMillis = TIMEOUT_MS),
    dokarkivHttpClient: HttpClient = httpClientClientCredentials(konfig.dokarkivScope, timeoutMillis = TIMEOUT_MS),
    pdfgenHttpClient: HttpClient = pdfgenHttpClient(),
    pollIntervall: Duration = 2.seconds,
    retry: RetryPolicy = MottakTasks.RETRY,
) {
    private val mottakDao = SoeknadMottakDao()
    private val gjenny = GjennyMottakKlient(gjennyHttpClient, konfig.etterlatteApiUrl)

    val prosessering =
        MottakProsessering(
            dataSource = dataSource,
            steg =
                listOf(
                    HentJournalfoeringskontekstSteg(soeknader, mottakDao, gjenny, retry),
                    JournalfoerSteg(
                        soeknader,
                        mottakDao,
                        PdfgenKlient(pdfgenHttpClient, konfig.pdfgenrsUrl),
                        DokarkivKlient(dokarkivHttpClient, konfig.dokarkivUrl),
                        retry,
                    ),
                    OverleverTilGjennySteg(soeknader, mottakDao, gjenny, retry),
                    FullfoerMottakSteg(soeknader, mottakDao, rapid, retry),
                ),
            node = konfig.node,
            pollIntervall = pollIntervall,
        )

    val starter: MottakStarter = ProsesseringMottakStarter(prosessering.produsent, mottakDao, toggles)

    val adminDao = ProsesseringAdminDao(dataSource)
}

private fun pdfgenHttpClient() =
    HttpClient(OkHttp) {
        install(ContentNegotiation) {
            jackson {
                disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
                changeDefaultPropertyInclusion { it.withValueInclusion(JsonInclude.Include.NON_NULL) }
            }
        }
        install(HttpTimeout) {
            requestTimeoutMillis = TIMEOUT_MS
            socketTimeoutMillis = TIMEOUT_MS
        }
    }

// Godt under reaperens grense på fem minutter for en task som kjører.
private const val TIMEOUT_MS = 60_000L