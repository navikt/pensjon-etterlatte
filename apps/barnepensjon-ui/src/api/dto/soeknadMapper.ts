import { TFunction } from '../../hooks/useTranslation'
import { Barnepensjon, SoeknadType } from './InnsendtSoeknad'
import { IApplication } from '../../context/application/application'
import { Barn, Innsender, Person, PersonType } from './Person'
import { User } from '../../context/user/user'
import {
    BankkontoType,
    BetingetOpplysning,
    EnumSvar,
    FritekstSvar,
    JaNeiVetIkke,
    Opplysning,
    UtbetalingsInformasjon,
    Utenlandsadresse,
} from './FellesOpplysninger'
import { IAboutYou, IChild } from '../../types/person'
import { Language } from '../../context/language/language'
import { hentForeldre, hentForeldreOver18, mapForeldreMedUtvidetInfo } from './foreldreMapper'
import { mapVerge } from './mapVerge'

export const mapTilBarnepensjonSoeknadListe = (
    t: TFunction,
    application: IApplication,
    user: User,
    isChild: boolean
): Barnepensjon[] => {
    if (isChild) {
        return [mapTilBarnepensjonSoeknadOver18(t, application, user)]
    }
    const children: IChild[] = application.aboutChildren!!.children!!

    if (!children.length) {
        throw Error('Kan ikke sende inn søknad med tom liste over barn!')
    }

    return children
        .filter((child) => !!child.appliesForChildrensPension)
        .map((child) => mapTilBarnepensjonSoeknad(t, child, application, user))
}

const mapTilBarnepensjonSoeknadOver18 = (t: TFunction, application: IApplication, user: User): Barnepensjon => {
    const innsender: Innsender = mapInnsender(t, user)

    const harSamtykket: Opplysning<boolean> = mapSamtykke(t, application, user)

    const foreldre: Person[] = mapForeldreMedUtvidetInfo(t, application, user)

    return {
        type: SoeknadType.BARNEPENSJON,
        spraak: application.meta?.language || Language.BOKMAAL,

        innsender,
        harSamtykket,

        utbetalingsInformasjon: mapUtbetalingsinfoOver18(t, application.aboutYou),

        soeker: mapBarnOver18(t, application, user),
        foreldre,
    }
}

const mapTilBarnepensjonSoeknad = (
    t: TFunction,
    child: IChild,
    application: IApplication,
    user: User
): Barnepensjon => {
    const innsender: Innsender = mapInnsender(t, user)

    const harSamtykket: Opplysning<boolean> = mapSamtykke(t, application, user)

    const foreldre: Person[] = mapForeldreMedUtvidetInfo(t, application, user)

    const soesken: Barn[] = mapSoesken(t, child, application, user)

    return {
        type: SoeknadType.BARNEPENSJON,
        spraak: application.meta?.language || Language.BOKMAAL,

        innsender,
        harSamtykket,

        utbetalingsInformasjon: mapUtbetalingsinfo(t, child),

        // TODO: Legge til "Din situasjon" på barnet.
        // situasjon: undefined,

        soeker: mapBarn(t, child, application, user),
        foreldre,
        soesken,
    }
}

