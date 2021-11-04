const { ObjectTreeReader } = require("./ObjectTreeReader");

class SoeknadMapper {
    constructor(t, i18n) {
        this.t = t;
        this.otr = new ObjectTreeReader(t, i18n);
    }

    lagOppsummering(soeknad, bruker) {
        return [
            this.mapOmDeg(soeknad.omDeg, bruker),
            this.mapOmDegOgAvdoed(soeknad.omDegOgAvdoed),
            this.mapOmDenAvdoede(soeknad.omDenAvdoede),
            this.mapDinSituasjon(soeknad.dinSituasjon),
            this.mapOpplysningerOmBarn(soeknad.opplysningerOmBarn),
        ];
    }

    mapOmDeg(omDeg, bruker) {
        const personalia = {
            navn: `${bruker.fornavn} ${bruker.etternavn}`,
            adresse: `${bruker.adresse} ${bruker.husnummer}${bruker.husbokstav || ""}, ${bruker.postnummer} ${
                bruker.poststed
            }`,
            foedselsnummer: bruker.foedselsnummer,
            sivilstatus: bruker.sivilstatus,
            statsborgerskap: bruker.statsborgerskap,
        };

        return {
            tittel: this.t("omDeg.tittel"),
            path: "om-deg",
            elementer: [
                {
                    tittel: "Personalia",
                    innhold: this.otr.traverse(personalia, "felles"),
                },
                {
                    tittel: "Opplysninger om søkeren",
                    innhold: this.otr.traverse(
                        {
                            ...omDeg,
                            nySivilstatus: {
                                ...omDeg.nySivilstatus,
                                sivilstatus: this.t(omDeg.nySivilstatus?.sivilstatus || ""),
                            },
                            erValidert: undefined,
                        },
                        "omDeg"
                    ),
                },
            ],
        };
    }

    mapOmDegOgAvdoed(omDegOgAvdoed) {
        return {
            tittel: this.t("omDegOgAvdoed.tittel"),
            path: "om-deg-og-avdoed",
            elementer: [
                {
                    innhold: this.otr.traverse({
                        ...omDegOgAvdoed,
                        erValidert: undefined
                    }, "omDegOgAvdoed"),
                },
            ],
        };
    }

    mapOmDenAvdoede(omDenAvdoede) {
        const oppholdUtland =
            omDenAvdoede.boddEllerJobbetUtland?.oppholdUtland?.map((oppholdUtland) => {
                const opphold = {
                    land: oppholdUtland.land,
                    beskrivelse: oppholdUtland.beskrivelse,
                    fraDato: oppholdUtland.fraDato,
                    tilDato: oppholdUtland.tilDato,
                    medlemFolketrygd: oppholdUtland.medlemFolketrygd,
                    mottokPensjon: oppholdUtland.mottokPensjon,
                };

                return {
                    tittel: `Opphold i ${opphold.land}`,
                    innhold: this.otr.traverse(
                        {
                            ...opphold,
                            beskrivelse: opphold.beskrivelse?.map((val) => this.t(val)).join(", "),
                        },
                        "omDenAvdoede.boddEllerJobbetUtland.oppholdUtland"
                    ),
                };
            }) || [];

        return {
            tittel: this.t("omDenAvdoede.tittel"),
            path: "om-den-avdoede",
            elementer: [
                {
                    innhold: this.otr.traverse(
                        {
                            ...omDenAvdoede,
                            boddEllerJobbetUtland: { svar: omDenAvdoede.boddEllerJobbetUtland?.svar },
                            erValidert: undefined,
                        },
                        "omDenAvdoede"
                    ),
                },
                ...oppholdUtland,
            ],
        };
    }

    mapDinSituasjon(dinSituasjon) {
        const arbeidsforhold =
            dinSituasjon.arbeidsforhold?.map((arbeid) => {
                return {
                    tittel: `${arbeid.arbeidsgiver}`,
                    innhold: this.otr.traverse(
                        {
                            ...arbeid,
                            arbeidsgiver: undefined,
                        },
                        "dinSituasjon.arbeidsforhold"
                    ),
                };
            }) || [];

        const selvstendigNaeringsdrivende =
            dinSituasjon.selvstendig?.map((arbeid) => {
                return {
                    tittel: `${arbeid.beskrivelse}`,
                    innhold: this.otr.traverse(
                        {
                            ...arbeid,
                            beskrivelse: undefined,
                        },
                        "dinSituasjon.selvstendig"
                    ),
                };
            }) || [];

        return {
            tittel: this.t("dinSituasjon.tittel"),
            path: "din-situasjon",
            elementer: [
                {
                    innhold: this.otr.traverse(
                        {
                            ...dinSituasjon,
                            arbeidsforhold: undefined,
                            selvstendig: undefined,
                            erValidert: undefined,
                        },
                        "dinSituasjon"
                    ),
                },
                ...arbeidsforhold,
                ...selvstendigNaeringsdrivende,
            ],
        };
    }

    mapOpplysningerOmBarn(opplysningerOmBarn) {
        const barn =
            opplysningerOmBarn.barn?.map((barn) => {
                return {
                    tittel: `${barn.fornavn} ${barn.etternavn}`,
                    innhold: this.otr.traverse(barn, "omBarn"),
                };
            }) || [];

        return {
            tittel: this.t("omBarn.tittel"),
            path: "om-barn",
            elementer: [
                {
                    innhold: this.otr.traverse({
                        ...opplysningerOmBarn,
                        barn: undefined,
                        erValidert: undefined
                    }, "omBarn"),
                },
                ...barn,
            ],
        };
    }
}

module.exports = {
    SoeknadMapper
}