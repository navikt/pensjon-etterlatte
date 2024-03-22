import { TFunction } from 'i18next'
import { BarnRelasjon, IBarn } from '../../typer/person'
import {
    BankkontoType,
    BetingetOpplysning,
    Opplysning,
    JaNeiVetIkke,
    UtbetalingsInformasjon,
    Utenlandsadresse,
    EnumSvar,
    FritekstSvar,
} from '../dto/FellesOpplysninger'
import {
    Avdoed,
    Barn,
    Forelder,
    Gjenlevende,
    GjenlevendeForelder,
    OmsorgspersonType,
    Person,
    PersonType,
    Verge,
} from '../dto/Person'
import { BankkontoType as GammelBankkontoType, IUtbetalingsInformasjon } from '../../typer/utbetaling'
import { IValg } from '../../typer/Spoersmaal'
import { ISoeknad } from '../../context/soknad/soknad'
import { IBruker } from '../../context/bruker/bruker'
import { mapGjenlevende } from './gjenlevendeMapper'
import { mapAvdoed } from './avdoedMapper'

export const valgTilSvar = (t: TFunction, valg: IValg): EnumSvar<JaNeiVetIkke> => {
    switch (valg!!) {
        case IValg.JA:
            return {
                verdi: JaNeiVetIkke.JA,
                innhold: t(IValg.JA),
            }
        case IValg.NEI:
            return {
                verdi: JaNeiVetIkke.NEI,
                innhold: t(IValg.NEI),
            }
        case IValg.VET_IKKE:
            return {
                verdi: JaNeiVetIkke.VET_IKKE,
                innhold: t(IValg.VET_IKKE),
            }
        default:
            throw Error()
    }
}

export const mapBarn = (t: TFunction, barn: IBarn, soeknad: ISoeknad, bruker: IBruker): Barn => {
    const bosattUtlandSvar: IValg = barn.bosattUtland!!.svar!!

    const utenlandsAdresse: BetingetOpplysning<EnumSvar<JaNeiVetIkke>, Utenlandsadresse> = {
        spoersmaal: t('omBarn.bosattUtland.svar'),
        svar: valgTilSvar(t, bosattUtlandSvar),
    }

    if (bosattUtlandSvar === IValg.JA) {
        utenlandsAdresse.opplysning = {
            land: {
                spoersmaal: t('omBarn.bosattUtland.land'),
                svar: {
                    innhold: barn.bosattUtland!!.land!!,
                },
            },
            adresse: {
                spoersmaal: t('omBarn.bosattUtland.adresse'),
                svar: {
                    innhold: barn.bosattUtland!!.adresse!!,
                },
            },
        }
    }

    let verge: BetingetOpplysning<EnumSvar<JaNeiVetIkke>, Verge> | undefined
    if (!!barn.harBarnetVerge?.svar) {
        const opplysningOmVerge: Verge | undefined =
            barn.harBarnetVerge?.svar === IValg.JA
                ? {
                      type: PersonType.VERGE,
                      fornavn: barn.harBarnetVerge!!.fornavn
                          ? {
                                spoersmaal: t('felles.fornavn'),
                                svar: barn.harBarnetVerge!!.fornavn,
                            }
                          : undefined,
                      etternavn: barn.harBarnetVerge!!.etternavn
                          ? {
                                spoersmaal: t('felles.etternavn'),
                                svar: barn.harBarnetVerge!!.etternavn,
                            }
                          : undefined,
                      foedselsnummer: barn.harBarnetVerge!!.foedselsnummer
                          ? {
                                spoersmaal: t('felles.foedselsnummer'),
                                svar: barn.harBarnetVerge!!.foedselsnummer,
                            }
                          : undefined,
                  }
                : undefined

        verge = {
            spoersmaal: t('omBarn.harBarnetVerge.svar'),
            svar: valgTilSvar(t, barn.harBarnetVerge?.svar),
            opplysning: opplysningOmVerge,
        }
    }

    return {
        type: PersonType.BARN,
        fornavn: {
            spoersmaal: t('omBarn.fornavn'),
            svar: barn.fornavn!!,
        },
        etternavn: {
            spoersmaal: t('omBarn.etternavn'),
            svar: barn.etternavn!!,
        },
        foedselsnummer: {
            spoersmaal: t('omBarn.foedselsnummer'),
            svar: barn.foedselsnummer!!,
        },
        statsborgerskap: {
            spoersmaal: t('omBarn.statsborgerskap'),
            svar: barn.statsborgerskap!!,
        },
        utenlandsAdresse,
        foreldre: hentForeldre(t, soeknad, bruker),
        verge,
        dagligOmsorg: hentDagligOmsorg(t, barn),
    }
}