const mapUtbetalingsinfo = (
    t: TFunction,
    child: IChild
): BetingetOpplysning<EnumSvar<BankkontoType>, UtbetalingsInformasjon> | undefined => {
    let skattetrekk: BetingetOpplysning<EnumSvar<JaNeiVetIkke>, Opplysning<FritekstSvar> | undefined> | undefined
    if (!!child.paymentDetails?.taxWithhold?.answer) {
        skattetrekk = {
            spoersmaal: t('doYouWantUsToWithholdTax', { ns: 'paymentDetails' }),
            svar: {
                verdi: child.paymentDetails.taxWithhold.answer,
                innhold: t(child.paymentDetails.taxWithhold.answer, { ns: 'radiobuttons' }),
            },
            opplysning:
                child.paymentDetails.taxWithhold.answer === JaNeiVetIkke.JA
                    ? {
                          spoersmaal: t('desiredTaxPercentage', { ns: 'paymentDetails' }),
                          svar: {
                              innhold: child.paymentDetails.taxWithhold.taxPercentage || '-',
                          },
                      }
                    : undefined,
        }
    }

    if (child.paymentDetails?.accountType === BankkontoType.UTENLANDSK) {
        return {
            spoersmaal: t('accountType', { ns: 'paymentDetails' }),
            svar: {
                verdi: BankkontoType.UTENLANDSK,
                innhold: t(BankkontoType.UTENLANDSK, { ns: 'paymentDetails' }),
            },
            opplysning: {
                utenlandskBankNavn: {
                    spoersmaal: t('foreignBankName', { ns: 'paymentDetails' }),
                    svar: {
                        innhold: child.paymentDetails.foreignBankName!!,
                    },
                },
                utenlandskBankAdresse: {
                    spoersmaal: t('foreignBankAddress', { ns: 'paymentDetails' }),
                    svar: {
                        innhold: child.paymentDetails.foreignBankAddress!!,
                    },
                },
                iban: {
                    spoersmaal: t('iban', { ns: 'paymentDetails' }),
                    svar: {
                        innhold: child.paymentDetails.iban!!,
                    },
                },
                swift: {
                    spoersmaal: t('swift', { ns: 'paymentDetails' }),
                    svar: {
                        innhold: child.paymentDetails.swift!!,
                    },
                },
                skattetrekk,
            },
        }
    } else if (!!child.paymentDetails?.bankAccount) {
        return {
            spoersmaal: t('accountType', { ns: 'paymentDetails' }),
            svar: {
                verdi: BankkontoType.NORSK,
                innhold: t(BankkontoType.NORSK, { ns: 'paymentDetails' }),
            },
            opplysning: {
                kontonummer: {
                    spoersmaal: t('bankAccount', { ns: 'paymentDetails' }),
                    svar: {
                        innhold: child.paymentDetails?.bankAccount!!,
                    },
                },
                skattetrekk,
            },
        }
    } else return undefined
}

const mapUtbetalingsinfoOver18 = (
    t: TFunction,
    aboutYou: IAboutYou
): BetingetOpplysning<EnumSvar<BankkontoType>, UtbetalingsInformasjon> | undefined => {
    if (aboutYou.paymentDetails?.accountType === BankkontoType.UTENLANDSK) {
        return {
            spoersmaal: t('accountType', { ns: 'paymentDetails' }),
            svar: {
                verdi: BankkontoType.UTENLANDSK,
                innhold: t(BankkontoType.UTENLANDSK, { ns: 'paymentDetails' }),
            },
            opplysning: {
                utenlandskBankNavn: {
                    spoersmaal: t('foreignBankName', { ns: 'paymentDetails' }),
                    svar: {
                        innhold: aboutYou.paymentDetails.foreignBankName!!,
                    },
                },
                utenlandskBankAdresse: {
                    spoersmaal: t('foreignBankAddress', { ns: 'paymentDetails' }),
                    svar: {
                        innhold: aboutYou.paymentDetails.foreignBankAddress!!,
                    },
                },
                iban: {
                    spoersmaal: t('iban', { ns: 'paymentDetails' }),
                    svar: {
                        innhold: aboutYou.paymentDetails.iban!!,
                    },
                },
                swift: {
                    spoersmaal: t('swift', { ns: 'paymentDetails' }),
                    svar: {
                        innhold: aboutYou.paymentDetails.swift!!,
                    },
                },
            },
        }
    } else if (!!aboutYou.paymentDetails?.bankAccount) {
        return {
            spoersmaal: t('accountType', { ns: 'paymentDetails' }),
            svar: {
                verdi: BankkontoType.NORSK,
                innhold: t(BankkontoType.NORSK, { ns: 'paymentDetails' }),
            },
            opplysning: {
                kontonummer: {
                    spoersmaal: t('bankAccount', { ns: 'paymentDetails' }),
                    svar: {
                        innhold: aboutYou.paymentDetails?.bankAccount!!,
                    },
                },
            },
        }
    } else return undefined
}
const mapBarn = (t: TFunction, child: IChild, application: IApplication, user: User): Barn => {
    const staysAbroad = child.staysAbroad?.answer

    const utenlandsAdresse: BetingetOpplysning<EnumSvar<JaNeiVetIkke>, Utenlandsadresse> | undefined = staysAbroad
        ? {
              spoersmaal: t('doesTheChildLiveAbroad', { ns: 'aboutChildren' }),
              svar: {
                  innhold: t(staysAbroad, { ns: 'radiobuttons' }),
                  verdi: staysAbroad,
              },
          }
        : undefined

    if (staysAbroad === JaNeiVetIkke.JA && !!utenlandsAdresse) {
        utenlandsAdresse.opplysning = {
            land: {
                spoersmaal: t('stayAbroadCountry', { ns: 'aboutChildren' }),
                svar: {
                    innhold: child.staysAbroad!!.country!!,
                },
            },
            adresse: {
                spoersmaal: t('addressAbroad', { ns: 'aboutChildren' }),
                svar: {
                    innhold: child.staysAbroad!!.address!!,
                },
            },
        }
    }

    return {
        type: PersonType.BARN,
        fornavn: {
            spoersmaal: t('firstName', { ns: 'common' }),
            svar: child.firstName!!,
        },
        etternavn: {
            spoersmaal: t('lastName', { ns: 'common' }),
            svar: child.lastName!!,
        },
        foedselsnummer: {
            spoersmaal: t('fnrDnr', { ns: 'common' }),
            svar: child.fnrDnr!!,
        },
        statsborgerskap: {
            spoersmaal: t('citizenship', { ns: 'common' }),
            svar: child.citizenship!!,
        },
        utenlandsAdresse,
        foreldre: hentForeldre(t, child, application, user),
        verge: mapVerge(t, child, user),
    }
}

