import { TFunction } from "i18next";
import { BarnRelasjon, IBarn, ISoeker } from "../../typer/person";
import {
    BankkontoType,
    BetingetOpplysning,
    Opplysning,
    JaNeiVetIkke,
    UtbetalingsInformasjon,
    Utenlandsadresse,
    EnumSvar,
} from "../dto/FellesOpplysninger";
import {
    Avdoed,
    Barn,
    Forelder,
    Gjenlevende,
    GjenlevendeForelder,
    OmsorgspersonType,
    Person,
    PersonType,
    Verge
} from "../dto/Person";
import { BankkontoType as GammelBankkontoType } from "../../typer/utbetaling";
import { IValg } from "../../typer/Spoersmaal";
import { ISoeknad } from "../../context/soknad/soknad";
import { IBruker } from "../../context/bruker/bruker";
import { mapGjenlevende } from "./gjenlevendeMapper";
import { mapAvdoed } from "./avdoedMapper";

export const valgTilSvar = (
    t: TFunction,
    valg: IValg
): EnumSvar<JaNeiVetIkke> => {
    switch (valg!!) {
        case IValg.JA:
            return {
                verdi: JaNeiVetIkke.JA,
                svar: t(IValg.JA)
            }
        case IValg.NEI:
            return {
                verdi: JaNeiVetIkke.NEI,
                svar: t(IValg.NEI)
            }
        case IValg.VET_IKKE:
            return {
                verdi: JaNeiVetIkke.VET_IKKE,
                svar: t(IValg.VET_IKKE)
            }
        default:
            throw Error()
    }
};

export const mapBarn = (
    t: TFunction,
    barn: IBarn,
    soeknad: ISoeknad,
    bruker: IBruker
): Barn => {
    const bosattUtlandSvar: IValg = barn.bosattUtland!!.svar!!;

    const utenlandsAdresse: BetingetOpplysning<EnumSvar<JaNeiVetIkke>, Utenlandsadresse> = {
        spoersmaal: t("omBarn.bosattUtland.svar"),
        svar: valgTilSvar(t, bosattUtlandSvar)
    };

    if (bosattUtlandSvar === IValg.JA) {
        utenlandsAdresse.opplysning = {
            land: {
                spoersmaal: t("omBarn.bosattUtland.land"),
                svar: barn.bosattUtland!!.land!!
            },
            adresse: {
                spoersmaal: t("omBarn.bosattUtland.adresse"),
                svar: barn.bosattUtland!!.adresse!!
            }
        }
    }

    let verge: BetingetOpplysning<EnumSvar<JaNeiVetIkke>, Verge> | undefined;
    if (!!barn.harBarnetVerge?.svar) {
        const opplysningOmVerge: Verge | undefined = barn.harBarnetVerge?.svar === IValg.JA ? {
            type: PersonType.VERGE,
            fornavn: barn.harBarnetVerge!!.fornavn!!,
            etternavn: barn.harBarnetVerge!!.etternavn!!,
            foedselsnummer: barn.harBarnetVerge!!.foedselsnummer!!,
        } : undefined;

        verge = {
            spoersmaal: t("omBarn.harBarnetVerge.svar"),
            svar: valgTilSvar(t, barn.harBarnetVerge?.svar),
            opplysning: opplysningOmVerge
        }
    }

    return {
        type: PersonType.BARN,
        fornavn: barn.fornavn!!,
        etternavn: barn.etternavn!!,
        foedselsnummer: barn.foedselsnummer!!,
        statsborgerskap: {
            spoersmaal: t("omBarn.statsborgerskap"),
            svar: barn.statsborgerskap!!
        },
        utenlandsAdresse,
        foreldre: hentForeldre(t, barn, soeknad, bruker),
        verge,
        dagligOmsorg: hentDagligOmsorg(t, barn)
    }
};

const hentDagligOmsorg = (t: TFunction, barn: IBarn): Opplysning<OmsorgspersonType> | undefined => {
    if (barn.relasjon === BarnRelasjon.egneSaerkullsbarn || barn.relasjon === BarnRelasjon.avdoedesSaerkullsbarn) {
        let person: OmsorgspersonType;
        if (barn.dagligOmsorg === IValg.JA)
            person = OmsorgspersonType.GJENLEVENDE;
        else if (barn.harBarnetVerge === IValg.JA) // Todo: Mulig dette ikke stemmer..
            person = OmsorgspersonType.VERGE
        else
            person = OmsorgspersonType.ANNET

        return {
            spoersmaal: t("omBarn.dagligOmsorg"),
            svar: person
        };
    } else {
        return undefined;
    }
};

export const hentUtbetalingsInformasjonSoeker = (
    t: TFunction,
    omDeg: ISoeker
): BetingetOpplysning<EnumSvar<BankkontoType>, UtbetalingsInformasjon> | undefined => {
    if (omDeg.utbetalingsInformasjon?.bankkontoType === GammelBankkontoType.utenlandsk) {
        return {
            spoersmaal: t("omDeg.utbetalingsInformasjon.bankkontoType"),
            svar: {
                verdi: BankkontoType.UTENLANDSK,
                svar: t(GammelBankkontoType.utenlandsk)
            },
            opplysning: {
                utenlandskBankNavn: {
                    spoersmaal: t("omDeg.utbetalingsInformasjon.utenlandskBankNavn"),
                    svar: omDeg.utbetalingsInformasjon.utenlandskBankNavn!!
                },
                utenlandskBankAdresse: {
                    spoersmaal: t("omDeg.utbetalingsInformasjon.utenlandskBankAdresse"),
                    svar: omDeg.utbetalingsInformasjon.utenlandskBankAdresse!!
                },
                iban: {
                    spoersmaal: t("omDeg.utbetalingsInformasjon.iban"),
                    svar: omDeg.utbetalingsInformasjon.iban!!
                },
                swift: {
                    spoersmaal: t("omDeg.utbetalingsInformasjon.swift"),
                    svar: omDeg.utbetalingsInformasjon.swift!!
                }
            }
        }
    } else if (!!omDeg.utbetalingsInformasjon?.kontonummer) {
        return {
            spoersmaal: t("omDeg.utbetalingsInformasjon.bankkontoType"),
            svar: {
                verdi: BankkontoType.NORSK,
                svar: t(GammelBankkontoType.norsk)
            },
            opplysning: {
                kontonummer: {
                    spoersmaal: t("omDeg.utbetalingsInformasjon.kontonummer"),
                    svar: omDeg.utbetalingsInformasjon!!.kontonummer!!
                }
            }
        }
    } else return undefined;
};

