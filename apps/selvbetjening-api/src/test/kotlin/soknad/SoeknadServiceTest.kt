package soknad

import com.fasterxml.jackson.annotation.JsonInclude
import com.fasterxml.jackson.databind.DeserializationFeature
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import io.ktor.client.HttpClient
import io.ktor.client.engine.mock.MockEngine
import io.ktor.client.engine.mock.MockRequestHandleScope
import io.ktor.client.engine.mock.respond
import io.ktor.client.engine.mock.respondError
import io.ktor.client.features.ClientRequestException
import io.ktor.client.features.json.JacksonSerializer
import io.ktor.client.features.json.JsonFeature
import io.ktor.client.request.HttpResponseData
import io.ktor.http.HttpHeaders
import io.ktor.http.HttpMethod
import io.ktor.http.HttpStatusCode
import io.ktor.http.headersOf
import io.ktor.utils.io.ByteReadChannel
import io.mockk.coEvery
import io.mockk.mockk
import kotlinx.coroutines.runBlocking
import no.nav.etterlatte.adressebeskyttelse.AdressebeskyttelseService
import no.nav.etterlatte.common.toJson
import no.nav.etterlatte.libs.common.innsendtsoeknad.common.SoeknadRequest
import no.nav.etterlatte.libs.common.pdl.Adressebeskyttelse
import no.nav.etterlatte.libs.common.pdl.AdressebeskyttelseBolkPerson
import no.nav.etterlatte.libs.common.pdl.AdressebeskyttelseKlient
import no.nav.etterlatte.libs.common.pdl.AdressebeskyttelsePerson
import no.nav.etterlatte.libs.common.pdl.AdressebeskyttelseResponse
import no.nav.etterlatte.libs.common.pdl.Gradering
import no.nav.etterlatte.libs.common.pdl.HentAdressebeskyttelse
import no.nav.etterlatte.soknad.SoeknadService
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import libs.common.util.RetryResult
import no.nav.etterlatte.libs.common.test.InnsendtSoeknadFixtures.barnepensjon
import no.nav.etterlatte.libs.common.test.InnsendtSoeknadFixtures.gjenlevendepensjon

internal class SoeknadServiceTest {

    private val adressebeskyttelseKlientMock = mockk<AdressebeskyttelseKlient>()
    private val mapper = jacksonObjectMapper()

    private val soeknadKladdJson =
        """{"harSamtykket":true,"sistLagretDato":"2021-10-14T10:43:43.629Z","omDeg":{"bostedsadresseBekreftet":"Nei","kontaktinfo":{"telefonnummer":"999 88 777","epost":"test@nav.no"},"oppholderSegINorge":"Ja","alternativAdresse":"Testveien 123, 0594 Oslo","utbetalingsInformasjon":{"kontonummer":"1351.35.13513"}},"omDegOgAvdoed":{"avdoed":{"fornavn":"Død","etternavn":"Testperson","datoForDoedsfallet":"2021-07-26T22:00:00.000Z"},"forholdTilAvdoede":{"relasjon":"avdoede.relasjon.separert","datoForInngaattPartnerskap":"2001-07-26T22:00:00.000Z"},"nySivilstatus":{"sivilstatus":"nySivilstatus.enslig"}},"omDenAvdoede":{"foedselsnummer":"24014021406","statsborgerskap":"Norsk","boddEllerJobbetUtland":{"svar":"Ja","oppholdUtland":[{"land":"Kongo","beskrivelse":["oppholdUtlandType.bodd","oppholdUtlandType.arbeidet"],"fraDato":"2002-08-10T22:00:00.000Z","tilDato":"2003-08-10T22:00:00.000Z","medlemFolketrygd":"Ja","mottokPensjon":{"beskrivelse":"150.000"}}]},"selvstendigNaeringsdrivende":{"svar":"Ja","beskrivelse":"150 000"},"haddePensjonsgivendeInntekt":{"svar":"Nei"},"doedsfallAarsak":"Ja","harAvtjentMilitaerTjeneste":{"svar":"Ja","beskrivelse":"1984"}},"dinSituasjon":{"jobbStatus":["jobbStatus.arbeidstaker"],"utdanning":{"hoyesteFullfoerteUtdanning":"utdanning.mastergrad"},"andreYtelser":{"kravOmAnnenStonad":{"svar":"Ja","beskrivelse":"Barnepensjon"},"annenPensjon":{"svar":"Ja","beskrivelse":"Skandia"},"mottarPensjonUtland":{"svar":"Ja","hvaSlagsPensjon":"Polsk Uførepensjon","fraHvilketLand":"Polen","bruttobeloepPrAar":"4000 PLN"}},"arbeidsforhold":[{"arbeidsgiver":"Potetskreller AS","ansettelsesforhold":"stillingType.midlertidig","stillingsprosent":"100%","forventerEndretInntekt":{"svar":"Ja","beskrivelse":"Forventer økt inntekt"}}]},"opplysningerOmBarn":{"gravidEllerNyligFoedt":"Ja","barn":[{"fornavn":"Treg","etternavn":"Snøfreser","foedselsnummer":"24014021406","statsborgerskap":"Norsk","bosattUtland":{"svar":"Nei"},"relasjon":"barnRelasjon.fellesbarnMedAvdoede","harBarnetVerge":{"svar":"Nei"}},{"fornavn":"Smålig","etternavn":"Sykkel","foedselsnummer":"19016424830","statsborgerskap":"Norsk","bosattUtland":{"svar":"Nei"},"relasjon":"barnRelasjon.fellesbarnMedAvdoede","harBarnetVerge":{"svar":"Nei"}}]}}""".trimIndent()
    private val soeknadKladdMock = mapper.readTree(soeknadKladdJson)