const mapBarnOver18 = (t: TFunction, application: IApplication, user: User): Barn => {

    const staysAbroad = application.aboutYou.residesInNorway

    const utenlandsAdresse: BetingetOpplysning<EnumSvar<JaNeiVetIkke>, Utenlandsadresse> | undefined = staysAbroad
            ? {
                spoersmaal: t('doesTheChildLiveAbroad', { ns: 'aboutChildren' }),
                svar: {
                    innhold: t(staysAbroad, { ns: 'radiobuttons' }),
                    verdi: staysAbroad,
                },
            }
            : undefined

    if (staysAbroad === JaNeiVetIkke.NEI && !!utenlandsAdresse) {
        utenlandsAdresse.opplysning = {
            land: {
                spoersmaal: t('stayAbroadCountry', { ns: 'aboutChildren' }),
                svar: {
                    innhold: application.aboutYou!!.countryOfResidence!!,
                },
            }
        }
    }

    return {
        type: PersonType.BARN,
        fornavn: {
            spoersmaal: t('firstName', { ns: 'common' }),
            svar: user.fornavn!!,
        },
        etternavn: {
            spoersmaal: t('lastName', { ns: 'common' }),
            svar: user.etternavn!!,
        },
        foedselsnummer: {
            spoersmaal: t('fnrDnr', { ns: 'common' }),
            svar: user.foedselsnummer!!,
        },
        statsborgerskap: {
            spoersmaal: t('citizenship', { ns: 'common' }),
            svar: user.statsborgerskap!!,
        },
        foreldre: hentForeldreOver18(t, application),
        utenlandsAdresse,
    }
}

const mapSoesken = (t: TFunction, child: IChild, application: IApplication, user: User): Barn[] => {
    const allChildren: IChild[] = application.aboutChildren!!.children!!

    // TODO: Sjekke at dette fungerer som forventet
    return allChildren
        .filter((c: IChild) => c.fnrDnr !== child.fnrDnr)
        .map((c: IChild) => mapBarn(t, c, application, user))
}

const mapSamtykke = (t: TFunction, application: IApplication, user: User): Opplysning<boolean> => {
    if (!application.applicant!!.consent) throw Error('Kan ikke sende inn søknad uten å ha samtykket!')

    return {
        spoersmaal: t('consentToNav', { ns: 'frontPage', fornavn: user.fornavn!!, etternavn: user.etternavn!! }),
        svar: !!application.applicant?.consent,
    }
}

const mapInnsender = (t: TFunction, user: User): Innsender => ({
    type: PersonType.INNSENDER,
    fornavn: {
        spoersmaal: t('firstName', { ns: 'common' }),
        svar: user.fornavn!!,
    },
    etternavn: {
        spoersmaal: t('lastName', { ns: 'common' }),
        svar: user.etternavn!!,
    },
    foedselsnummer: {
        spoersmaal: t('fnrDnr', { ns: 'common' }),
        svar: user.foedselsnummer!!,
    },
})
