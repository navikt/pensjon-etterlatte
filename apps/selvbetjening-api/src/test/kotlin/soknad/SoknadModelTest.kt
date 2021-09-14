package soknad

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.jacksonTypeRef
import no.nav.etterlatte.soknad.Soeknad
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import java.time.LocalDateTime
import java.time.ZoneId

internal class SoknadModelTest {

    private val json = """{"oppsummering":[{"tittel":"Om deg","path":"om-deg","elementer":[{"tittel":"Personalia","innhold":[{"spoersmaal":"Navn","svar":"STOR SNERK"},{"spoersmaal":"Bostedsadresse","svar":"Fyrstikkaléen 1 1, 0758 Oslo"},{"spoersmaal":"Fødselsnummer","svar":"11057523044"},{"spoersmaal":"Sivilstatus","svar":"Ugift"},{"spoersmaal":"Statsborgerskap","svar":"Norsk"}]},{"tittel":"Opplysninger om søkeren","innhold":[{"spoersmaal":"Bor du på denne adressen?","svar":"Nei"},{"spoersmaal":"Telefonnummer","svar":"101 01 010"},{"spoersmaal":"E-post","svar":"asdf@nav.no"},{"spoersmaal":"Oppholder du deg for tiden i Norge?","svar":"Nei"},{"spoersmaal":"Oppgi nåværende bostedsadresse","svar":"Shanghai"},{"spoersmaal":"Ønsker du å motta utbetalingen på norsk eller utenlandsk bankkonto?","svar":"Norsk"},{"spoersmaal":"Oppgi norsk kontonummer for utbetaling","svar":"5351.35.13513"},{"spoersmaal":"Oppgi land","svar":"Polen"},{"spoersmaal":"Er du medlem i folketrygden under opphold i et annet land enn Norge?","svar":"Ja"}]}]},{"tittel":"Om deg og avdøde","path":"om-deg-og-avdoed","elementer":[{"innhold":[{"spoersmaal":"Fornavn","svar":"Liten"},{"spoersmaal":"Etternavn","svar":"Testbruker"},{"spoersmaal":"Når skjedde dødsfallet?","svar":"31.08.2021"},{"spoersmaal":"Skyldes dødsfallet yrkesskade/yrkessykdom?","svar":"Nei"},{"spoersmaal":"Relasjonen din til avdøde da dødsfallet skjedde","svar":"Gift eller registrert partner"},{"spoersmaal":"Når ble dere gift?","svar":"17.09.2021"},{"spoersmaal":"Har eller hadde dere felles barn?","svar":"Nei"},{"spoersmaal":"Hadde du omsorg for avdødes barn på dødstidspunktet?","svar":"Ja"},{"spoersmaal":"Sivilstanden din i dag","svar":"Samboer"},{"spoersmaal":"Navn","svar":"Sam Samboersen"},{"spoersmaal":"Fødselsnummer","svar":"24014021406"},{"spoersmaal":"Har samboer inntekt?","svar":"Ja"},{"spoersmaal":"omDegOgAvdoed.nySivilstatus.samboerskap.samboer.harInntekt.inntektstype","svar":"Kapitalinntekt"},{"spoersmaal":"omDegOgAvdoed.nySivilstatus.samboerskap.samboer.harInntekt.inntektstype","svar":"Arbeidsinntekt"},{"spoersmaal":"omDegOgAvdoed.nySivilstatus.samboerskap.samboer.harInntekt.inntektstype","svar":"Pensjon"},{"spoersmaal":"Samlet bruttoinntekt per år","svar":"kr. 360.000,-"},{"spoersmaal":"Vi ble samboere","svar":"31.08.2021"},{"spoersmaal":"Har/hadde dere barn sammen eller var dere tidligere gift?","svar":"Nei"}]}]},{"tittel":"Om den avdøde","path":"om-den-avdoede","elementer":[{"innhold":[{"spoersmaal":"Fødselsnummer","svar":"24014021406"},{"spoersmaal":"Statsborgerskap","svar":"Norsk"},{"spoersmaal":"Var han eller hun selvstendig næringsdrivende?","svar":"Ja"},{"spoersmaal":"Oppgi næringsinntekt fra kalenderåret før dødsfallet","svar":"185 000"},{"spoersmaal":"Hadde han eller hun næringsinntekt når dødsfallet skjedde?","svar":"Ja"},{"spoersmaal":"Gjennomførte han eller hun militær eller sivil førstegangstjeneste som varte minst 30 dager?","svar":"Ja"},{"spoersmaal":"Hvilke(-t) år? (Valgfritt)","svar":"1984"}]},{"tittel":"Opphold i Polen","innhold":[{"spoersmaal":"Land","svar":"Polen"},{"spoersmaal":"Bodd og/eller arbeidet?","svar":"Bodd, Arbeidet"},{"spoersmaal":"Fra dato","svar":"31.08.2021"},{"spoersmaal":"Til dato","svar":"24.09.2021"},{"spoersmaal":"Var han eller hun medlem av folketrygden under oppholdet?","svar":"Ja"},{"spoersmaal":"Oppgi eventuell pensjon han eller hun mottok fra dette landet (per år i kr.)","svar":"150 000"}]},{"tittel":"Opphold i Turkmenistan","innhold":[{"spoersmaal":"Land","svar":"Turkmenistan"},{"spoersmaal":"Bodd og/eller arbeidet?","svar":"Bodd"},{"spoersmaal":"Fra dato","svar":"16.02.2022"},{"spoersmaal":"Til dato","svar":"24.09.2021"},{"spoersmaal":"Var han eller hun medlem av folketrygden under oppholdet?","svar":"Ja"}]}]},{"tittel":"Situasjonen din","path":"din-situasjon","elementer":[{"innhold":[{"spoersmaal":"Hva er situasjonen din nå?","svar":"Jeg er arbeidstaker"},{"spoersmaal":"Hva er situasjonen din nå?","svar":"Jeg er selvstendig næringsdrivende"},{"spoersmaal":"Hva er situasjonen din nå?","svar":"Jeg tar utdanning"},{"spoersmaal":"Hva er situasjonen din nå?","svar":"Annet"},{"spoersmaal":"Hva er din høyeste fullførte utdanning?","svar":"Universitet eller høyskole mer enn 4 år"},{"spoersmaal":"Navnet på utdanningen","svar":"Ingeniør"},{"spoersmaal":"Fra dato","svar":"31.08.2021"},{"spoersmaal":"Til dato","svar":"09.09.2021"},{"spoersmaal":"Har du søkt om andre ytelser fra NAV som du ikke har fått svar på?","svar":"Ja"},{"spoersmaal":"Hva har du søkt om?","svar":"AFP"},{"spoersmaal":"Mottar du pensjon fra et annet land enn Norge?","svar":"Ja"},{"spoersmaal":"Hva slags pensjon?","svar":"Polsk uførepensjon"},{"spoersmaal":"Fra hvilket land?","svar":"Polen"},{"spoersmaal":"Bruttobeløp pr. år i landets valuta","svar":"503030"},{"spoersmaal":"Hva heter firmaet?","svar":"Kult firma"},{"spoersmaal":"Når startet du?","svar":"07.09.2021"},{"spoersmaal":"Type ansettelse","svar":"Sesongansatt"},{"spoersmaal":"Hvor mye jobber du?","svar":"1505050"},{"spoersmaal":"Regner du med at inntekten din endrer seg de neste 12 månedene?","svar":"Ja"},{"spoersmaal":"Forventer du endring i arbeidsforholdet/inntekten som følge av dødsfallet?","svar":"155555"},{"spoersmaal":"Hva heter firmaet?","svar":"Mitt enkeltmannsforetak"},{"spoersmaal":"Når startet du?","svar":"10.09.2021"},{"spoersmaal":"Organisasjonsnummer","svar":"9999999999999999999999999"},{"spoersmaal":"Regner du med at inntekten din endrer seg de neste 12 månedene?","svar":"Ja"},{"spoersmaal":"Hva er grunnen til endringene?","svar":"0"},{"spoersmaal":"Annet","svar":"Litt informasjon om situasjonen"}]}]},{"tittel":"Om barn","path":"om-barn","elementer":[{"innhold":[{"spoersmaal":"Venter du barn eller har du barn som enda ikke er registrert i folkeregisteret?","svar":"Ja"}]},{"tittel":"BLÅØYD SAKS","innhold":[{"spoersmaal":"Fornavn","svar":"BLÅØYD"},{"spoersmaal":"Etternavn","svar":"SAKS"},{"spoersmaal":"Barnets fødselsnummer / d-nummer","svar":"05111850870"},{"spoersmaal":"Statsborgerskap","svar":"Norsk"},{"spoersmaal":"Bor barnet i et annet land enn Norge?","svar":"Ja"},{"spoersmaal":"Land","svar":"Sverige"},{"spoersmaal":"Adresse i utlandet","svar":"Småland"},{"spoersmaal":"Hvem er foreldre til barnet?","svar":"Fellesbarn med avdøde"},{"spoersmaal":"Søk om barnepensjon","svar":"Ja"},{"spoersmaal":"Er det oppnevnt en verge for barnet?","svar":"Ja"},{"spoersmaal":"Navn på verge","svar":"VERG VERGERNES"},{"spoersmaal":"Fødselsnummer til verge","svar":"27121779531"}]},{"tittel":"LITEN DORULL","innhold":[{"spoersmaal":"Fornavn","svar":"LITEN"},{"spoersmaal":"Etternavn","svar":"DORULL"},{"spoersmaal":"Barnets fødselsnummer / d-nummer","svar":"18021780363"},{"spoersmaal":"Statsborgerskap","svar":"Svensk"},{"spoersmaal":"Bor barnet i et annet land enn Norge?","svar":"Nei"},{"spoersmaal":"Hvem er foreldre til barnet?","svar":"Avdødes særkullsbarn"},{"spoersmaal":"Har du daglig omsorg for dette barnet?","svar":"Nei"}]}]}]}"""

