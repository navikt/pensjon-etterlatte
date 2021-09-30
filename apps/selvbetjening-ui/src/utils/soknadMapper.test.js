import i18n from "../i18n";
import SoeknadMapper from "./SoeknadMapper";
import mockJson from "../assets/dummy-soeknad.json";
import { renderHook } from "@testing-library/react-hooks";
import { useTranslation } from "react-i18next";

const oppsummeringAvDummy = [
    {
        tittel: "Om deg",
        path: "om-deg",
        elementer: [
            {
                tittel: "Personalia",
                innhold: [
                    {
                        spoersmaal: "Navn",
                        svar: "STOR SNERK",
                    },
                    {
                        spoersmaal: "Bostedsadresse",
                        svar: "Fyrstikkaléen 1 1, 0758 Oslo",
                    },
                    {
                        spoersmaal: "Fødselsnummer",
                        svar: "11057523044",
                    },
                    {
                        spoersmaal: "Sivilstatus",
                        svar: "Ugift",
                    },
                    {
                        spoersmaal: "Statsborgerskap",
                        svar: "Norsk",
                    },
                ],
            },
            {
                tittel: "Opplysninger om søkeren",
                innhold: [
                    {
                        spoersmaal: "Bor du på denne adressen?",
                        svar: "Nei",
                    },
                    {
                        spoersmaal: "Telefonnummer",
                        svar: "999 88 777",
                    },
                    {
                        spoersmaal: "E-post",
                        svar: "test@nav.no",
                    },
                    {
                        spoersmaal: "Oppholder du deg for tiden i Norge?",
                        svar: "Ja",
                    },
                    {
                        spoersmaal: "Oppgi nåværende bostedsadresse",
                        svar: "Testveien 123, 0594 Oslo",
                    },
                    {
                        spoersmaal: "Oppgi norsk kontonummer for utbetaling",
                        svar: "1351.35.13513",
                    },
                ],
            },
        ],
    },
    {
        tittel: "Om deg og avdøde",
        path: "om-deg-og-avdoed",
        elementer: [
            {
                innhold: [
                    {
                        spoersmaal: "Fornavn",
                        svar: "Død",
                    },
                    {
                        spoersmaal: "Etternavn",
                        svar: "Testperson",
                    },
                    {
                        spoersmaal: "Når skjedde dødsfallet?",
                        svar: "27.07.2021",
                    },
                    {
                        spoersmaal: "Skyldes dødsfallet yrkesskade/yrkessykdom?",
                        svar: "Ja",
                    },
                    {
                        spoersmaal: "Relasjonen din til avdøde da dødsfallet skjedde",
                        svar: "Separert",
                    },
                    {
                        spoersmaal: "Vi giftet oss",
                        svar: "27.07.2001",
                    },
                    {
                        spoersmaal: "Sivilstanden din i dag",
                        svar: "Enslig",
                    },
                ],
            },
        ],
    },
    {
        tittel: "Om avdøde",
        path: "om-den-avdoede",
        elementer: [
            {
                innhold: [
                    {
                        spoersmaal: "Fødselsnummer",
                        svar: "24014021406",
                    },
                    {
                        spoersmaal: "Statsborgerskap",
                        svar: "Norsk",
                    },
                    {
                        spoersmaal: "Var han eller hun selvstendig næringsdrivende?",
                        svar: "Ja",
                    },
                    {
                        spoersmaal: "Oppgi næringsinntekt fra kalenderåret før dødsfallet (Valgfri)",
                        svar: "150 000",
                    },
                    {
                        spoersmaal: "Hadde han eller hun næringsinntekt når dødsfallet skjedde?",
                        svar: "Nei",
                    },
                    {
                        spoersmaal:
                            "Gjennomførte han eller hun militær eller sivil førstegangstjeneste som varte minst 30 dager?",
                        svar: "Ja",
                    },
                    {
                        spoersmaal: "Hvilke(-t) år? (Valgfri)",
                        svar: "1984",
                    },
                ],
            },
            {
                tittel: "Opphold i Kongo",
                innhold: [
                    {
                        spoersmaal: "Land",
                        svar: "Kongo",
                    },
                    {
                        spoersmaal: "Bodd og/eller arbeidet?",
                        svar: "Bodd, Arbeidet",
                    },
                    {
                        spoersmaal: "Fra dato (Valgfri)",
                        svar: "11.08.2002",
                    },
                    {
                        spoersmaal: "Til dato (Valgfri)",
                        svar: "11.08.2003",
                    },
                    {
                        spoersmaal: "Var han eller hun medlem av folketrygden under oppholdet?",
                        svar: "Ja",
                    },
                    {
                        spoersmaal: "Oppgi eventuell pensjon han eller hun mottok fra dette landet",
                        svar: "150.000",
                    },
                ],
            },
        ],
    },
    {
        tittel: "Situasjonen din",
        path: "din-situasjon",
        elementer: [
            {
                innhold: [
                    {
                        spoersmaal: "Hva er situasjonen din nå?",
                        svar: "Jeg er arbeidstaker",
                    },
                    {
                        spoersmaal: "Har du søkt om andre ytelser fra NAV som du ikke har fått svar på?",
                        svar: "Ja",
                    },
                    {
                        spoersmaal: "Hva har du søkt om?",
                        svar: "Barnepensjon",
                    },
                    {
                        spoersmaal:
                            "Får du eller har du søkt om avtalefestet pensjon (AFP) eller annen pensjon fra andre enn NAV?",
                        svar: "Ja",
                    },
                    {
                        spoersmaal: "Hvilken pensjonsordning?",
                        svar: "Skandia",
                    },
                    {
                        spoersmaal: "Mottar du pensjon fra et annet land enn Norge?",
                        svar: "Ja",
                    },
                    {
                        spoersmaal: "Hva slags pensjon?",
                        svar: "Polsk Uførepensjon",
                    },
                    {
                        spoersmaal: "Fra hvilket land?",
                        svar: "Polen",
                    },
                    {
                        spoersmaal: "Årlig beløp før skatt i landets valuta",
                        svar: "4000 PLN",
                    },
                ],
            },
            {
                tittel: "Potetskreller AS",
                innhold: [
                    {
                        spoersmaal: "Type ansettelse",
                        svar: "Midlertidig ansatt",
                    },
                    {
                        spoersmaal: "Hvor mye jobber du?",
                        svar: "100%",
                    },
                    {
                        spoersmaal: "Regner du med at inntekten din endrer seg de neste 12 månedene?",
                        svar: "Ja",
                    },
                    {
                        spoersmaal: "Hva er grunnen til endringene?",
                        svar: "150 000",
                    },
                ],
            },
        ],
    },
    {
        tittel: "Om barn",
        path: "om-barn",
        elementer: [
            {
                innhold: [
                    {
                        spoersmaal: "Venter du barn eller har du barn som enda ikke er registrert i folkeregisteret?",
                        svar: "Ja",
                    },
                ],
            },
            {
                tittel: "Treg Snøfreser",
                innhold: [
                    {
                        spoersmaal: "Fornavn",
                        svar: "Treg",
                    },
                    {
                        spoersmaal: "Etternavn",
                        svar: "Snøfreser",
                    },
                    {
                        spoersmaal: "Barnets fødselsnummer / d-nummer",
                        svar: "24014021406",
                    },
                    {
                        spoersmaal: "Statsborgerskap",
                        svar: "Norsk",
                    },
                    {
                        spoersmaal: "Bor barnet i et annet land enn Norge?",
                        svar: "Nei",
                    },
                    {
                        spoersmaal: "Hvem er foreldre til barnet?",
                        svar: "Jeg og avdøde",
                    },
                    {
                        spoersmaal: "Er det oppnevnt en verge for barnet?",
                        svar: "Nei",
                    },
                ],
            },
            {
                tittel: "Smålig Sykkel",
                innhold: [
                    {
                        spoersmaal: "Fornavn",
                        svar: "Smålig",
                    },
                    {
                        spoersmaal: "Etternavn",
                        svar: "Sykkel",
                    },
                    {
                        spoersmaal: "Barnets fødselsnummer / d-nummer",
                        svar: "24014021406",
                    },
                    {
                        spoersmaal: "Statsborgerskap",
                        svar: "Norsk",
                    },
                    {
                        spoersmaal: "Bor barnet i et annet land enn Norge?",
                        svar: "Nei",
                    },
                    {
                        spoersmaal: "Hvem er foreldre til barnet?",
                        svar: "Jeg og avdøde",
                    },
                    {
                        spoersmaal: "Er det oppnevnt en verge for barnet?",
                        svar: "Nei",
                    },
                ],
            },
        ],
    },
];

describe("Soknadmapper test", () => {
    xit("Tester at oppsummering mappes riktig", () => {
        const { result } = renderHook(() => useTranslation());
        i18n.language = "no"; // viktig for at dato i oppsummering skal formateres på norsk

        const mapper = new SoeknadMapper(result.current.t, result.current.i18n);
        const mockSoknad = mockJson;
        const mockBruker = {
            fornavn: "STOR",
            etternavn: "SNERK",
            foedselsnummer: "11057523044",
            foedselsaar: "1814",
            foedselsdato: "1814-05-17T00:00:00Z",
            alder: 3,
            adresse: "Fyrstikkaléen 1",
            husnummer: "1",
            husbokstav: "",
            postnummer: "0758",
            poststed: "Oslo",
            kanSoeke: true,
            statsborgerskap: "Norsk",
            sivilstatus: "Ugift",
        };
        const oppsummering = mapper.lagOppsummering(mockSoknad, mockBruker);
        expect(oppsummering).toStrictEqual(oppsummeringAvDummy);
    });
});
