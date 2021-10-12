package soknad

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.jacksonTypeRef
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
import kotlinx.coroutines.runBlocking
import no.nav.etterlatte.common.toJson
import no.nav.etterlatte.soknad.Soeknad
import no.nav.etterlatte.soknad.SoeknadService
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.Test

internal class SoeknadServiceTest {

    private val mapper = jacksonObjectMapper()

    private val soeknadKladdJson = """{"harSamtykket":true,"sistLagretDato":"2021-08-10T08:55:28.330Z","klarForLagring":true,"omDeg":{"bostedsadresseBekreftet":"Nei","kontaktinfo":{"telefonnummer":"999 88 777","epost":"test@nav.no"},"oppholderSegINorge":"Ja","alternativAdresse":"Testveien 123, 0594 Oslo","utbetalingsInformasjon":{"kontonummer":"1351.35.13513"}},"omDegOgAvdoed":{"avdoed":{"fornavn":"Død","etternavn":"Testperson","datoForDoedsfallet":"2021-07-26T22:00:00.000Z","doedsfallAarsak":"Ja"},"forholdTilAvdoede":{"relasjon":"avdoede.relasjon.separert","datoForInngaattPartnerskap":"2001-07-26T22:00:00.000Z"},"nySivilstatus":{"sivilstatus":"nySivilstatus.ingen"}},"omDenAvdoede":{"foedselsnummer":"24014021406","statsborgerskap":"Norsk","boddEllerJobbetUtland":{"svar":"Ja","oppholdUtland":[{"land":"Kongo","beskrivelse":["oppholdUtlandType.bodd", "oppholdUtlandType.arbeidet"],"fraDato":"2002-08-10T22:00:00.000Z","tilDato":"2003-08-10T22:00:00.000Z","medlemFolketrygd":"Ja","mottokPensjon":{"beskrivelse":"150.000"}}]},"selvstendigNaeringsdrivende":{"svar":"Ja","beskrivelse":"150 000"},"haddePensjonsgivendeInntekt":{"svar":"Nei"},"harAvtjentMilitaerTjeneste":{"svar":"Ja","beskrivelse":"1984"}},"dinSituasjon":{"jobbStatus":["jobbStatus.arbeidstaker"],"utdanning":{"hoyesteFullfoerteUtdanning":"utdanning.mastergrad"},"andreYtelser":{"kravOmAnnenStonad":{"svar":"Ja","beskrivelse":"Barnepensjon"},"mottarPensjonUtland":{"svar":"Ja","hvaSlagsPensjon":"Polsk Uførepensjon","fraHvilketLand":"Polen","bruttobeloepPrAar":"4000 PLN"}},"arbeidsforhold":{"arbeidsgiver":"Potetskreller AS","startDato":"2021-08-10T22:00:00.000Z","ansettelsesforhold":"stillingType.midlertidig","stillingsprosent":"100%","forventerEndretInntekt":{"svar":"Ja","beskrivelse":"150 000"}}},"opplysningerOmBarn":{"gravidEllerNyligFoedt":"gravidEllerNyligFoedt.venterEllerHarNyligFoedt","barn":[{"fornavn":"Treg","etternavn":"Snøfreser","foedselsnummer":"24014021406","statsborgerskap":"Norsk","bosattUtland":{"svar":"Nei"},"relasjon":"barnRelasjon.fellesbarnMedAvdoede"},{"fornavn":"Smålig","etternavn":"Sykkel","foedselsnummer":"24014021406","statsborgerskap":"Norsk","bosattUtland":{"svar":"Nei"},"relasjon":"barnRelasjon.fellesbarnMedAvdoede"}]}}""".trimIndent()
    private val soeknadKladdMock = mapper.readTree(soeknadKladdJson)

