package soknad

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.jacksonTypeRef
import no.nav.etterlatte.soknad.Soeknad
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import java.time.LocalDateTime
import java.time.ZoneId

internal class SoknadModelTest {

    private val json = """{
  "oppsummering": [
      {
          "tittel": "Om deg",
          "path": "om-deg",
          "elementer": [
              {
                  "tittel": "Personalia",
                  "innhold": [
                      {
                          "key": "felles.navn",
                          "spoersmaal": "Navn",
                          "svar": "STOR SNERK"
                      },
                      {
                          "key": "felles.adresse",
                          "spoersmaal": "Bostedsadresse",
                          "svar": "Fyrstikkaléen 1, 0758 Oslo"
                      },
                      {
                          "key": "felles.foedselsnummer",
                          "spoersmaal": "Fødselsnummer",
                          "svar": "11057523044"
                      },
                      {
                          "key": "felles.sivilstatus",
                          "spoersmaal": "Sivilstatus",
                          "svar": "Ugift"
                      },
                      {
                          "key": "felles.statsborgerskap",
                          "spoersmaal": "Statsborgerskap",
                          "svar": "Norsk"
                      }
                  ]
              },
              {
                  "tittel": "Opplysninger om søkeren",
                  "innhold": [
                      {
                          "key": "omDeg.bostedsadresseBekreftet",
                          "spoersmaal": "Bor du på denne adressen?",
                          "svar": "Nei"
                      },
                      {
                          "key": "omDeg.kontaktinfo.telefonnummer",
                          "spoersmaal": "Telefonnummer",
                          "svar": "999 88 777"
                      },
                      {
                          "key": "omDeg.kontaktinfo.epost",
                          "spoersmaal": "E-post",
                          "svar": "test@nav.no"
                      },
                      {
                          "key": "omDeg.oppholderSegINorge",
                          "spoersmaal": "Oppholder du deg for tiden i Norge?",
                          "svar": "Ja"
                      },
                      {
                          "key": "omDeg.alternativAdresse",
                          "spoersmaal": "Oppgi nåværende bostedsadresse",
                          "svar": "Testveien 123, 0594 Oslo"
                      },
                      {
                          "key": "omDeg.utbetalingsInformasjon.kontonummer",
                          "spoersmaal": "Oppgi norsk kontonummer for utbetaling",
                          "svar": "1351.35.13513"
                      }
                  ]
              }
          ]
      },
      {
          "tittel": "Om deg og avdøde",
          "path": "om-deg-og-avdoed",
          "elementer": [
              {
                  "innhold": [
                      {
                          "key": "omDegOgAvdoed.avdoed.fornavn",
                          "spoersmaal": "Fornavn",
                          "svar": "Død"
                      },
                      {
                          "key": "omDegOgAvdoed.avdoed.etternavn",
                          "spoersmaal": "Etternavn",
                          "svar": "Testperson"
                      },
                      {
                          "key": "omDegOgAvdoed.avdoed.datoForDoedsfallet",
                          "spoersmaal": "Når skjedde dødsfallet?",
                          "svar": "27.07.2021"
                      },
                      {
                          "key": "omDegOgAvdoed.forholdTilAvdoede.relasjon",
                          "spoersmaal": "Relasjonen din til avdøde da dødsfallet skjedde",
                          "svar": "Separert"
                      },
                      {
                          "key": "omDegOgAvdoed.forholdTilAvdoede.datoForInngaattPartnerskap",
                          "spoersmaal": "Vi giftet oss",
                          "svar": "27.07.2001"
                      },
                      {
                          "key": "omDegOgAvdoed.nySivilstatus.sivilstatus",
                          "spoersmaal": "Sivilstanden din i dag",
                          "svar": "Enslig"
                      }
                  ]
              }
          ]
      },
      {
          "tittel": "Om avdøde",
          "path": "om-den-avdoede",
          "elementer": [
              {
                  "innhold": [
                      {
                          "key": "omDenAvdoede.foedselsnummer",
                          "spoersmaal": "Fødselsnummer",
                          "svar": "24014021406"
                      },
                      {
                          "key": "omDenAvdoede.statsborgerskap",
                          "spoersmaal": "Statsborgerskap",
                          "svar": "Norsk"
                      },
                      {
                          "key": "omDenAvdoede.selvstendigNaeringsdrivende.svar",
                          "spoersmaal": "Var han eller hun selvstendig næringsdrivende?",
                          "svar": "Ja"
                      },
                      {
                          "key": "omDenAvdoede.selvstendigNaeringsdrivende.beskrivelse",
                          "spoersmaal": "Oppgi næringsinntekt fra kalenderåret før dødsfallet (valgfri)",
                          "svar": "150 000"
                      },
                      {
                          "key": "omDenAvdoede.haddePensjonsgivendeInntekt.svar",
                          "spoersmaal": "Hadde han eller hun næringsinntekt når dødsfallet skjedde?",
                          "svar": "Nei"
                      },
                      {
                          "key": "omDenAvdoede.doedsfallAarsak",
                          "spoersmaal": "Skyldes dødsfallet yrkesskade/yrkessykdom?",
                          "svar": "Ja"
                      },
                      {
                          "key": "omDenAvdoede.harAvtjentMilitaerTjeneste.svar",
                          "spoersmaal": "Har han eller hun gjennomført militær eller sivil førstegangstjeneste som varte minst 30 dager?",
                          "svar": "Ja"
                      },
                      {
                          "key": "omDenAvdoede.harAvtjentMilitaerTjeneste.beskrivelse",
                          "spoersmaal": "Hvilke(-t) år? (valgfri)",
                          "svar": "1984"
                      }
                  ]
              },
              {
                  "tittel": "Opphold i Kongo",
                  "innhold": [
                      {
                          "key": "omDenAvdoede.boddEllerJobbetUtland.oppholdUtland.land",
                          "spoersmaal": "Land",
                          "svar": "Kongo"
                      },
                      {
                          "key": "omDenAvdoede.boddEllerJobbetUtland.oppholdUtland.beskrivelse",
                          "spoersmaal": "Bodd og/eller arbeidet?",
                          "svar": "Bodd, Arbeidet"
                      },
                      {
                          "key": "omDenAvdoede.boddEllerJobbetUtland.oppholdUtland.fraDato",
                          "spoersmaal": "Fra dato (valgfri)",
                          "svar": "11.08.2002"
                      },
                      {
                          "key": "omDenAvdoede.boddEllerJobbetUtland.oppholdUtland.tilDato",
                          "spoersmaal": "Til dato (valgfri)",
                          "svar": "11.08.2003"
                      },
                      {
                          "key": "omDenAvdoede.boddEllerJobbetUtland.oppholdUtland.medlemFolketrygd",
                          "spoersmaal": "Var han eller hun medlem av folketrygden under oppholdet?",
                          "svar": "Ja"
                      },
                      {
                          "key": "omDenAvdoede.boddEllerJobbetUtland.oppholdUtland.mottokPensjon.beskrivelse",
                          "spoersmaal": "Oppgi eventuell pensjon han eller hun mottok fra dette landet (valgfri)",
                          "svar": "150.000"
                      }
                  ]
              }
          ]
      },
      {
          "tittel": "Situasjonen din",
          "path": "din-situasjon",
          "elementer": [
              {
                  "innhold": [
                      {
                          "key": "dinSituasjon.jobbStatus",
                          "spoersmaal": "Hva er situasjonen din nå?",
                          "svar": "Jeg er arbeidstaker"
                      },
                      {
                          "key": "dinSituasjon.utdanning.hoyesteFullfoerteUtdanning",
                          "spoersmaal": "Hvilken utdanning har du?",
                          "svar": "Universitet eller høyskole mer enn 4 år"
                      },
                      {
                          "key": "dinSituasjon.andreYtelser.kravOmAnnenStonad.svar",
                          "spoersmaal": "Har du søkt om andre ytelser fra NAV som du ikke har fått svar på?",
                          "svar": "Ja"
                      },
                      {
                          "key": "dinSituasjon.andreYtelser.kravOmAnnenStonad.beskrivelse",
                          "spoersmaal": "Hva har du søkt om?",
                          "svar": "Barnepensjon"
                      },
                      {
                          "key": "dinSituasjon.andreYtelser.annenPensjon.svar",
                          "spoersmaal": "Får du eller har du søkt om avtalefestet pensjon (AFP) eller annen pensjon fra andre enn NAV?",
                          "svar": "Ja"
                      },
                      {
                          "key": "dinSituasjon.andreYtelser.annenPensjon.beskrivelse",
                          "spoersmaal": "Hvilken pensjonsordning?",
                          "svar": "Skandia"
                      },
                      {
                          "key": "dinSituasjon.andreYtelser.mottarPensjonUtland.svar",
                          "spoersmaal": "Mottar du pensjon fra et annet land enn Norge?",
                          "svar": "Ja"
                      },
                      {
                          "key": "dinSituasjon.andreYtelser.mottarPensjonUtland.hvaSlagsPensjon",
                          "spoersmaal": "Hva slags pensjon?",
                          "svar": "Polsk Uførepensjon"
                      },
                      {
                          "key": "dinSituasjon.andreYtelser.mottarPensjonUtland.fraHvilketLand",
                          "spoersmaal": "Fra hvilket land?",
                          "svar": "Polen"
                      },
                      {
                          "key": "dinSituasjon.andreYtelser.mottarPensjonUtland.bruttobeloepPrAar",
                          "spoersmaal": "Årlig beløp før skatt i landets valuta",
                          "svar": "4000 PLN"
                      }
                  ]
              },
              {
                  "tittel": "Potetskreller AS",
                  "innhold": [
                      {
                          "key": "dinSituasjon.arbeidsforhold.ansettelsesforhold",
                          "spoersmaal": "Type ansettelse",
                          "svar": "Midlertidig ansatt"
                      },
                      {
                          "key": "dinSituasjon.arbeidsforhold.stillingsprosent",
                          "spoersmaal": "Hvor mye jobber du?",
                          "svar": "100%"
                      },
                      {
                          "key": "dinSituasjon.arbeidsforhold.forventerEndretInntekt.svar",
                          "spoersmaal": "Regner du med at inntekten din endrer seg de neste 12 månedene?",
                          "svar": "Ja"
                      },
                      {
                          "key": "dinSituasjon.arbeidsforhold.forventerEndretInntekt.beskrivelse",
                          "spoersmaal": "Hva er grunnen til endringene?",
                          "svar": "Forventer økt inntekt"
                      }
                  ]
              }
          ]
      },
      {
          "tittel": "Om barn",
          "path": "om-barn",
          "elementer": [
              {
                  "innhold": [
                      {
                          "key": "omBarn.gravidEllerNyligFoedt",
                          "spoersmaal": "Venter du barn eller har du barn som enda ikke er registrert i folkeregisteret?",
                          "svar": "Ja"
                      }
                  ]
              },
              {
                  "tittel": "Treg Snøfreser",
                  "innhold": [
                      {
                          "key": "omBarn.fornavn",
                          "spoersmaal": "Fornavn",
                          "svar": "Treg"
                      },
                      {
                          "key": "omBarn.etternavn",
                          "spoersmaal": "Etternavn",
                          "svar": "Snøfreser"
                      },
                      {
                          "key": "omBarn.foedselsnummer",
                          "spoersmaal": "Barnets fødselsnummer / d-nummer",
                          "svar": "24014021406"
                      },
                      {
                          "key": "omBarn.statsborgerskap",
                          "spoersmaal": "Statsborgerskap",
                          "svar": "Norsk"
                      },
                      {
                          "key": "omBarn.bosattUtland.svar",
                          "spoersmaal": "Bor barnet i et annet land enn Norge?",
                          "svar": "Nei"
                      },
                      {
                          "key": "omBarn.relasjon",
                          "spoersmaal": "Hvem er foreldre til barnet?",
                          "svar": "Jeg og avdøde"
                      },
                      {
                          "key": "omBarn.harBarnetVerge.svar",
                          "spoersmaal": "Er det oppnevnt en verge for barnet?",
                          "svar": "Nei"
                      }
                  ]
              },
              {
                  "tittel": "Smålig Sykkel",
                  "innhold": [
                      {
                          "key": "omBarn.fornavn",
                          "spoersmaal": "Fornavn",
                          "svar": "Smålig"
                      },
                      {
                          "key": "omBarn.etternavn",
                          "spoersmaal": "Etternavn",
                          "svar": "Sykkel"
                      },
                      {
                          "key": "omBarn.foedselsnummer",
                          "spoersmaal": "Barnets fødselsnummer / d-nummer",
                          "svar": "19016424830"
                      },
                      {
                          "key": "omBarn.statsborgerskap",
                          "spoersmaal": "Statsborgerskap",
                          "svar": "Norsk"
                      },
                      {
                          "key": "omBarn.bosattUtland.svar",
                          "spoersmaal": "Bor barnet i et annet land enn Norge?",
                          "svar": "Nei"
                      },
                      {
                          "key": "omBarn.relasjon",
                          "spoersmaal": "Hvem er foreldre til barnet?",
                          "svar": "Jeg og avdøde"
                      },
                      {
                          "key": "omBarn.harBarnetVerge.svar",
                          "spoersmaal": "Er det oppnevnt en verge for barnet?",
                          "svar": "Nei"
                      }
                  ]
              }
          ]
      }
  ]
}"""

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
        assertEquals("Om avdøde", omDenAvdoede.tittel)
        assertEquals(2, omDenAvdoede.elementer.size)

        val dinSituasjon = oppsummering[3]
        assertEquals("Situasjonen din", dinSituasjon.tittel)
        assertEquals(2, dinSituasjon.elementer.size)

        val omBarn = oppsummering[4]
        assertEquals("Om barn", omBarn.tittel)
        assertEquals(3, omBarn.elementer.size)

        val serialized = jacksonObjectMapper().writeValueAsString(soeknad)
        assertTrue(soeknad.mottattDato in serialized, "Skal inneholde mottattdato")
    }
}
