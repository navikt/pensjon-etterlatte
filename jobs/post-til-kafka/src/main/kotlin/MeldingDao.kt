package no.nav.etterlatte.batch

fun payload(fnr: String) = """
  {
    "imageTag": "03b86f8b30cd4eff3286ebe64dc8155b07e9c6f0",
    "soeknadsType": "Gjenlevendepensjon",
    "mottattDato": "2021-11-09T08:05:37.305448931",
    "oppsummering": [
      {
        "tittel": "Om deg",
        "elementer": [
          {
            "tittel": "Personalia",
            "innhold": [
              {
                "key": "felles.navn",
                "spoersmaal": "Navn",
                "svar": "GRØNN KOPP"
              },
              {
                "key": "felles.adresse",
                "spoersmaal": "Bostedsadresse",
                "svar": "Sannergata 6C, 0557 Oslo"
              },
              {
                "key": "felles.foedselsnummer",
                "spoersmaal": "Fødselsnummer",
                "svar": "$fnr"
              },
              {
                "key": "felles.sivilstatus",
                "spoersmaal": "Sivilstatus",
                "svar": "GIFT"
              },
              {
                "key": "felles.statsborgerskap",
                "spoersmaal": "Statsborgerskap",
                "svar": "Norge"
              }
            ]
          },
          {
            "tittel": "Opplysninger om søkeren",
            "innhold": [
              {
                "key": "omDeg.bostedsadresseBekreftet",
                "spoersmaal": "Bor du på denne adressen?",
                "svar": "Ja"
              },
              {
                "key": "omDeg.kontaktinfo.telefonnummer",
                "spoersmaal": "Telefonnummer",
                "svar": "976 46 464"
              },
              {
                "key": "omDeg.kontaktinfo.epost",
                "spoersmaal": "E-post",
                "svar": "asdasd@adasd.asd"
              },
              {
                "key": "omDeg.oppholderSegINorge",
                "spoersmaal": "Oppholder du deg for tiden i Norge?",
                "svar": "Ja"
              },
              {
                "key": "omDeg.utbetalingsInformasjon.kontonummer",
                "spoersmaal": "Oppgi norsk kontonummer for utbetaling",
                "svar": "1231.12.31231"
              }
            ]
          }
        ],
        "path": "om-deg"
      },
      {
        "tittel": "Om deg og avdøde",
        "elementer": [
          {
            "tittel": null,
            "innhold": [
              {
                "key": "omDegOgAvdoed.avdoed.fornavn",
                "spoersmaal": "Fornavn",
                "svar": "Test"
              },
              {
                "key": "omDegOgAvdoed.avdoed.etternavn",
                "spoersmaal": "Etternavn",
                "svar": "testesen"
              },
              {
                "key": "omDegOgAvdoed.avdoed.datoForDoedsfallet",
                "spoersmaal": "Når skjedde dødsfallet?",
                "svar": "11/01/2021"
              },
              {
                "key": "omDegOgAvdoed.forholdTilAvdoede.relasjon",
                "spoersmaal": "Relasjonen din til avdøde da dødsfallet skjedde",
                "svar": "Gift eller registrert partner"
              },
              {
                "key": "omDegOgAvdoed.forholdTilAvdoede.datoForInngaattPartnerskap",
                "spoersmaal": "Vi giftet oss",
                "svar": "10/31/2021"
              },
              {
                "key": "omDegOgAvdoed.forholdTilAvdoede.fellesBarn",
                "spoersmaal": "Har eller hadde dere felles barn?",
                "svar": "Ja"
              },
              {
                "key": "omDegOgAvdoed.nySivilstatus.sivilstatus",
                "spoersmaal": "Sivilstanden din i dag",
                "svar": "Enslig"
              }
            ]
          }
        ],
        "path": "om-deg-og-avdoed"
      },
      {
        "tittel": "Om avdøde",
        "elementer": [
          {
            "tittel": null,
            "innhold": [
              {
                "key": "omDenAvdoede.foedselsnummer",
                "spoersmaal": "Fødselsnummer",
                "svar": "12345678910"
              },
              {
                "key": "omDenAvdoede.statsborgerskap",
                "spoersmaal": "Statsborgerskap",
                "svar": "norge"
              },
              {
                "key": "omDenAvdoede.boddEllerJobbetUtland.svar",
                "spoersmaal": "Bodde eller arbeidet han eller hun i et annet land enn Norge etter fylte 16 år?",
                "svar": "Nei"
              },
              {
                "key": "omDenAvdoede.selvstendigNaeringsdrivende.svar",
                "spoersmaal": "Var han eller hun selvstendig næringsdrivende?",
                "svar": "Nei"
              },
              {
                "key": "omDenAvdoede.doedsfallAarsak",
                "spoersmaal": "Skyldes dødsfallet yrkesskade eller yrkessykdom?",
                "svar": "Nei"
              },
              {
                "key": "omDenAvdoede.harAvtjentMilitaerTjeneste.svar",
                "spoersmaal": "Har han eller hun gjennomført militær eller sivil førstegangstjeneste som varte minst 30 dager?",
                "svar": "Nei"
              }
            ]
          }
        ],
        "path": "om-den-avdoede"
      },
      {
        "tittel": "Situasjonen din",
        "elementer": [
          {
            "tittel": null,
            "innhold": [
              {
                "key": "dinSituasjon.jobbStatus",
                "spoersmaal": "Hva er situasjonen din nå?",
                "svar": "Annet"
              },
              {
                "key": "dinSituasjon.utdanning.hoyesteFullfoerteUtdanning",
                "spoersmaal": "Hva er din høyeste fullførte utdanning?",
                "svar": "Fagbrev"
              },
              {
                "key": "dinSituasjon.andreYtelser.kravOmAnnenStonad.svar",
                "spoersmaal": "Har du søkt om andre ytelser fra NAV som du ikke har fått svar på?",
                "svar": "Nei"
              },
              {
                "key": "dinSituasjon.andreYtelser.annenPensjon.svar",
                "spoersmaal": "Får du eller har du søkt om avtalefestet pensjon (AFP) eller annen pensjon fra andre enn NAV?",
                "svar": "Nei"
              },
              {
                "key": "dinSituasjon.andreYtelser.mottarPensjonUtland.svar",
                "spoersmaal": "Mottar du pensjon fra et annet land enn Norge?",
                "svar": "Nei"
              },
              {
                "key": "dinSituasjon.ingenJobbBeskrivelse",
                "spoersmaal": " Gi en beskrivelse av situasjonen din",
                "svar": "arbeidsledig"
              }
            ]
          }
        ],
        "path": "din-situasjon"
      },
      {
        "tittel": "Om barn",
        "elementer": [
          {
            "tittel": null,
            "innhold": [
              {
                "key": "omBarn.gravidEllerNyligFoedt",
                "spoersmaal": "Venter du barn eller har du barn som enda ikke er registrert i folkeregisteret?",
                "svar": "Ja"
              }
            ]
          }
        ],
        "path": "om-barn"
      }
    ],
    "utfyltSoeknad": {
      "harSamtykket": true,
      "omDeg": {
        "bostedsadresseBekreftet": "Ja",
        "alternativAdresse": null,
        "kontaktinfo": {
          "epost": "asdasd@adasd.asd",
          "telefonnummer": "976 46 464"
        },
        "utbetalingsInformasjon": {
          "kontonummer": "1231.12.31231",
          "bankkontoType": null,
          "utenlandskBankNavn": null,
          "utenlandskBankAdresse": null,
          "iban": null,
          "swift": null
        },
        "flyktning": null,
        "oppholderSegINorge": "Ja",
        "oppholdsland": null,
        "medlemFolketrygdenUtland": null,
        "nySivilstatus": null
      },
      "omDegOgAvdoed": {
        "avdoed": {
          "datoForDoedsfallet": "2021-11-01T23:00:00.000Z",
          "etternavn": "testesen",
          "fornavn": "Test"
        },
        "forholdTilAvdoede": {
          "relasjon": "avdoede.relasjon.gift",
          "datoForInngaattPartnerskap": "2021-10-31T23:00:00.000Z",
          "datoForSkilsmisse": null,
          "datoForInngaattSamboerskap": null,
          "datoForSamlivsbrudd": null,
          "fellesBarn": "Ja",
          "samboereMedFellesBarn": null,
          "omsorgForBarn": null,
          "tidligereGift": null,
          "mottokBidrag": null,
          "mottokEktefelleBidrag": null
        },
        "nySivilstatus": {
          "sivilstatus": "nySivilstatus.ingen",
          "samboerskap": null
        }
      },
      "omDenAvdoede": {
        "foedselsnummer": "12345678910",
        "statsborgerskap": "norge",
        "boddEllerJobbetUtland": {
          "svar": "Nei",
          "oppholdUtland": []
        },
        "selvstendigNaeringsdrivende": {
          "svar": "Nei",
          "beskrivelse": null
        },
        "haddePensjonsgivendeInntekt": null,
        "harAvtjentMilitaerTjeneste": {
          "svar": "Nei",
          "beskrivelse": null
        },
        "doedsfallAarsak": "Nei"
      },
      "dinSituasjon": {
        "jobbStatus": [
          "jobbStatus.ingen"
        ],
        "ingenJobbBeskrivelse": "arbeidsledig",
        "utdanning": {
          "naavaerendeUtdanning": null,
          "hoyesteFullfoerteUtdanning": "utdanning.fagbrev",
          "annenUtdanning": null
        },
        "selvstendig": null,
        "arbeidsforhold": null,
        "andreYtelser": {
          "mottarAndreYtelser": null,
          "kravOmAnnenStonad": {
            "svar": "Nei",
            "beskrivelse": null
          },
          "annenPensjon": {
            "svar": "Nei",
            "beskrivelse": null
          },
          "mottarPensjonUtland": {
            "svar": "Nei",
            "hvaSlagsPensjon": null,
            "fraHvilketLand": null,
            "bruttobeloepPrAar": null,
            "landetsValuta": null
          }
        }
      },
      "opplysningerOmBarn": {
        "barn": [],
        "gravidEllerNyligFoedt": "Ja"
      }
    }
  }      
""".trimIndent()