    private val ferdigSoeknadJson = """{"mottattDato":"2021-09-10T13:18:54.191229","oppsummering":[{"tittel":"Om deg","path":"om-deg","elementer":[{"tittel":"Personalia","innhold":[{"spoersmaal":"Navn","svar":"STOR SNERK"},{"spoersmaal":"Bostedsadresse","svar":"Fyrstikkaléen 1 1, 0758 Oslo"},{"spoersmaal":"Fødselsnummer","svar":"11057523044"},{"spoersmaal":"Sivilstatus","svar":"Ugift"},{"spoersmaal":"Statsborgerskap","svar":"Norsk"}]},{"tittel":"Opplysninger om søkeren","innhold":[{"spoersmaal":"Bor du på denne adressen?","svar":"Nei"},{"spoersmaal":"Telefonnummer","svar":"101 01 010"},{"spoersmaal":"E-post","svar":"asdf@nav.no"},{"spoersmaal":"Oppholder du deg for tiden i Norge?","svar":"Nei"},{"spoersmaal":"Oppgi nåværende bostedsadresse","svar":"Shanghai"},{"spoersmaal":"Ønsker du å motta utbetalingen på norsk eller utenlandsk bankkonto?","svar":"Norsk"},{"spoersmaal":"Oppgi norsk kontonummer for utbetaling","svar":"5351.35.13513"},{"spoersmaal":"Oppgi land","svar":"Polen"},{"spoersmaal":"Er du medlem i folketrygden under opphold i et annet land enn Norge?","svar":"Ja"}]}]},{"tittel":"Om deg og avdøde","path":"om-deg-og-avdoed","elementer":[{"innhold":[{"spoersmaal":"Fornavn","svar":"Liten"},{"spoersmaal":"Etternavn","svar":"Testbruker"},{"spoersmaal":"Når skjedde dødsfallet?","svar":"31.08.2021"},{"spoersmaal":"Skyldes dødsfallet yrkesskade/yrkessykdom?","svar":"Nei"},{"spoersmaal":"Relasjonen din til avdøde da dødsfallet skjedde","svar":"Gift eller registrert partner"},{"spoersmaal":"Når ble dere gift?","svar":"17.09.2021"},{"spoersmaal":"Har eller hadde dere felles barn?","svar":"Nei"},{"spoersmaal":"Hadde du omsorg for avdødes barn på dødstidspunktet?","svar":"Ja"},{"spoersmaal":"Sivilstanden din i dag","svar":"Samboer"},{"spoersmaal":"Navn","svar":"Sam Samboersen"},{"spoersmaal":"Fødselsnummer","svar":"24014021406"},{"spoersmaal":"Har samboer inntekt?","svar":"Ja"},{"spoersmaal":"omDegOgAvdoed.nySivilstatus.samboerskap.samboer.harInntekt.inntektstype","svar":"Kapitalinntekt"},{"spoersmaal":"omDegOgAvdoed.nySivilstatus.samboerskap.samboer.harInntekt.inntektstype","svar":"Arbeidsinntekt"},{"spoersmaal":"omDegOgAvdoed.nySivilstatus.samboerskap.samboer.harInntekt.inntektstype","svar":"Pensjon"},{"spoersmaal":"Samlet bruttoinntekt per år","svar":"kr. 360.000,-"},{"spoersmaal":"Vi ble samboere","svar":"31.08.2021"},{"spoersmaal":"Har/hadde dere barn sammen eller var dere tidligere gift?","svar":"Nei"}]}]},{"tittel":"Om den avdøde","path":"om-den-avdoede","elementer":[{"innhold":[{"spoersmaal":"Fødselsnummer","svar":"24014021406"},{"spoersmaal":"Statsborgerskap","svar":"Norsk"},{"spoersmaal":"Var han eller hun selvstendig næringsdrivende?","svar":"Ja"},{"spoersmaal":"Oppgi næringsinntekt fra kalenderåret før dødsfallet","svar":"185 000"},{"spoersmaal":"Hadde han eller hun næringsinntekt når dødsfallet skjedde?","svar":"Ja"},{"spoersmaal":"Gjennomførte han eller hun militær eller sivil førstegangstjeneste som varte minst 30 dager?","svar":"Ja"},{"spoersmaal":"Hvilke(-t) år? (Valgfritt)","svar":"1984"}]},{"tittel":"Opphold i Polen","innhold":[{"spoersmaal":"Land","svar":"Polen"},{"spoersmaal":"Bodd og/eller arbeidet?","svar":"Bodd, Arbeidet"},{"spoersmaal":"Fra dato","svar":"31.08.2021"},{"spoersmaal":"Til dato","svar":"24.09.2021"},{"spoersmaal":"Var han eller hun medlem av folketrygden under oppholdet?","svar":"Ja"},{"spoersmaal":"Oppgi eventuell pensjon han eller hun mottok fra dette landet (per år i kr.)","svar":"150 000"}]},{"tittel":"Opphold i Turkmenistan","innhold":[{"spoersmaal":"Land","svar":"Turkmenistan"},{"spoersmaal":"Bodd og/eller arbeidet?","svar":"Bodd"},{"spoersmaal":"Fra dato","svar":"16.02.2022"},{"spoersmaal":"Til dato","svar":"24.09.2021"},{"spoersmaal":"Var han eller hun medlem av folketrygden under oppholdet?","svar":"Ja"}]}]},{"tittel":"Situasjonen din","path":"din-situasjon","elementer":[{"innhold":[{"spoersmaal":"Hva er situasjonen din nå?","svar":"Jeg er arbeidstaker"},{"spoersmaal":"Hva er situasjonen din nå?","svar":"Jeg er selvstendig næringsdrivende"},{"spoersmaal":"Hva er situasjonen din nå?","svar":"Jeg tar utdanning"},{"spoersmaal":"Hva er situasjonen din nå?","svar":"Annet"},{"spoersmaal":"Hva er din høyeste fullførte utdanning?","svar":"Universitet eller høyskole mer enn 4 år"},{"spoersmaal":"Navnet på utdanningen","svar":"Ingeniør"},{"spoersmaal":"Fra dato","svar":"31.08.2021"},{"spoersmaal":"Til dato","svar":"09.09.2021"},{"spoersmaal":"Har du søkt om andre ytelser fra NAV som du ikke har fått svar på?","svar":"Ja"},{"spoersmaal":"Hva har du søkt om?","svar":"AFP"},{"spoersmaal":"Mottar du pensjon fra et annet land enn Norge?","svar":"Ja"},{"spoersmaal":"Hva slags pensjon?","svar":"Polsk uførepensjon"},{"spoersmaal":"Fra hvilket land?","svar":"Polen"},{"spoersmaal":"Bruttobeløp pr. år i landets valuta","svar":"503030"},{"spoersmaal":"Hva heter firmaet?","svar":"Kult firma"},{"spoersmaal":"Når startet du?","svar":"07.09.2021"},{"spoersmaal":"Type ansettelse","svar":"Sesongansatt"},{"spoersmaal":"Hvor mye jobber du?","svar":"1505050"},{"spoersmaal":"Regner du med at inntekten din endrer seg de neste 12 månedene?","svar":"Ja"},{"spoersmaal":"Forventer du endring i arbeidsforholdet/inntekten som følge av dødsfallet?","svar":"155555"},{"spoersmaal":"Hva heter firmaet?","svar":"Mitt enkeltmannsforetak"},{"spoersmaal":"Når startet du?","svar":"10.09.2021"},{"spoersmaal":"Organisasjonsnummer","svar":"9999999999999999999999999"},{"spoersmaal":"Regner du med at inntekten din endrer seg de neste 12 månedene?","svar":"Ja"},{"spoersmaal":"Hva er grunnen til endringene?","svar":"0"},{"spoersmaal":"Annet","svar":"Litt informasjon om situasjonen"}]}]},{"tittel":"Om barn","path":"om-barn","elementer":[{"innhold":[{"spoersmaal":"Venter du barn eller har du barn som enda ikke er registrert i folkeregisteret?","svar":"Ja"}]},{"tittel":"BLÅØYD SAKS","innhold":[{"spoersmaal":"Fornavn","svar":"BLÅØYD"},{"spoersmaal":"Etternavn","svar":"SAKS"},{"spoersmaal":"Barnets fødselsnummer / d-nummer","svar":"05111850870"},{"spoersmaal":"Statsborgerskap","svar":"Norsk"},{"spoersmaal":"Bor barnet i et annet land enn Norge?","svar":"Ja"},{"spoersmaal":"Land","svar":"Sverige"},{"spoersmaal":"Adresse i utlandet","svar":"Småland"},{"spoersmaal":"Hvem er foreldre til barnet?","svar":"Fellesbarn med avdøde"},{"spoersmaal":"Søk om barnepensjon","svar":"Ja"},{"spoersmaal":"Er det oppnevnt en verge for barnet?","svar":"Ja"},{"spoersmaal":"Navn på verge","svar":"VERG VERGERNES"},{"spoersmaal":"Fødselsnummer til verge","svar":"27121779531"}]},{"tittel":"LITEN DORULL","innhold":[{"spoersmaal":"Fornavn","svar":"LITEN"},{"spoersmaal":"Etternavn","svar":"DORULL"},{"spoersmaal":"Barnets fødselsnummer / d-nummer","svar":"18021780363"},{"spoersmaal":"Statsborgerskap","svar":"Svensk"},{"spoersmaal":"Bor barnet i et annet land enn Norge?","svar":"Nei"},{"spoersmaal":"Hvem er foreldre til barnet?","svar":"Avdødes særkullsbarn"},{"spoersmaal":"Har du daglig omsorg for dette barnet?","svar":"Nei"}]}]}]}"""
    private val ferdigSoeknadMock = mapper.readValue(ferdigSoeknadJson, jacksonTypeRef<Soeknad>())

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
                        (customresponses.removeFirstOrNull() ?: { respond(soeknadKladdMock.toJson(), HttpStatusCode.OK, headers)})()

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