const hentDagligOmsorg = (t: TFunction, barn: IBarn): Opplysning<EnumSvar<OmsorgspersonType>> | undefined => {
    if (barn.relasjon === BarnRelasjon.egneSaerkullsbarn || barn.relasjon === BarnRelasjon.avdoedesSaerkullsbarn) {
        const omsorgsperson = barn.dagligOmsorg === IValg.JA ? OmsorgspersonType.GJENLEVENDE : OmsorgspersonType.ANNET

        return {
            spoersmaal: t('omBarn.dagligOmsorg'),
            svar: {
                verdi: omsorgsperson,
                innhold: t(barn.dagligOmsorg!!),
            },
        }
    } else {
        return undefined
    }
}

export const hentUtbetalingsInformasjonSoeker = (
    t: TFunction,
    utbetalingsInformasjon: IUtbetalingsInformasjon
): BetingetOpplysning<EnumSvar<BankkontoType>, UtbetalingsInformasjon> | undefined => {
    if (utbetalingsInformasjon?.bankkontoType === GammelBankkontoType.utenlandsk) {
        return {
            spoersmaal: t('omDeg.utbetalingsInformasjon.bankkontoType'),
            svar: {
                verdi: BankkontoType.UTENLANDSK,
                innhold: t(GammelBankkontoType.utenlandsk),
            },
            opplysning: {
                utenlandskBankNavn: {
                    spoersmaal: t('omDeg.utbetalingsInformasjon.utenlandskBankNavn'),
                    svar: {
                        innhold: utbetalingsInformasjon.utenlandskBankNavn!!,
                    },
                },
                utenlandskBankAdresse: {
                    spoersmaal: t('omDeg.utbetalingsInformasjon.utenlandskBankAdresse'),
                    svar: {
                        innhold: utbetalingsInformasjon.utenlandskBankAdresse!!,
                    },
                },
                iban: {
                    spoersmaal: t('omDeg.utbetalingsInformasjon.iban'),
                    svar: {
                        innhold: utbetalingsInformasjon.iban!!,
                    },
                },
                swift: {
                    spoersmaal: t('omDeg.utbetalingsInformasjon.swift'),
                    svar: {
                        innhold: utbetalingsInformasjon.swift!!,
                    },
                },
            },
        }
    } else if (!!utbetalingsInformasjon?.kontonummer) {
        return {
            spoersmaal: t('omDeg.utbetalingsInformasjon.bankkontoType'),
            svar: {
                verdi: BankkontoType.NORSK,
                innhold: t(GammelBankkontoType.norsk),
            },
            opplysning: {
                kontonummer: {
                    spoersmaal: t('omDeg.utbetalingsInformasjon.kontonummer'),
                    svar: {
                        innhold: utbetalingsInformasjon!!.kontonummer!!,
                    },
                },
            },
        }
    } else return undefined
}

