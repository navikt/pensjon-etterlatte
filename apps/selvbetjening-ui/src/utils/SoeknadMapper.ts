import ObjectTreeReader, { Gruppe, Element } from "./ObjectTreeReader";
import { ISituasjon } from "../typer/situasjon";
import { IAvdoed, IOmBarn, ISoeker, ISoekerOgAvdoed } from "../typer/person";
import { i18n, TFunction } from "i18next";
import { IBruker } from "../context/bruker/bruker";
import { ISoeknad } from "../context/soknad/soknad";
import { StegPath } from "../context/steg/steg";

export default class SoeknadMapper {
    private otr: ObjectTreeReader;
    private readonly t: TFunction

    constructor(t: TFunction, i18n: i18n) {
        this.t = t;
        this.otr = new ObjectTreeReader(t, i18n);
    }

    lagOppsummering(soeknad: ISoeknad, bruker: IBruker): Gruppe[] {
        console.log("Lager oppsummering")

        return [
            this.mapOmDeg(soeknad.omDeg, bruker),
            this.mapOmDegOgAvdoed(soeknad.omDegOgAvdoed),
            this.mapOmDenAvdoede(soeknad.omDenAvdoede),
            this.mapDinSituasjon(soeknad.dinSituasjon),
            this.mapOpplysningerOmBarn(soeknad.opplysningerOmBarn)
        ];
    }

    private mapOmDeg(omDeg: ISoeker, bruker: IBruker): Gruppe {
        const personalia = {
            navn: `${bruker.fornavn} ${bruker.etternavn}`,
            adresse: `${bruker.adresse} ${bruker.husnummer}${bruker.husbokstav || ""}, ${bruker.postnummer} ${bruker.poststed}`,
            foedselsnummer: bruker.foedselsnummer,
            sivilstatus: bruker.sivilstatus,
            statsborgerskap: bruker.statsborgerskap
        };

        return {
            tittel: this.t("omDeg.tittel"),
            path: StegPath.OmDeg,
            elementer: [
                {
                    tittel: "Personalia",
                    innhold: this.otr.traverse(personalia, "felles")
                },
                {
                    tittel: "Opplysninger om søkeren",
                    innhold: this.otr.traverse<ISoeker>({
                        ...omDeg,
                        nySivilstatus: {
                            ...omDeg.nySivilstatus,
                            sivilstatus: this.t(omDeg.nySivilstatus?.sivilstatus || "")
                        }
                    }, "omDeg")
                }
            ]
        };
    }

    private mapOmDegOgAvdoed(omDegOgAvdoed: ISoekerOgAvdoed): Gruppe {
        return {
            tittel: this.t("omDegOgAvdoed.tittel"),
            path: StegPath.OmDegOgAvdoed,
            elementer: [
                {
                    innhold: this.otr.traverse<ISoekerOgAvdoed>(omDegOgAvdoed, "omDegOgAvdoed")
                }
            ]
        };
    }

    private mapOmDenAvdoede(omDenAvdoede: IAvdoed): Gruppe {
        const oppholdUtland: Element[] = omDenAvdoede.boddEllerJobbetUtland?.oppholdUtland?.map((opphold) => {
            return {
                tittel: `Opphold i ${opphold.land}`,
                innhold: this.otr.traverse({
                    ...opphold,
                    beskrivelse: opphold.beskrivelse?.map(val => this.t(val)).join(", ")
                }, "omDenAvdoede.boddEllerJobbetUtland.oppholdUtland")
            } as Element
        }) || [];

        return {
            tittel: this.t("omDenAvdoede.tittel"),
            path: StegPath.OmAvdoed,
            elementer: [
                {
                    innhold: this.otr.traverse<IAvdoed>({
                        ...omDenAvdoede,
                        boddEllerJobbetUtland: undefined
                    }, "omDenAvdoede")
                },
                ...oppholdUtland
            ]
        };
    }

    private mapDinSituasjon(dinSituasjon: ISituasjon): Gruppe {
        return {
            tittel: this.t("dinSituasjon.tittel"),
            path: StegPath.DinSituasjon,
            elementer: [
                {
                    innhold: this.otr.traverse<ISituasjon>(dinSituasjon, "dinSituasjon")
                }
            ]
        };
    }

    private mapOpplysningerOmBarn(opplysningerOmBarn: IOmBarn): Gruppe {
        const barn: Element[] = opplysningerOmBarn.barn?.map(barn => {
            return {
                tittel: `${barn.fornavn} ${barn.etternavn}`,
                innhold: this.otr.traverse(barn, "omBarn")
            } as Element
        }) || [];

        return {
            tittel: this.t("omBarn.tittel"),
            path: StegPath.OmBarn,
            elementer: [
                {
                    innhold: this.otr.traverse<IOmBarn>({...opplysningerOmBarn, barn: undefined}, "omBarn")
                },
                ...barn
            ]
        };
    }
}