    @Test
    fun serde() {
        val soeknad = jacksonObjectMapper().readValue(json, jacksonTypeRef<Soeknad>())

        val now = LocalDateTime.now(ZoneId.of("Europe/Oslo"))
        val mottattDato = LocalDateTime.parse(soeknad.mottattDato)
        assertEquals(now.year, mottattDato.year)
        assertEquals(now.month, mottattDato.month)
        assertEquals(now.dayOfMonth, mottattDato.dayOfMonth)
        assertEquals(now.hour, mottattDato.hour)
        assertEquals(now.minute, mottattDato.minute)

        val oppsummering = soeknad.oppsummering
        assertEquals(5, oppsummering.size)

        val omDeg = oppsummering[0]
        assertEquals("Om deg", omDeg.tittel)
        assertEquals(2, omDeg.elementer.size)

        val omDegOgAvdoede = oppsummering[1]
        assertEquals("Om deg og avdøde", omDegOgAvdoede.tittel)
        assertEquals(1, omDegOgAvdoede.elementer.size)

        val omDenAvdoede = oppsummering[2]
        assertEquals("Om den avdøde", omDenAvdoede.tittel)
        assertEquals(3, omDenAvdoede.elementer.size)

        val dinSituasjon = oppsummering[3]
        assertEquals("Situasjonen din", dinSituasjon.tittel)
        assertEquals(1, dinSituasjon.elementer.size)

        val omBarn = oppsummering[4]
        assertEquals("Om barn", omBarn.tittel)
        assertEquals(3, omBarn.elementer.size)

        val serialized = jacksonObjectMapper().writeValueAsString(soeknad)
        assertTrue(soeknad.mottattDato in serialized, "Skal inneholde mottattdato")
    }
}