    private val kilde = "barnepensjon-ui"

    private val headers = headersOf(HttpHeaders.ContentType, "application/json")

    private val customresponses = mutableListOf<MockRequestHandleScope.() -> HttpResponseData>()

    private val mockEngine = MockEngine {
        when (it.url.encodedPath) {
            "/kladd" -> {
                when (it.method) {
                    HttpMethod.Post -> {
                        respond("OK", HttpStatusCode.OK, headers)
                    }
                    HttpMethod.Get -> {
                        (customresponses.removeFirstOrNull() ?: {
                            respond(
                                soeknadKladdMock.toJson(),
                                HttpStatusCode.OK,
                                headers
                            )
                        })()

                    }
                    HttpMethod.Delete -> {
                        (customresponses.pop() ?: { respond(ByteReadChannel.Empty, HttpStatusCode.NoContent) })()

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

    private val service = SoeknadService(
        HttpClient(mockEngine) {
            install(JsonFeature) {
                serializer = JacksonSerializer {
                    configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)
                    setSerializationInclusion(JsonInclude.Include.NON_NULL)
                    registerModule(JavaTimeModule())
                }
            }
        },
        AdressebeskyttelseService(adressebeskyttelseKlientMock)
    )

    @Test
    fun hentKladd() {
        runBlocking {
            val result = service.hentKladd(kilde) as RetryResult.Success

            assertEquals(soeknadKladdMock, result.content)
        }
    }

    @Test
    fun hentKladdFinnesIkke() {
        customresponses.add { respondError(HttpStatusCode.NotFound) }
        runBlocking {
            val result = service.hentKladd(kilde) as RetryResult.Success

            assertEquals(HttpStatusCode.NotFound, result.content)
        }
    }

    @Test
    fun hentKladdUhandtertFeil() {
        customresponses.add { respondError(HttpStatusCode.BadRequest) }
        runBlocking {
            val result = service.hentKladd(kilde) as RetryResult.Success

            assertEquals(1, result.previousExceptions.size)
            assertEquals(
                HttpStatusCode.BadRequest,
                result.previousExceptions[0].let { it as ClientRequestException }.response.status
            )
        }
    }

    @Test
    fun lagreKladd() {
        runBlocking {
            val result = service.lagreKladd(soeknadKladdMock, kilde) as RetryResult.Success

            assertEquals("OK", result.content)
        }
    }

    @Test
    fun sendSoeknader() {
        coEvery { adressebeskyttelseKlientMock.finnAdressebeskyttelseForFnr(any()) } returns
                AdressebeskyttelseResponse(
                    HentAdressebeskyttelse(
                        listOf(mockAdressebeskyttetPerson("24014021406", Gradering.UGRADERT))
                    )
                )

        runBlocking {
            val request = SoeknadRequest(listOf(gjenlevendepensjon(), barnepensjon()))
            val result = service.sendSoeknader(request, kilde) as RetryResult.Success

            assertEquals("OK", result.content)
        }
    }

    @Test
    fun slettKladdOK() {
        runBlocking {
            val result = service.slettKladd(kilde) as RetryResult.Success

            assertEquals(HttpStatusCode.NoContent, result.content)
        }
    }
}

private fun mockAdressebeskyttetPerson(ident: String, gradering: Gradering) = AdressebeskyttelseBolkPerson(
    ident,
    person = AdressebeskyttelsePerson(listOf(Adressebeskyttelse(gradering)))
)

private fun <E> MutableList<E>.pop(): E? = if (isEmpty()) null else removeAt(0)