export const hentUtbetalingsInformasjonBarn = (
    t: TFunction,
    soeker: IBarn,
    soeknad: ISoeknad
): BetingetOpplysning<EnumSvar<BankkontoType>, UtbetalingsInformasjon> | undefined => {
    if (soeker.barnepensjon?.kontonummer?.svar === IValg.JA) {
        const gjenlevendeSinKonto = hentUtbetalingsInformasjonSoeker(t, soeknad.omDeg.utbetalingsInformasjon!!)

        if (gjenlevendeSinKonto === undefined) return undefined

        return {
            ...gjenlevendeSinKonto,
            opplysning: {
                ...gjenlevendeSinKonto?.opplysning,
                skattetrekk: hentSkattetrekk(t, soeker),
            },
        }
    } else if (soeker.barnepensjon?.kontonummer?.svar === IValg.NEI) {
        const barnetSinKonto = hentUtbetalingsInformasjonSoeker(t, soeker.barnepensjon.utbetalingsInformasjon!!)

        if (barnetSinKonto === undefined) return undefined

        return {
            ...barnetSinKonto,
            opplysning: {
                ...barnetSinKonto?.opplysning,
                skattetrekk: hentSkattetrekk(t, soeker),
            },
        }
    }

    return undefined
}

const hentSkattetrekk = (
    t: TFunction,
    soeker: IBarn
): BetingetOpplysning<EnumSvar<JaNeiVetIkke>, Opplysning<FritekstSvar>> | undefined => {
    if (soeker.barnepensjon?.forskuddstrekk?.svar === IValg.JA) {
        const trekkprosent: Opplysning<FritekstSvar> = {
            spoersmaal: t('omBarn.barnepensjon.forskuddstrekk.trekkprosent'),
            svar: {
                innhold: soeker.barnepensjon!!.forskuddstrekk!!.trekkprosent!!,
            },
        }

        return {
            spoersmaal: t('omBarn.barnepensjon.forskuddstrekk.svar'),
            svar: valgTilSvar(t, soeker.barnepensjon!!.forskuddstrekk!!.svar!!),
            opplysning: trekkprosent,
        }
    }
    return undefined
}

export const hentForeldre = (t: TFunction, soeknad: ISoeknad, bruker: IBruker): Forelder[] => {
    const gjenlevende: Forelder = {
        type: PersonType.FORELDER,
        fornavn: {
            spoersmaal: t('felles.fornavn'),
            svar: bruker.fornavn!!,
        },
        etternavn: {
            spoersmaal: t('felles.etternavn'),
            svar: bruker.etternavn!!,
        },
        foedselsnummer: {
            spoersmaal: t('felles.foedselsnummer'),
            svar: bruker.foedselsnummer!!,
        },
    }

    const avdoed: Forelder = {
        type: PersonType.FORELDER,
        fornavn: {
            spoersmaal: t('felles.fornavn'),
            svar: soeknad.omDenAvdoede.fornavn!!,
        },
        etternavn: {
            spoersmaal: t('felles.etternavn'),
            svar: soeknad.omDenAvdoede.etternavn!!,
        },
        foedselsnummer: {
            spoersmaal: t('felles.foedselsnummer'),
            svar: soeknad.omDenAvdoede.foedselsnummer!!,
        },
    }

    return [gjenlevende, avdoed]
}

export const hentForeldreMedUtvidetInfo = (t: TFunction, soeknad: ISoeknad, bruker: IBruker): Person[] => {
    const gjenlevende: Gjenlevende = mapGjenlevende(t, soeknad, bruker)

    const gjenlevendeForelder: GjenlevendeForelder = {
        type: PersonType.GJENLEVENDE_FORELDER,
        fornavn: gjenlevende.fornavn,
        etternavn: gjenlevende.etternavn,
        foedselsnummer: gjenlevende.foedselsnummer,
        statsborgerskap: gjenlevende.statsborgerskap,
        adresse: gjenlevende.adresse,
        kontaktinfo: gjenlevende.kontaktinfo,
    }
    const avdoed: Avdoed = mapAvdoed(t, soeknad)

    return [gjenlevendeForelder, avdoed]
}
