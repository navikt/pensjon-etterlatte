package soknad

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import io.ktor.client.HttpClient
import io.ktor.client.engine.mock.MockEngine
import io.ktor.client.engine.mock.MockRequestHandleScope
import io.ktor.client.engine.mock.respond
import io.ktor.client.engine.mock.respondError
import io.ktor.client.features.json.JacksonSerializer
import io.ktor.client.features.json.JsonFeature
import io.ktor.client.request.HttpResponseData
import io.ktor.http.HttpHeaders
import io.ktor.http.HttpMethod
import io.ktor.http.HttpStatusCode
import io.ktor.http.headersOf
import io.ktor.utils.io.ByteReadChannel
import kotlinx.coroutines.runBlocking
import no.nav.etterlatte.common.toJson
import no.nav.etterlatte.soknad.SoeknadService
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test

internal class SoeknadServiceTest {

    private val soeknadJson = """{"harSamtykket":true,"sistLagretDato":"2021-08-10T08:55:28.330Z","klarForLagring":true,"omDeg":{"bostedsadresseBekreftet":"Nei","kontaktinfo":{"telefonnummer":"999 88 777","epost":"test@nav.no"},"oppholderSegINorge":"Ja","alternativAdresse":"Testveien 123, 0594 Oslo","utbetalingsInformasjon":{"kontonummer":"1351.35.13513"}},"omDegOgAvdoed":{"avdoed":{"fornavn":"Død","etternavn":"Testperson","datoForDoedsfallet":"2021-07-26T22:00:00.000Z","doedsfallAarsak":"Ja"},"forholdTilAvdoede":{"relasjon":"avdoede.relasjon.separert","datoForInngaattPartnerskap":"2001-07-26T22:00:00.000Z"},"nySivilstatus":{"sivilstatus":"nySivilstatus.ingen"}},"omDenAvdoede":{"foedselsnummer":"24014021406","statsborgerskap":"Norsk","boddEllerJobbetUtland":{"svar":"Ja","oppholdUtland":[{"land":"Kongo","beskrivelse":["oppholdUtlandType.bodd", "oppholdUtlandType.arbeidet"],"fraDato":"2002-08-10T22:00:00.000Z","tilDato":"2003-08-10T22:00:00.000Z","medlemFolketrygd":"Ja","mottokPensjon":{"beskrivelse":"150.000"}}]},"selvstendigNaeringsdrivende":{"svar":"Ja","beskrivelse":"150 000"},"haddePensjonsgivendeInntekt":{"svar":"Nei"},"harAvtjentMilitaerTjeneste":{"svar":"Ja","beskrivelse":"1984"}},"dinSituasjon":{"jobbStatus":["jobbStatus.arbeidstaker"],"utdanning":{"hoyesteFullfoerteUtdanning":"utdanning.mastergrad"},"andreYtelser":{"kravOmAnnenStonad":{"svar":"Ja","beskrivelse":"Barnepensjon"},"mottarPensjonUtland":{"svar":"Ja","hvaSlagsPensjon":"Polsk Uførepensjon","fraHvilketLand":"Polen","bruttobeloepPrAar":"4000 PLN"}},"arbeidsforhold":{"arbeidsgiver":"Potetskreller AS","startDato":"2021-08-10T22:00:00.000Z","ansettelsesforhold":"stillingType.midlertidig","stillingsprosent":"100%","forventerEndretInntekt":{"svar":"Ja","beskrivelse":"150 000"}}},"opplysningerOmBarn":{"gravidEllerNyligFoedt":"gravidEllerNyligFoedt.venterEllerHarNyligFoedt","barn":[{"fornavn":"Treg","etternavn":"Snøfreser","foedselsnummer":"24014021406","statsborgerskap":"Norsk","bosattUtland":{"svar":"Nei"},"relasjon":"barnRelasjon.fellesbarnMedAvdoede"},{"fornavn":"Smålig","etternavn":"Sykkel","foedselsnummer":"24014021406","statsborgerskap":"Norsk","bosattUtland":{"svar":"Nei"},"relasjon":"barnRelasjon.fellesbarnMedAvdoede"}]}}""".trimIndent()
    private val mockSoeknad = jacksonObjectMapper().readTree(soeknadJson)

    private val headers = headersOf(HttpHeaders.ContentType, "application/json")

    private val customresponses = mutableListOf<MockRequestHandleScope.()->HttpResponseData>()


    private val mockEngine = MockEngine {
        when (it.url.encodedPath) {
            "/kladd" -> {
                when (it.method) {
                    HttpMethod.Post -> {
                        respond("OK", HttpStatusCode.OK, headers)
                    }
                    HttpMethod.Get -> {
                        respond(mockSoeknad.toJson(), HttpStatusCode.OK, headers)
                    }
                    HttpMethod.Delete -> {
                        (customresponses.pop()?:{respond(ByteReadChannel.Empty, HttpStatusCode.NoContent)})()

                    }
                    else -> {
                        error("Unhandled ${it.url.encodedPath}")
                    }
                }
            }
            "/soeknad" -> {
                respond("OK", HttpStatusCode.OK, headers)
            }
            else -> {
                error("Unhandled ${it.url.encodedPath}")
            }
        }
    }

    private val service = SoeknadService(HttpClient(mockEngine) {
        install(JsonFeature) { serializer = JacksonSerializer() }
    })

    @Test
    fun hentKladd() {
        runBlocking {
            val result = service.hentKladd()

            assertEquals(mockSoeknad, result.response)
        }
    }

    @Test
    fun lagreKladd() {
        runBlocking {
            val result = service.lagreKladd(mockSoeknad)

            assertEquals("OK", result.response)
        }
    }

    @Test
    fun sendSoeknad() {
        runBlocking {
            val result = service.sendSoknad(mockSoeknad)

            assertEquals("OK", result.response)
        }
    }

    @Test
    fun slettKladdOK() {
        runBlocking {
            val result = service.slettKladd()

            assertEquals(HttpStatusCode.NoContent, result.response)
        }
    }

    @Test
    fun slettKladdFinnesIkke() {
        runBlocking {
            customresponses.add{respondError(HttpStatusCode.Gone)}
            val result = service.slettKladd()

            assertEquals(HttpStatusCode.NoContent, result.response)
        }
    }

}

private fun <E> MutableList<E>.pop(): E? = if(isEmpty()) null else removeAt(0)
