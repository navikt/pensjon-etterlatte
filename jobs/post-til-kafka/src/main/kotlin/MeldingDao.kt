package no.nav.etterlatte.batch

fun payload(fnr: String) = """
{
  "imageTag": "9155b05ce5f99ade8d7b6096a0d6a20dc0cb1110",
  "innsender": {
    "fornavn": "VAKKER",
    "etternavn": "PENN",
    "foedselsnummer": $fnr,
    "type": "INNSENDER"
  },
  "soeker": {
    "fornavn": "VAKKER",
    "etternavn": "PENN",
    "foedselsnummer": $fnr,
    "statsborgerskap": "Norge",
    "sivilstatus": "UOPPGITT",
    "adresse": {
      "svar": "Sannergata",
      "spoersmaal": "Bostedsadresse"
    },
    "bostedsAdresse": {
      "svar": "NEI",
      "spoersmaal": "Bor du på denne adressen?",
      "opplysning": {
        "svar": "Testveien 123, 0594 Oslo",
        "spoersmaal": "Oppgi nåværende bostedsadresse"
      }
    },
    "kontaktinfo": {
      "epost": {
        "svar": "test@nav.no",
        "spoersmaal": "E-post"
      },
      "telefonnummer": {
        "svar": "999 88 777",
        "spoersmaal": "Telefonnummer"
      }
    },
    "flyktning": null,
    "oppholdUtland": {
      "svar": "JA",
      "spoersmaal": "Oppholder du deg for tiden i Norge?",
      "opplysning": null
    },
    "nySivilstatus": {
      "svar": "INGEN",
      "spoersmaal": "Sivilstanden din i dag",
      "opplysning": null
    },
    "arbeidOgUtdanning": {
      "dinSituasjon": {
        "svar": [
          "ARBEIDSTAKER"
        ],
        "spoersmaal": "Hva er situasjonen din nå?"
      },
      "arbeidsforhold": {
        "svar": [
          {
            "arbeidsgiver": {
              "svar": "Potetskreller AS",
              "spoersmaal": "Hva heter arbeidsgiver?"
            },
            "ansettelsesforhold": {
              "svar": "MIDLERTIDIG",
              "spoersmaal": "Type ansettelse"
            },
            "stillingsprosent": {
              "svar": "100%",
              "spoersmaal": "Hvor mye jobber du?"
            },
            "endretInntekt": {
              "svar": "JA",
              "spoersmaal": "Regner du med at inntekten din endrer seg de neste 12 månedene?",
              "opplysning": {
                "svar": "Forventer økt inntekt",
                "spoersmaal": "Hva er grunnen til endringene?"
              }
            }
          }
        ],
        "spoersmaal": "Om arbeidsgiver"
      },
      "selvstendig": null,
      "utdanning": null,
      "annet": null
    },
    "fullfoertUtdanning": {
      "svar": "UNIVERSITET_OVER_4_AAR",
      "spoersmaal": "Hva er din høyeste fullførte utdanning?",
      "opplysning": null
    },
    "andreYtelser": {
      "kravOmAnnenStonad": {
        "svar": "JA",
        "spoersmaal": "Har du søkt om andre ytelser som du ikke har fått svar på?",
        "opplysning": {
          "svar": "DAGPENGER",
          "spoersmaal": "Hva har du søkt om?"
        }
      },
      "annenPensjon": {
        "svar": "JA",
        "spoersmaal": "Får du eller har du søkt om avtalefestet pensjon (AFP) eller annen pensjon fra andre enn NAV?",
        "opplysning": {
          "svar": "Skandia",
          "spoersmaal": "Hvilken pensjonsordning?"
        }
      },
      "pensjonUtland": {
        "svar": "JA",
        "spoersmaal": "Mottar du pensjon fra et annet land enn Norge?",
        "opplysning": {
          "pensjonsType": {
            "svar": "Polsk Uførepensjon",
            "spoersmaal": "Hva slags pensjon?"
          },
          "land": {
            "svar": "Polen",
            "spoersmaal": "Fra hvilket land?"
          },
          "bruttobeloepPrAar": {
            "svar": "4000 PLN",
            "spoersmaal": "Årlig beløp før skatt i landets valuta"
          }
        }
      }
    },
    "uregistrertEllerVenterBarn": {
      "svar": "JA",
      "spoersmaal": "Venter du barn eller har du barn som enda ikke er registrert i folkeregisteret?"
    },
    "forholdTilAvdoede": {
      "relasjon": {
        "svar": "SEPARERT",
        "spoersmaal": "Relasjonen din til avdøde da dødsfallet skjedde"
      },
      "datoForInngaattPartnerskap": {
        "svar": "2001-07-27",
        "spoersmaal": "Vi giftet oss"
      },
      "datoForInngaattSamboerskap": null,
      "datoForSkilsmisse": null,
      "datoForSamlivsbrudd": null,
      "fellesBarn": null,
      "samboereMedFellesBarnFoerGiftemaal": null,
      "tidligereGift": null,
      "omsorgForBarn": null,
      "mottokBidrag": null,
      "mottokEktefelleBidrag": null
    },
    "type": "GJENLEVENDE"
  },
  "harSamtykket": {
    "svar": true,
    "spoersmaal": "Jeg, , bekrefter at jeg vil gi riktige og fullstendige opplysninger."
  },
  "utbetalingsInformasjon": {
    "svar": "NORSK",
    "spoersmaal": "Ønsker du å motta utbetalingen på norsk eller utenlandsk bankkonto?",
    "opplysning": {
      "kontonummer": {
        "svar": "1351.35.13513",
        "spoersmaal": "Oppgi norsk kontonummer for utbetaling"
      },
      "utenlandskBankNavn": null,
      "utenlandskBankAdresse": null,
      "iban": null,
      "swift": null,
      "skattetrekk": null
    }
  },
  "avdoed": {
    "fornavn": "Død",
    "etternavn": "Testperson",
    "foedselsnummer": "24014021406",
    "datoForDoedsfallet": {
      "svar": "2021-07-27",
      "spoersmaal": "Når skjedde dødsfallet?"
    },
    "statsborgerskap": {
      "svar": "Norsk",
      "spoersmaal": "Statsborgerskap"
    },
    "utenlandsopphold": {
      "svar": "JA",
      "spoersmaal": "Bodde eller arbeidet han eller hun i et annet land enn Norge etter fylte 16 år?",
      "opplysning": [
        {
          "land": {
            "svar": "Kongo",
            "spoersmaal": "Land"
          },
          "fraDato": {
            "svar": "2002-08-11",
            "spoersmaal": "Fra dato (valgfri)"
          },
          "tilDato": {
            "svar": "2003-08-11",
            "spoersmaal": "Til dato (valgfri)"
          },
          "oppholdsType": {
            "svar": [
              "BODD",
              "ARBEIDET"
            ],
            "spoersmaal": "Bodd og/eller arbeidet?"
          },
          "medlemFolketrygd": {
            "svar": "JA",
            "spoersmaal": "Var han eller hun medlem av folketrygden under oppholdet?"
          },
          "pensjonsutbetaling": {
            "svar": "150.000",
            "spoersmaal": "Oppgi eventuell pensjon han eller hun mottok fra dette landet (valgfri)"
          }
        }
      ]
    },
    "doedsaarsakSkyldesYrkesskadeEllerYrkessykdom": {
      "svar": "JA",
      "spoersmaal": "Skyldes dødsfallet yrkesskade eller yrkessykdom?"
    },
    "naeringsInntekt": {
      "svar": "JA",
      "spoersmaal": "Var han eller hun selvstendig næringsdrivende?",
      "opplysning": {
        "naeringsinntektPrAarFoerDoedsfall": {
          "svar": "150 000",
          "spoersmaal": "Oppgi næringsinntekt fra kalenderåret før dødsfallet (valgfri)"
        },
        "naeringsinntektVedDoedsfall": {
          "svar": "NEI",
          "spoersmaal": "Hadde han eller hun næringsinntekt når dødsfallet skjedde?"
        }
      }
    },
    "militaertjeneste": {
      "svar": "JA",
      "spoersmaal": "Har han eller hun gjennomført militær eller sivil førstegangstjeneste som varte minst 30 dager?",
      "opplysning": {
        "svar": "1984",
        "spoersmaal": "Hvilke(-t) år? (valgfri)"
      }
    },
    "type": "AVDOED"
  },
  "barn": [
    {
      "fornavn": "Treg",
      "etternavn": "Snøfreser",
      "foedselsnummer": "24014021406",
      "statsborgerskap": {
        "svar": "Norsk",
        "spoersmaal": "Statsborgerskap"
      },
      "utenlandsAdresse": {
        "svar": "NEI",
        "spoersmaal": "Bor barnet i et annet land enn Norge?",
        "opplysning": null
      },
      "foreldre": [
        {
          "fornavn": "VAKKER",
          "etternavn": "PENN",
          "foedselsnummer": "09038520129",
          "type": "FORELDER"
        },
        {
          "fornavn": "Død",
          "etternavn": "Testperson",
          "foedselsnummer": "24014021406",
          "type": "FORELDER"
        }
      ],
      "verge": {
        "svar": "NEI",
        "spoersmaal": "Er det oppnevnt en verge for barnet?",
        "opplysning": null
      },
      "dagligOmsorg": null,
      "type": "BARN"
    },
    {
      "fornavn": "Lunken",
      "etternavn": "Floskel",
      "foedselsnummer": "07010776133",
      "statsborgerskap": {
        "svar": "Norsk",
        "spoersmaal": "Statsborgerskap"
      },
      "utenlandsAdresse": {
        "svar": "NEI",
        "spoersmaal": "Bor barnet i et annet land enn Norge?",
        "opplysning": null
      },
      "foreldre": [
        {
          "fornavn": "VAKKER",
          "etternavn": "PENN",
          "foedselsnummer": "09038520129",
          "type": "FORELDER"
        },
        {
          "fornavn": "Død",
          "etternavn": "Testperson",
          "foedselsnummer": "24014021406",
          "type": "FORELDER"
        }
      ],
      "verge": {
        "svar": "NEI",
        "spoersmaal": "Er det oppnevnt en verge for barnet?",
        "opplysning": null
      },
      "dagligOmsorg": null,
      "type": "BARN"
    }
  ],
  "versjon": "1",
  "type": "GJENLEVENDEPENSJON",
  "mottattDato": "2022-01-13T12:11:49.969417399",
  "template": "gjenlevendepensjon_v1"
}
""".trimIndent()