            assertEquals(soeknadKladdMock, result.response)
        }
    }

    @Test
    fun hentKladdFinnesIkke() {
        customresponses.add { respondError(HttpStatusCode.NotFound) }
        runBlocking {
            val result = service.hentKladd()

            assertEquals(HttpStatusCode.NotFound, result.response)
        }
    }

    @Test
    fun hentKladdUhandtertFeil() {
        customresponses.add { respondError(HttpStatusCode.BadRequest) }
        runBlocking {
            val result = service.hentKladd()

            assertNotNull(result.response)
            assertEquals(1, result.exceptions.size)
            assertEquals(HttpStatusCode.BadRequest, result.exceptions[0].let { it as ClientRequestException }.response.status )
        }
    }

    @Test
    fun lagreKladd() {
        runBlocking {
            val result = service.lagreKladd(soeknadKladdMock)

            assertEquals("OK", result.response)
        }
    }

    @Test
    fun sendSoeknad() {
        runBlocking {
            val result = service.sendSoeknad(ferdigSoeknadMock)

            assertEquals("OK", result.response)
        }
    }

    @Test
    fun sendSoeknadFeilerValidering() {
        val soeknadMedFeilJson =
            """{"mottattDato":"2021-09-10T13:18:54.191229","oppsummering":[{"tittel":"Om deg og avdøde","path":"om-deg-og-avdoed","elementer":[{"innhold":[{"spoersmaal":"Fornavn","svar":"Liten"},{"spoersmaal":"Etternavn","svar":"Testbruker"},{"spoersmaal":"Når skjedde dødsfallet?","svar":"31.08.2021"},{"spoersmaal":"Skyldes dødsfallet yrkesskade/yrkessykdom?","svar":"Nei"},{"spoersmaal":"Relasjonen din til avdøde da dødsfallet skjedde","svar":"Gift eller registrert partner"},{"spoersmaal":"Når ble dere gift?","svar":"17.09.2021"},{"spoersmaal":"Har eller hadde dere felles barn?","svar":"Nei"},{"spoersmaal":"Hadde du omsorg for avdødes barn på dødstidspunktet?","svar":"Ja"},{"spoersmaal":"Sivilstanden din i dag","svar":"Samboer"},{"spoersmaal":"Navn","svar":"Sam Samboersen"},{"spoersmaal":"Fødselsnummer","svar":"24014021406"},{"spoersmaal":"Har samboer inntekt?","svar":"Ja"},{"spoersmaal":"omDegOgAvdoed.nySivilstatus.samboerskap.samboer.harInntekt.inntektstype","svar":"Kapitalinntekt"},{"spoersmaal":"omDegOgAvdoed.nySivilstatus.samboerskap.samboer.harInntekt.inntektstype","svar":"Arbeidsinntekt"},{"spoersmaal":"omDegOgAvdoed.nySivilstatus.samboerskap.samboer.harInntekt.inntektstype","svar":"Pensjon"},{"spoersmaal":"Samlet bruttoinntekt per år","svar":"kr. 360.000,-"},{"spoersmaal":"Vi ble samboere","svar":"31.08.2021"},{"spoersmaal":"Har/hadde dere barn sammen eller var dere tidligere gift?","svar":"Nei"}]}]},{"tittel":"Om den avdøde","path":"om-den-avdoede","elementer":[{"innhold":[{"spoersmaal":"Fødselsnummer","svar":"24014021406"},{"spoersmaal":"Statsborgerskap","svar":"Norsk"},{"spoersmaal":"Var han eller hun selvstendig næringsdrivende?","svar":"Ja"},{"spoersmaal":"Oppgi næringsinntekt fra kalenderåret før dødsfallet","svar":"185 000"},{"spoersmaal":"Hadde han eller hun næringsinntekt når dødsfallet skjedde?","svar":"Ja"},{"spoersmaal":"Gjennomførte han eller hun militær eller sivil førstegangstjeneste som varte minst 30 dager?","svar":"Ja"},{"spoersmaal":"Hvilke(-t) år? (Valgfritt)","svar":"1984"}]},{"tittel":"Opphold i Polen","innhold":[{"spoersmaal":"Land","svar":"Polen"},{"spoersmaal":"Bodd og/eller arbeidet?","svar":"Bodd, Arbeidet"},{"spoersmaal":"Fra dato","svar":"31.08.2021"},{"spoersmaal":"Til dato","svar":"24.09.2021"},{"spoersmaal":"Var han eller hun medlem av folketrygden under oppholdet?","svar":"Ja"},{"spoersmaal":"Oppgi eventuell pensjon han eller hun mottok fra dette landet (per år i kr.)","svar":"150 000"}]},{"tittel":"Opphold i Turkmenistan","innhold":[{"spoersmaal":"Land","svar":"Turkmenistan"},{"spoersmaal":"Bodd og/eller arbeidet?","svar":"Bodd"},{"spoersmaal":"Fra dato","svar":"16.02.2022"},{"spoersmaal":"Til dato","svar":"24.09.2021"},{"spoersmaal":"Var han eller hun medlem av folketrygden under oppholdet?","svar":"Ja"}]}]},{"tittel":"Situasjonen din","path":"din-situasjon","elementer":[{"innhold":[{"spoersmaal":"Hva er situasjonen din nå?","svar":"Jeg er arbeidstaker"},{"spoersmaal":"Hva er situasjonen din nå?","svar":"Jeg er selvstendig næringsdrivende"},{"spoersmaal":"Hva er situasjonen din nå?","svar":"Jeg tar utdanning"},{"spoersmaal":"Hva er situasjonen din nå?","svar":"Annet"},{"spoersmaal":"Hva er din høyeste fullførte utdanning?","svar":"Universitet eller høyskole mer enn 4 år"},{"spoersmaal":"Navnet på utdanningen","svar":"Ingeniør"},{"spoersmaal":"Fra dato","svar":"31.08.2021"},{"spoersmaal":"Til dato","svar":"09.09.2021"},{"spoersmaal":"Har du søkt om andre ytelser fra NAV som du ikke har fått svar på?","svar":"Ja"},{"spoersmaal":"Hva har du søkt om?","svar":"AFP"},{"spoersmaal":"Mottar du pensjon fra et annet land enn Norge?","svar":"Ja"},{"spoersmaal":"Hva slags pensjon?","svar":"Polsk uførepensjon"},{"spoersmaal":"Fra hvilket land?","svar":"Polen"},{"spoersmaal":"Bruttobeløp pr. år i landets valuta","svar":"503030"},{"spoersmaal":"Hva heter firmaet?","svar":"Kult firma"},{"spoersmaal":"Når startet du?","svar":"07.09.2021"},{"spoersmaal":"Type ansettelse","svar":"Sesongansatt"},{"spoersmaal":"Hvor mye jobber du?","svar":"1505050"},{"spoersmaal":"Regner du med at inntekten din endrer seg de neste 12 månedene?","svar":"Ja"},{"spoersmaal":"Forventer du endring i arbeidsforholdet/inntekten som følge av dødsfallet?","svar":"155555"},{"spoersmaal":"Hva heter firmaet?","svar":"Mitt enkeltmannsforetak"},{"spoersmaal":"Når startet du?","svar":"10.09.2021"},{"spoersmaal":"Organisasjonsnummer","svar":"9999999999999999999999999"},{"spoersmaal":"Regner du med at inntekten din endrer seg de neste 12 månedene?","svar":"Ja"},{"spoersmaal":"Hva er grunnen til endringene?","svar":"0"},{"spoersmaal":"Annet","svar":"Litt informasjon om situasjonen"}]}]},{"tittel":"Om barn","path":"om-barn","elementer":[{"innhold":[{"spoersmaal":"Venter du barn eller har du barn som enda ikke er registrert i folkeregisteret?","svar":"Ja"}]},{"tittel":"BLÅØYD SAKS","innhold":[{"spoersmaal":"Fornavn","svar":"BLÅØYD"},{"spoersmaal":"Etternavn","svar":"SAKS"},{"spoersmaal":"Barnets fødselsnummer / d-nummer","svar":"05111850870"},{"spoersmaal":"Statsborgerskap","svar":"Norsk"},{"spoersmaal":"Bor barnet i et annet land enn Norge?","svar":"Ja"},{"spoersmaal":"Land","svar":"Sverige"},{"spoersmaal":"Adresse i utlandet","svar":"Småland"},{"spoersmaal":"Hvem er foreldre til barnet?","svar":"Fellesbarn med avdøde"},{"spoersmaal":"Søk om barnepensjon","svar":"Ja"},{"spoersmaal":"Er det oppnevnt en verge for barnet?","svar":"Ja"},{"spoersmaal":"Navn på verge","svar":"VERG VERGERNES"},{"spoersmaal":"Fødselsnummer til verge","svar":"27121779531"}]},{"tittel":"LITEN DORULL","innhold":[{"spoersmaal":"Fornavn","svar":"LITEN"},{"spoersmaal":"Etternavn","svar":"DORULL"},{"spoersmaal":"Barnets fødselsnummer / d-nummer","svar":"18021780363"},{"spoersmaal":"Statsborgerskap","svar":"Svensk"},{"spoersmaal":"Bor barnet i et annet land enn Norge?","svar":"Nei"},{"spoersmaal":"Hvem er foreldre til barnet?","svar":"Avdødes særkullsbarn"},{"spoersmaal":"Har du daglig omsorg for dette barnet?","svar":"Nei"}]}]}]}"""
        val soeknadMedFeilMock = mapper.readValue(soeknadMedFeilJson, jacksonTypeRef<Soeknad>())

        runBlocking {
            try {
                service.sendSoeknad(soeknadMedFeilMock)
            } catch (ex: Exception) {
                assertEquals("Søknad inneholder færre grupper enn forventet", ex.message)
            }
        }
    }

    @Test
    fun slettKladdOK() {
        runBlocking {
            val result = service.slettKladd()

            assertEquals(HttpStatusCode.NoContent, result.response)
        }
    }

}

private fun <E> MutableList<E>.pop(): E? = if (isEmpty()) null else removeAt(0)
