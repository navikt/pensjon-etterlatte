import { TFunction } from "i18next";
import { ISoeknad } from "../../context/soknad/soknad";
import {
    Avdoed,
    Naeringsinntekt,
    OppholdUtlandType,
    Opplysning,
    PersonType,
    Utenlandsopphold
} from "./InnsendtSoeknad";
import { IValg } from "../../typer/Spoersmaal";
import { valgTilSvar } from "./fellesMapper";
import { konverterOpphold } from "./typeMapper";

export const mapAvdoed = (t: TFunction, soeknad: ISoeknad): Avdoed => {
    let oppholdUtland: Utenlandsopphold[] | undefined;

    if (soeknad.omDenAvdoede.boddEllerJobbetUtland?.svar === IValg.JA) {
        oppholdUtland = soeknad.omDenAvdoede.boddEllerJobbetUtland.oppholdUtland?.map(info => {
            const oppholdsTypeListe: OppholdUtlandType[] = info.beskrivelse
                ?.map(type => konverterOpphold(type)) || [];

            const utenlandsopphold: Utenlandsopphold = {
                land: {
                    spoersmaal: t("omDenAvdoede.boddEllerJobbetUtland.oppholdUtland.land"),
                    svar: info.land!!
                },
                fraDato: {
                    spoersmaal: t("omDenAvdoede.boddEllerJobbetUtland.oppholdUtland.fraDato"),
                    svar: info.fraDato!!
                },
                tilDato: {
                    spoersmaal: t("omDenAvdoede.boddEllerJobbetUtland.oppholdUtland.tilDato"),
                    svar: info.tilDato!!
                },
                oppholdsType: {
                    spoersmaal: t("omDenAvdoede.boddEllerJobbetUtland.oppholdUtland.beskrivelse"),
                    svar: oppholdsTypeListe
                },
                medlemFolketrygd: {
                    spoersmaal: t("omDenAvdoede.boddEllerJobbetUtland.oppholdUtland.medlemFolketrygd"),
                    svar: valgTilSvar(info.medlemFolketrygd!!)
                },
                pensjonsutbetaling: {
                    spoersmaal: t("omDenAvdoede.boddEllerJobbetUtland.oppholdUtland.mottokPensjon.beskrivelse"),
                    svar: `${info.mottokPensjon?.beskrivelse}` // info.mottokPensjon!!
                }
            }

            return utenlandsopphold;
        }) || [];
    }

    let opplysningNaeringsInntekt: Naeringsinntekt | undefined;
    if (soeknad.omDenAvdoede.selvstendigNaeringsdrivende?.svar === IValg.JA) {
        opplysningNaeringsInntekt = {
            naeringsinntektPrAarFoerDoedsfall: {
                spoersmaal: t("omDenAvdoede.selvstendigNaeringsdrivende.beskrivelse"),
                svar: `${soeknad.omDenAvdoede.selvstendigNaeringsdrivende?.beskrivelse}` // TODO: Sjekke denne
            },
            naeringsinntektVedDoedsfall: {
                spoersmaal: t("omDenAvdoede.haddePensjonsgivendeInntekt.svar"),
                svar: valgTilSvar(soeknad.omDenAvdoede.haddePensjonsgivendeInntekt!!.svar!!) // TODO: Fikse type
            }
        }
    }

    let opplysningMilitaertjeneste: Opplysning<String> | undefined;
    if (soeknad.omDenAvdoede.harAvtjentMilitaerTjeneste?.svar === IValg.JA) {
        opplysningMilitaertjeneste = {
            spoersmaal: t("omDenAvdoede.harAvtjentMilitaerTjeneste.beskrivelse"),
            svar: soeknad.omDenAvdoede.harAvtjentMilitaerTjeneste!!.beskrivelse!!
        }
    }

    return {
        type: PersonType.AVDOED,

        fornavn: soeknad.omDegOgAvdoed.avdoed!!.fornavn!!,
        etternavn: soeknad.omDegOgAvdoed.avdoed!!.etternavn!!,
        foedselsnummer: soeknad.omDenAvdoede.foedselsnummer!!,

        datoForDoedsfallet: {
            spoersmaal: t("omDegOgAvdoed.avdoed.datoForDoedsfallet"),
            svar: soeknad.omDegOgAvdoed.avdoed!!.datoForDoedsfallet!!
        },
        statsborgerskap: {
            spoersmaal: t("omDenAvdoede.statsborgerskap"),
            svar: soeknad.omDenAvdoede.statsborgerskap!!
        },
        utenlandsopphold: {
            spoersmaal: t("omDenAvdoede.boddEllerJobbetUtland.svar"),
            svar: valgTilSvar(soeknad.omDenAvdoede.boddEllerJobbetUtland!!.svar!!), // TODO: Fikse type
            opplysning: oppholdUtland
        },
        naeringsInntekt: {
            spoersmaal: t("omDenAvdoede.selvstendigNaeringsdrivende.svar"),
            svar: valgTilSvar(soeknad.omDenAvdoede.selvstendigNaeringsdrivende!!.svar!!), // TODO: Fikse type
            opplysning: opplysningNaeringsInntekt
        },
        militaertjeneste: {
            spoersmaal: t("omDenAvdoede.harAvtjentMilitaerTjeneste.svar"),
            svar: valgTilSvar(soeknad.omDenAvdoede.harAvtjentMilitaerTjeneste!!.svar!!), // TODO: Fikse type
            opplysning: opplysningMilitaertjeneste
        },
        doedsaarsakSkyldesYrkesskadeEllerYrkessykdom: {
            spoersmaal: t("omDenAvdoede.doedsfallAarsak"),
            svar: valgTilSvar(soeknad.omDenAvdoede.doedsfallAarsak!!)
        }
    }
};
