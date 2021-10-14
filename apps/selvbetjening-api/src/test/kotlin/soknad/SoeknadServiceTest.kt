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

    private val soeknadKladdJson = """{"harSamtykket":true,"sistLagretDato":"2021-10-14T10:43:43.629Z","omDeg":{"bostedsadresseBekreftet":"Nei","kontaktinfo":{"telefonnummer":"999 88 777","epost":"test@nav.no"},"oppholderSegINorge":"Ja","alternativAdresse":"Testveien 123, 0594 Oslo","utbetalingsInformasjon":{"kontonummer":"1351.35.13513"}},"omDegOgAvdoed":{"avdoed":{"fornavn":"Død","etternavn":"Testperson","datoForDoedsfallet":"2021-07-26T22:00:00.000Z"},"forholdTilAvdoede":{"relasjon":"avdoede.relasjon.separert","datoForInngaattPartnerskap":"2001-07-26T22:00:00.000Z"},"nySivilstatus":{"sivilstatus":"nySivilstatus.ingen"}},"omDenAvdoede":{"foedselsnummer":"24014021406","statsborgerskap":"Norsk","boddEllerJobbetUtland":{"svar":"Ja","oppholdUtland":[{"land":"Kongo","beskrivelse":["oppholdUtlandType.bodd","oppholdUtlandType.arbeidet"],"fraDato":"2002-08-10T22:00:00.000Z","tilDato":"2003-08-10T22:00:00.000Z","medlemFolketrygd":"Ja","mottokPensjon":{"beskrivelse":"150.000"}}]},"selvstendigNaeringsdrivende":{"svar":"Ja","beskrivelse":"150 000"},"haddePensjonsgivendeInntekt":{"svar":"Nei"},"doedsfallAarsak":"Ja","harAvtjentMilitaerTjeneste":{"svar":"Ja","beskrivelse":"1984"}},"dinSituasjon":{"jobbStatus":["jobbStatus.arbeidstaker"],"utdanning":{"hoyesteFullfoerteUtdanning":"utdanning.mastergrad"},"andreYtelser":{"kravOmAnnenStonad":{"svar":"Ja","beskrivelse":"Barnepensjon"},"annenPensjon":{"svar":"Ja","beskrivelse":"Skandia"},"mottarPensjonUtland":{"svar":"Ja","hvaSlagsPensjon":"Polsk Uførepensjon","fraHvilketLand":"Polen","bruttobeloepPrAar":"4000 PLN"}},"arbeidsforhold":[{"arbeidsgiver":"Potetskreller AS","ansettelsesforhold":"stillingType.midlertidig","stillingsprosent":"100%","forventerEndretInntekt":{"svar":"Ja","beskrivelse":"Forventer økt inntekt"}}]},"opplysningerOmBarn":{"gravidEllerNyligFoedt":"Ja","barn":[{"fornavn":"Treg","etternavn":"Snøfreser","foedselsnummer":"24014021406","statsborgerskap":"Norsk","bosattUtland":{"svar":"Nei"},"relasjon":"barnRelasjon.fellesbarnMedAvdoede","harBarnetVerge":{"svar":"Nei"}},{"fornavn":"Smålig","etternavn":"Sykkel","foedselsnummer":"19016424830","statsborgerskap":"Norsk","bosattUtland":{"svar":"Nei"},"relasjon":"barnRelasjon.fellesbarnMedAvdoede","harBarnetVerge":{"svar":"Nei"}}]}}""".trimIndent()
    private val soeknadKladdMock = mapper.readTree(soeknadKladdJson)

    private val ferdigSoeknadJson = """{"mottattDato":"2021-09-10T13:18:54.191229","oppsummering":[{"tittel":"Om deg","path":"om-deg","elementer":[{"tittel":"Personalia","innhold":[{"key":"felles.navn","spoersmaal":"Navn","svar":"STOR SNERK"},{"key":"felles.adresse","spoersmaal":"Bostedsadresse","svar":"Fyrstikkal\u00e9en 1, 0758 Oslo"},{"key":"felles.foedselsnummer","spoersmaal":"F\u00f8dselsnummer","svar":"11057523044"},{"key":"felles.sivilstatus","spoersmaal":"Sivilstatus","svar":"Ugift"},{"key":"felles.statsborgerskap","spoersmaal":"Statsborgerskap","svar":"Norsk"}]},{"tittel":"Opplysninger om s\u00f8keren","innhold":[{"key":"omDeg.bostedsadresseBekreftet","spoersmaal":"Bor du p\u00e5 denne adressen?","svar":"Nei"},{"key":"omDeg.kontaktinfo.telefonnummer","spoersmaal":"Telefonnummer","svar":"999 88 777"},{"key":"omDeg.kontaktinfo.epost","spoersmaal":"E-post","svar":"test@nav.no"},{"key":"omDeg.oppholderSegINorge","spoersmaal":"Oppholder du deg for tiden i Norge?","svar":"Ja"},{"key":"omDeg.alternativAdresse","spoersmaal":"Oppgi n\u00e5v\u00e6rende bostedsadresse","svar":"Testveien 123, 0594 Oslo"},{"key":"omDeg.utbetalingsInformasjon.kontonummer","spoersmaal":"Oppgi norsk kontonummer for utbetaling","svar":"1351.35.13513"}]}]},{"tittel":"Om deg og avd\u00f8de","path":"om-deg-og-avdoed","elementer":[{"innhold":[{"key":"omDegOgAvdoed.avdoed.fornavn","spoersmaal":"Fornavn","svar":"D\u00f8d"},{"key":"omDegOgAvdoed.avdoed.etternavn","spoersmaal":"Etternavn","svar":"Testperson"},{"key":"omDegOgAvdoed.avdoed.datoForDoedsfallet","spoersmaal":"N\u00e5r skjedde d\u00f8dsfallet?","svar":"27.07.2021"},{"key":"omDegOgAvdoed.forholdTilAvdoede.relasjon","spoersmaal":"Relasjonen din til avd\u00f8de da d\u00f8dsfallet skjedde","svar":"Separert"},{"key":"omDegOgAvdoed.forholdTilAvdoede.datoForInngaattPartnerskap","spoersmaal":"Vi giftet oss","svar":"27.07.2001"},{"key":"omDegOgAvdoed.nySivilstatus.sivilstatus","spoersmaal":"Sivilstanden din i dag","svar":"Enslig"}]}]},{"tittel":"Om avd\u00f8de","path":"om-den-avdoede","elementer":[{"innhold":[{"key":"omDenAvdoede.foedselsnummer","spoersmaal":"F\u00f8dselsnummer","svar":"24014021406"},{"key":"omDenAvdoede.statsborgerskap","spoersmaal":"Statsborgerskap","svar":"Norsk"},{"key":"omDenAvdoede.selvstendigNaeringsdrivende.svar","spoersmaal":"Var han eller hun selvstendig n\u00e6ringsdrivende?","svar":"Ja"},{"key":"omDenAvdoede.selvstendigNaeringsdrivende.beskrivelse","spoersmaal":"Oppgi n\u00e6ringsinntekt fra kalender\u00e5ret f\u00f8r d\u00f8dsfallet (valgfri)","svar":"150 000"},{"key":"omDenAvdoede.haddePensjonsgivendeInntekt.svar","spoersmaal":"Hadde han eller hun n\u00e6ringsinntekt n\u00e5r d\u00f8dsfallet skjedde?","svar":"Nei"},{"key":"omDenAvdoede.doedsfallAarsak","spoersmaal":"Skyldes d\u00f8dsfallet yrkesskade\/yrkessykdom?","svar":"Ja"},{"key":"omDenAvdoede.harAvtjentMilitaerTjeneste.svar","spoersmaal":"Har han eller hun gjennomf\u00f8rt milit\u00e6r eller sivil f\u00f8rstegangstjeneste som varte minst 30 dager?","svar":"Ja"},{"key":"omDenAvdoede.harAvtjentMilitaerTjeneste.beskrivelse","spoersmaal":"Hvilke(-t) \u00e5r? (valgfri)","svar":"1984"}]},{"tittel":"Opphold i Kongo","innhold":[{"key":"omDenAvdoede.boddEllerJobbetUtland.oppholdUtland.land","spoersmaal":"Land","svar":"Kongo"},{"key":"omDenAvdoede.boddEllerJobbetUtland.oppholdUtland.beskrivelse","spoersmaal":"Bodd og\/eller arbeidet?","svar":"Bodd, Arbeidet"},{"key":"omDenAvdoede.boddEllerJobbetUtland.oppholdUtland.fraDato","spoersmaal":"Fra dato (valgfri)","svar":"11.08.2002"},{"key":"omDenAvdoede.boddEllerJobbetUtland.oppholdUtland.tilDato","spoersmaal":"Til dato (valgfri)","svar":"11.08.2003"},{"key":"omDenAvdoede.boddEllerJobbetUtland.oppholdUtland.medlemFolketrygd","spoersmaal":"Var han eller hun medlem av folketrygden under oppholdet?","svar":"Ja"},{"key":"omDenAvdoede.boddEllerJobbetUtland.oppholdUtland.mottokPensjon.beskrivelse","spoersmaal":"Oppgi eventuell pensjon han eller hun mottok fra dette landet (valgfri)","svar":"150.000"}]}]},{"tittel":"Situasjonen din","path":"din-situasjon","elementer":[{"innhold":[{"key":"dinSituasjon.jobbStatus","spoersmaal":"Hva er situasjonen din n\u00e5?","svar":"Jeg er arbeidstaker"},{"key":"dinSituasjon.utdanning.hoyesteFullfoerteUtdanning","spoersmaal":"Hvilken utdanning har du?","svar":"Universitet eller h\u00f8yskole mer enn 4 \u00e5r"},{"key":"dinSituasjon.andreYtelser.kravOmAnnenStonad.svar","spoersmaal":"Har du s\u00f8kt om andre ytelser fra NAV som du ikke har f\u00e5tt svar p\u00e5?","svar":"Ja"},{"key":"dinSituasjon.andreYtelser.kravOmAnnenStonad.beskrivelse","spoersmaal":"Hva har du s\u00f8kt om?","svar":"Barnepensjon"},{"key":"dinSituasjon.andreYtelser.annenPensjon.svar","spoersmaal":"F\u00e5r du eller har du s\u00f8kt om avtalefestet pensjon (AFP) eller annen pensjon fra andre enn NAV?","svar":"Ja"},{"key":"dinSituasjon.andreYtelser.annenPensjon.beskrivelse","spoersmaal":"Hvilken pensjonsordning?","svar":"Skandia"},{"key":"dinSituasjon.andreYtelser.mottarPensjonUtland.svar","spoersmaal":"Mottar du pensjon fra et annet land enn Norge?","svar":"Ja"},{"key":"dinSituasjon.andreYtelser.mottarPensjonUtland.hvaSlagsPensjon","spoersmaal":"Hva slags pensjon?","svar":"Polsk Uf\u00f8repensjon"},{"key":"dinSituasjon.andreYtelser.mottarPensjonUtland.fraHvilketLand","spoersmaal":"Fra hvilket land?","svar":"Polen"},{"key":"dinSituasjon.andreYtelser.mottarPensjonUtland.bruttobeloepPrAar","spoersmaal":"\u00c5rlig bel\u00f8p f\u00f8r skatt i landets valuta","svar":"4000 PLN"}]},{"tittel":"Potetskreller AS","innhold":[{"key":"dinSituasjon.arbeidsforhold.ansettelsesforhold","spoersmaal":"Type ansettelse","svar":"Midlertidig ansatt"},{"key":"dinSituasjon.arbeidsforhold.stillingsprosent","spoersmaal":"Hvor mye jobber du?","svar":"100%"},{"key":"dinSituasjon.arbeidsforhold.forventerEndretInntekt.svar","spoersmaal":"Regner du med at inntekten din endrer seg de neste 12 m\u00e5nedene?","svar":"Ja"},{"key":"dinSituasjon.arbeidsforhold.forventerEndretInntekt.beskrivelse","spoersmaal":"Hva er grunnen til endringene?","svar":"Forventer \u00f8kt inntekt"}]}]},{"tittel":"Om barn","path":"om-barn","elementer":[{"innhold":[{"key":"omBarn.gravidEllerNyligFoedt","spoersmaal":"Venter du barn eller har du barn som enda ikke er registrert i folkeregisteret?","svar":"Ja"}]},{"tittel":"Treg Sn\u00f8freser","innhold":[{"key":"omBarn.fornavn","spoersmaal":"Fornavn","svar":"Treg"},{"key":"omBarn.etternavn","spoersmaal":"Etternavn","svar":"Sn\u00f8freser"},{"key":"omBarn.foedselsnummer","spoersmaal":"Barnets f\u00f8dselsnummer \/ d-nummer","svar":"24014021406"},{"key":"omBarn.statsborgerskap","spoersmaal":"Statsborgerskap","svar":"Norsk"},{"key":"omBarn.bosattUtland.svar","spoersmaal":"Bor barnet i et annet land enn Norge?","svar":"Nei"},{"key":"omBarn.relasjon","spoersmaal":"Hvem er foreldre til barnet?","svar":"Jeg og avd\u00f8de"},{"key":"omBarn.harBarnetVerge.svar","spoersmaal":"Er det oppnevnt en verge for barnet?","svar":"Nei"}]},{"tittel":"Sm\u00e5lig Sykkel","innhold":[{"key":"omBarn.fornavn","spoersmaal":"Fornavn","svar":"Sm\u00e5lig"},{"key":"omBarn.etternavn","spoersmaal":"Etternavn","svar":"Sykkel"},{"key":"omBarn.foedselsnummer","spoersmaal":"Barnets f\u00f8dselsnummer \/ d-nummer","svar":"19016424830"},{"key":"omBarn.statsborgerskap","spoersmaal":"Statsborgerskap","svar":"Norsk"},{"key":"omBarn.bosattUtland.svar","spoersmaal":"Bor barnet i et annet land enn Norge?","svar":"Nei"},{"key":"omBarn.relasjon","spoersmaal":"Hvem er foreldre til barnet?","svar":"Jeg og avd\u00f8de"},{"key":"omBarn.harBarnetVerge.svar","spoersmaal":"Er det oppnevnt en verge for barnet?","svar":"Nei"}]}]}]}"""
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
        val soeknadMedFeilJson = """{"mottattDato":"2021-09-10T13:18:54.191229","oppsummering":[{"tittel":"Om deg","path":"om-deg","elementer":[{"tittel":"Personalia","innhold":[{"key":"felles.navn","spoersmaal":"Navn","svar":"STOR SNERK"},{"key":"felles.adresse","spoersmaal":"Bostedsadresse","svar":"Fyrstikkal\u00e9en 1, 0758 Oslo"},{"key":"felles.foedselsnummer","spoersmaal":"F\u00f8dselsnummer","svar":"11057523044"},{"key":"felles.sivilstatus","spoersmaal":"Sivilstatus","svar":"Ugift"},{"key":"felles.statsborgerskap","spoersmaal":"Statsborgerskap","svar":"Norsk"}]},{"tittel":"Opplysninger om s\u00f8keren","innhold":[{"key":"omDeg.bostedsadresseBekreftet","spoersmaal":"Bor du p\u00e5 denne adressen?","svar":"Nei"},{"key":"omDeg.kontaktinfo.telefonnummer","spoersmaal":"Telefonnummer","svar":"999 88 777"},{"key":"omDeg.kontaktinfo.epost","spoersmaal":"E-post","svar":"test@nav.no"},{"key":"omDeg.oppholderSegINorge","spoersmaal":"Oppholder du deg for tiden i Norge?","svar":"Ja"},{"key":"omDeg.alternativAdresse","spoersmaal":"Oppgi n\u00e5v\u00e6rende bostedsadresse","svar":"Testveien 123, 0594 Oslo"},{"key":"omDeg.utbetalingsInformasjon.kontonummer","spoersmaal":"Oppgi norsk kontonummer for utbetaling","svar":"1351.35.13513"}]}]},{"tittel":"Om deg og avd\u00f8de","path":"om-deg-og-avdoed","elementer":[{"innhold":[{"key":"omDegOgAvdoed.avdoed.fornavn","spoersmaal":"Fornavn","svar":"D\u00f8d"},{"key":"omDegOgAvdoed.avdoed.etternavn","spoersmaal":"Etternavn","svar":"Testperson"},{"key":"omDegOgAvdoed.avdoed.datoForDoedsfallet","spoersmaal":"N\u00e5r skjedde d\u00f8dsfallet?","svar":"27.07.2021"},{"key":"omDegOgAvdoed.forholdTilAvdoede.relasjon","spoersmaal":"Relasjonen din til avd\u00f8de da d\u00f8dsfallet skjedde","svar":"Separert"},{"key":"omDegOgAvdoed.forholdTilAvdoede.datoForInngaattPartnerskap","spoersmaal":"Vi giftet oss","svar":"27.07.2001"},{"key":"omDegOgAvdoed.nySivilstatus.sivilstatus","spoersmaal":"Sivilstanden din i dag","svar":"Enslig"}]}]},{"tittel":"Om avd\u00f8de","path":"om-den-avdoede","elementer":[{"innhold":[{"key":"omDenAvdoede.foedselsnummer","spoersmaal":"F\u00f8dselsnummer","svar":"24014021406"},{"key":"omDenAvdoede.statsborgerskap","spoersmaal":"Statsborgerskap","svar":"Norsk"},{"key":"omDenAvdoede.selvstendigNaeringsdrivende.svar","spoersmaal":"Var han eller hun selvstendig n\u00e6ringsdrivende?","svar":"Ja"},{"key":"omDenAvdoede.selvstendigNaeringsdrivende.beskrivelse","spoersmaal":"Oppgi n\u00e6ringsinntekt fra kalender\u00e5ret f\u00f8r d\u00f8dsfallet (valgfri)","svar":"150 000"},{"key":"omDenAvdoede.haddePensjonsgivendeInntekt.svar","spoersmaal":"Hadde han eller hun n\u00e6ringsinntekt n\u00e5r d\u00f8dsfallet skjedde?","svar":"Nei"},{"key":"omDenAvdoede.doedsfallAarsak","spoersmaal":"Skyldes d\u00f8dsfallet yrkesskade\/yrkessykdom?","svar":"Ja"},{"key":"omDenAvdoede.harAvtjentMilitaerTjeneste.svar","spoersmaal":"Har han eller hun gjennomf\u00f8rt milit\u00e6r eller sivil f\u00f8rstegangstjeneste som varte minst 30 dager?","svar":"Ja"},{"key":"omDenAvdoede.harAvtjentMilitaerTjeneste.beskrivelse","spoersmaal":"Hvilke(-t) \u00e5r? (valgfri)","svar":"1984"}]},{"tittel":"Opphold i Kongo","innhold":[{"key":"omDenAvdoede.boddEllerJobbetUtland.oppholdUtland.land","spoersmaal":"Land","svar":"Kongo"},{"key":"omDenAvdoede.boddEllerJobbetUtland.oppholdUtland.beskrivelse","spoersmaal":"Bodd og\/eller arbeidet?","svar":"Bodd, Arbeidet"},{"key":"omDenAvdoede.boddEllerJobbetUtland.oppholdUtland.fraDato","spoersmaal":"Fra dato (valgfri)","svar":"11.08.2002"},{"key":"omDenAvdoede.boddEllerJobbetUtland.oppholdUtland.tilDato","spoersmaal":"Til dato (valgfri)","svar":"11.08.2003"},{"key":"omDenAvdoede.boddEllerJobbetUtland.oppholdUtland.medlemFolketrygd","spoersmaal":"Var han eller hun medlem av folketrygden under oppholdet?","svar":"Ja"},{"key":"omDenAvdoede.boddEllerJobbetUtland.oppholdUtland.mottokPensjon.beskrivelse","spoersmaal":"Oppgi eventuell pensjon han eller hun mottok fra dette landet (valgfri)","svar":"150.000"}]}]},{"tittel":"Situasjonen din","path":"din-situasjon","elementer":[{"innhold":[{"key":"dinSituasjon.jobbStatus","spoersmaal":"Hva er situasjonen din n\u00e5?","svar":"Jeg er arbeidstaker"},{"key":"dinSituasjon.utdanning.hoyesteFullfoerteUtdanning","spoersmaal":"Hvilken utdanning har du?","svar":"Universitet eller h\u00f8yskole mer enn 4 \u00e5r"},{"key":"dinSituasjon.andreYtelser.kravOmAnnenStonad.svar","spoersmaal":"Har du s\u00f8kt om andre ytelser fra NAV som du ikke har f\u00e5tt svar p\u00e5?","svar":"Ja"},{"key":"dinSituasjon.andreYtelser.kravOmAnnenStonad.beskrivelse","spoersmaal":"Hva har du s\u00f8kt om?","svar":"Barnepensjon"},{"key":"dinSituasjon.andreYtelser.annenPensjon.svar","spoersmaal":"F\u00e5r du eller har du s\u00f8kt om avtalefestet pensjon (AFP) eller annen pensjon fra andre enn NAV?","svar":"Ja"},{"key":"dinSituasjon.andreYtelser.annenPensjon.beskrivelse","spoersmaal":"Hvilken pensjonsordning?","svar":"Skandia"},{"key":"dinSituasjon.andreYtelser.mottarPensjonUtland.svar","spoersmaal":"Mottar du pensjon fra et annet land enn Norge?","svar":"Ja"},{"key":"dinSituasjon.andreYtelser.mottarPensjonUtland.hvaSlagsPensjon","spoersmaal":"Hva slags pensjon?","svar":"Polsk Uf\u00f8repensjon"},{"key":"dinSituasjon.andreYtelser.mottarPensjonUtland.fraHvilketLand","spoersmaal":"Fra hvilket land?","svar":"Polen"},{"key":"dinSituasjon.andreYtelser.mottarPensjonUtland.bruttobeloepPrAar","spoersmaal":"\u00c5rlig bel\u00f8p f\u00f8r skatt i landets valuta","svar":"4000 PLN"}]},{"tittel":"Potetskreller AS","innhold":[{"key":"dinSituasjon.arbeidsforhold.ansettelsesforhold","spoersmaal":"Type ansettelse","svar":"Midlertidig ansatt"},{"key":"dinSituasjon.arbeidsforhold.stillingsprosent","spoersmaal":"Hvor mye jobber du?","svar":"100%"},{"key":"dinSituasjon.arbeidsforhold.forventerEndretInntekt.svar","spoersmaal":"Regner du med at inntekten din endrer seg de neste 12 m\u00e5nedene?","svar":"Ja"},{"key":"dinSituasjon.arbeidsforhold.forventerEndretInntekt.beskrivelse","spoersmaal":"Hva er grunnen til endringene?","svar":"Forventer \u00f8kt inntekt"}]}]},{"tittel":"Om barn","path":"om-barn","elementer":[{"innhold":[{"key":"omBarn.gravidEllerNyligFoedt","spoersmaal":"Venter du barn eller har du barn som enda ikke er registrert i folkeregisteret?","svar":"Ja"}]},{"tittel":"Treg Sn\u00f8freser","innhold":[{"key":"omBarn.fornavn","spoersmaal":"Fornavn","svar":"Treg"},{"key":"omBarn.etternavn","spoersmaal":"Etternavn","svar":"Sn\u00f8freser"},{"key":"omBarn.foedselsnummer","spoersmaal":"Barnets f\u00f8dselsnummer \/ d-nummer","svar":"24014021406"},{"key":"omBarn.statsborgerskap","spoersmaal":"Statsborgerskap","svar":"Norsk"},{"key":"omBarn.bosattUtland.svar","spoersmaal":"Bor barnet i et annet land enn Norge?","svar":"Nei"},{"key":"omBarn.relasjon","spoersmaal":"Hvem er foreldre til barnet?","svar":"Jeg og avd\u00f8de"},{"key":"omBarn.harBarnetVerge.svar","spoersmaal":"Er det oppnevnt en verge for barnet?","svar":"Nei"}]},{"tittel":"Sm\u00e5lig Sykkel","innhold":[{"key":"omBarn.fornavn","spoersmaal":"Fornavn","svar":"Sm\u00e5lig"},{"key":"omBarn.etternavn","spoersmaal":"Etternavn","svar":"Sykkel"},{"key":"omBarn.foedselsnummer","spoersmaal":"Barnets f\u00f8dselsnummer \/ d-nummer","svar":"19016424830"},{"key":"omBarn.statsborgerskap","spoersmaal":"Statsborgerskap","svar":"Norsk"},{"key":"omBarn.bosattUtland.svar","spoersmaal":"Bor barnet i et annet land enn Norge?","svar":"Nei"},{"key":"omBarn.relasjon","spoersmaal":"Hvem er foreldre til barnet?","svar":"Jeg og avd\u00f8de"},{"key":"omBarn.harBarnetVerge.svar","spoersmaal":"Er det oppnevnt en verge for barnet?","svar":"Nei"}]}]}]}"""
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
