import { TFunction } from "i18next";
import { ISoeknad } from "../../context/soknad/soknad";
import {
    EnumSvar, FritekstSvar,
    Naeringsinntekt,
    OppholdUtlandType,
    Opplysning,
    Utenlandsopphold
} from "../dto/FellesOpplysninger";
import {
    Avdoed,
    PersonType,
} from "../dto/Person";
import { IValg } from "../../typer/Spoersmaal";
import { valgTilSvar } from "./fellesMapper";
import { konverterOpphold } from "./typeMapper";

export const mapAvdoed = (t: TFunction, soeknad: ISoeknad): Avdoed => {
    let oppholdUtland: Utenlandsopphold[] | undefined;

    if (soeknad.omDenAvdoede.boddEllerJobbetUtland?.svar === IValg.JA) {
        oppholdUtland = soeknad.omDenAvdoede.boddEllerJobbetUtland.oppholdUtland?.map(info => {
            const oppholdsTypeListe: EnumSvar<OppholdUtlandType>[] = info.beskrivelse
                ?.map(type => ({
                    verdi: konverterOpphold(type),
                    innhold: t(type),
                })) || [];

            const utenlandsopphold: Utenlandsopphold = {
                land: {
                    spoersmaal: t("omDenAvdoede.boddEllerJobbetUtland.oppholdUtland.land"),
                    svar: {
                        innhold: info.land!!
                    }
                },
                fraDato: info.fraDato ? {
                    spoersmaal: t("omDenAvdoede.boddEllerJobbetUtland.oppholdUtland.fraDato"),
                    svar: {
                        innhold: info.fraDato!!
                    }
                } : undefined,
                tilDato: info.tilDato ? {
                    spoersmaal: t("omDenAvdoede.boddEllerJobbetUtland.oppholdUtland.tilDato"),
                    svar: {
                        innhold: info.tilDato!!
                    }
                } : undefined,
                oppholdsType: {
                    spoersmaal: t("omDenAvdoede.boddEllerJobbetUtland.oppholdUtland.beskrivelse"),
                    svar: oppholdsTypeListe
                },
                medlemFolketrygd: {
                    spoersmaal: t("omDenAvdoede.boddEllerJobbetUtland.oppholdUtland.medlemFolketrygd"),
                    svar: valgTilSvar(t, info.medlemFolketrygd!!)
                },
                pensjonsutbetaling: {
                    spoersmaal: t("omDenAvdoede.boddEllerJobbetUtland.oppholdUtland.mottokPensjon.beskrivelse"),
                    svar: {
                        innhold: info.mottokPensjon?.beskrivelse || "-"
                    }
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
                svar: {
                    innhold: `${soeknad.omDenAvdoede.selvstendigNaeringsdrivende?.beskrivelse}`
                }
            },
            naeringsinntektVedDoedsfall: {
                spoersmaal: t("omDenAvdoede.haddePensjonsgivendeInntekt.svar"),
                svar: valgTilSvar(t, soeknad.omDenAvdoede.haddePensjonsgivendeInntekt!!.svar!!) // TODO: Fikse type
            }
        }
    }

    let opplysningMilitaertjeneste: Opplysning<FritekstSvar> | undefined;
    if (soeknad.omDenAvdoede.harAvtjentMilitaerTjeneste?.svar === IValg.JA) {
        opplysningMilitaertjeneste = {
            spoersmaal: t("omDenAvdoede.harAvtjentMilitaerTjeneste.beskrivelse"),
            svar: {
                innhold: soeknad.omDenAvdoede.harAvtjentMilitaerTjeneste!!.beskrivelse!! || "-"
            }
        }
    }

    return {
        type: PersonType.AVDOED,

        fornavn: {
            spoersmaal: t("omDenAvdoede.fornavn"),
            svar: soeknad.omDegOgAvdoed.avdoed!!.fornavn!!
        },
        etternavn: {
            spoersmaal: t("omDenAvdoede.etternavn"),
            svar: soeknad.omDegOgAvdoed.avdoed!!.etternavn!!
        },
        foedselsnummer: {
            spoersmaal: t("omDenAvdoede.foedselsnummer"),
            svar: soeknad.omDenAvdoede.foedselsnummer!!
        },

        datoForDoedsfallet: {
            spoersmaal: t("omDegOgAvdoed.avdoed.datoForDoedsfallet"),
            svar: {
                innhold: soeknad.omDegOgAvdoed.avdoed!!.datoForDoedsfallet!!
            }
        },
        statsborgerskap: {
            spoersmaal: t("omDenAvdoede.statsborgerskap"),
            svar: {
                innhold: soeknad.omDenAvdoede.statsborgerskap!!
            }
        },
        utenlandsopphold: {
            spoersmaal: t("omDenAvdoede.boddEllerJobbetUtland.svar"),
            svar: valgTilSvar(t, soeknad.omDenAvdoede.boddEllerJobbetUtland!!.svar!!), // TODO: Fikse type
            opplysning: oppholdUtland
        },
        naeringsInntekt: {
            spoersmaal: t("omDenAvdoede.selvstendigNaeringsdrivende.svar"),
            svar: valgTilSvar(t, soeknad.omDenAvdoede.selvstendigNaeringsdrivende!!.svar!!), // TODO: Fikse type
            opplysning: opplysningNaeringsInntekt
        },
        militaertjeneste: {
            spoersmaal: t("omDenAvdoede.harAvtjentMilitaerTjeneste.svar"),
            svar: valgTilSvar(t, soeknad.omDenAvdoede.harAvtjentMilitaerTjeneste!!.svar!!), // TODO: Fikse type
            opplysning: opplysningMilitaertjeneste
        },
        doedsaarsakSkyldesYrkesskadeEllerYrkessykdom: {
            spoersmaal: t("omDenAvdoede.doedsfallAarsak"),
            svar: valgTilSvar(t, soeknad.omDenAvdoede.doedsfallAarsak!!)
        }
    }
};