export const hentUtbetalingsInformasjonBarn = (
    t: TFunction,
    soeker: IBarn,
    soeknad: ISoeknad
): BetingetOpplysning<EnumSvar<BankkontoType>, UtbetalingsInformasjon> | undefined => {
    if (soeker.barnepensjon?.kontonummer?.svar === IValg.JA) {
        const gjenlevendeSinKonto = hentUtbetalingsInformasjonSoeker(t, soeknad.omDeg);

        if (gjenlevendeSinKonto === undefined)
            return undefined;

        return {
            ...gjenlevendeSinKonto,
            opplysning: {
                 ...gjenlevendeSinKonto?.opplysning,
                skattetrekk: hentSkattetrekk(t, soeker)
            }
        };
    } else if (soeker.barnepensjon?.kontonummer?.svar === IValg.NEI) {
        return {
            spoersmaal: t("omDeg.utbetalingsInformasjon.bankkontoType"), // Dette mapper ikke opp i dagens modell.
            svar: {
                verdi: BankkontoType.NORSK,
                svar: t(GammelBankkontoType.norsk)
            }, // Kun støtte for norsk konto
            opplysning: {
                kontonummer: {
                    spoersmaal: t("omBarn.barnepensjon.kontonummer.kontonummer"),
                    svar: soeker.barnepensjon!!.kontonummer!!.kontonummer!!
                },
                skattetrekk: hentSkattetrekk(t, soeker)
            }
        }
    }

    return undefined;
};

const hentSkattetrekk = (
    t: TFunction,
    soeker: IBarn
): BetingetOpplysning<EnumSvar<JaNeiVetIkke>, Opplysning<String>> | undefined => {
    if (soeker.barnepensjon?.forskuddstrekk?.svar === IValg.JA) {
        const trekkprosent: Opplysning<String> = {
            spoersmaal: t("omBarn.barnepensjon.forskuddstrekk.trekkprosent"),
            svar: soeker.barnepensjon!!.forskuddstrekk!!.trekkprosent!!
        };

        return {
            spoersmaal: t("omBarn.barnepensjon.forskuddstrekk.svar"),
            svar: valgTilSvar(t, soeker.barnepensjon!!.forskuddstrekk!!.svar!!),
            opplysning: trekkprosent
        }
    }
    return undefined
}

export const hentForeldre = (
    t: TFunction,
    barn: IBarn,
    soeknad: ISoeknad,
    bruker: IBruker
): Forelder[] => {
    // TODO: Per dags dato er bruker alltid gjenlevende, men dette kan endre seg. Burde ryddes opp i.
    const gjenlevende: Forelder = {
        type: PersonType.FORELDER,
        fornavn: bruker.fornavn!!,
        etternavn: bruker.etternavn!!,
        foedselsnummer: bruker.foedselsnummer!!,
    };

    const avdoed: Forelder = {
        type: PersonType.FORELDER,
        fornavn: soeknad.omDegOgAvdoed.avdoed!!.fornavn!!,
        etternavn: soeknad.omDegOgAvdoed.avdoed!!.etternavn!!,
        foedselsnummer: soeknad.omDenAvdoede.foedselsnummer!!
    };

    if (barn.relasjon === BarnRelasjon.fellesbarnMedAvdoede) {
        return [gjenlevende, avdoed];
    } else if (barn.relasjon === BarnRelasjon.avdoedesSaerkullsbarn) {
        return [avdoed];
    } else if (barn.relasjon === BarnRelasjon.egneSaerkullsbarn) {
        return [gjenlevende];
    } else {
        return [];
    }
};

export const hentForeldreMedUtvidetInfo = (
    t: TFunction,
    barn: IBarn,
    soeknad: ISoeknad,
    bruker: IBruker
): Person[] => {
    const gjenlevende: Gjenlevende = mapGjenlevende(t, soeknad, bruker);

    const gjenlevendeForelder: GjenlevendeForelder = {
        type: PersonType.GJENLEVENDE_FORELDER,
        fornavn: gjenlevende.fornavn,
        etternavn: gjenlevende.etternavn,
        foedselsnummer: gjenlevende.foedselsnummer,
        statsborgerskap: {
            spoersmaal: t("felles.statsborgerskap"),
            svar: gjenlevende.statsborgerskap
        },
        adresse: gjenlevende.adresse,
        kontaktinfo: gjenlevende.kontaktinfo
    }
    const avdoed: Avdoed = mapAvdoed(t, soeknad);

    if (barn.relasjon === BarnRelasjon.fellesbarnMedAvdoede) {
        return [gjenlevendeForelder, avdoed];
    } else if (barn.relasjon === BarnRelasjon.avdoedesSaerkullsbarn) {
        return [avdoed];
    } else if (barn.relasjon === BarnRelasjon.egneSaerkullsbarn) {
        return [gjenlevendeForelder];
    } else {
        return [];
    }
};
