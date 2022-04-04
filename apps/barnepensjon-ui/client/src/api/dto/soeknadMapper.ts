import { TFunction } from '../../hooks/useTranslation'
import { Barnepensjon, SoeknadType } from './InnsendtSoeknad'
import { IApplication } from '../../context/application/application'
import { Barn, Innsender, Person, PersonType, Verge } from './Person'
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
import { IChild } from '../../types/person'
import { Language } from '../../context/language/language'
import { hentForeldre, mapForeldreMedUtvidetInfo } from './foreldreMapper'

export const mapTilBarnepensjonSoeknadListe = (t: TFunction, application: IApplication, user: User): Barnepensjon[] => {
    const children: IChild[] = application.aboutChildren!!.children!!

    return children
        .filter((child) => !!child.appliesForChildrensPension)
        .map((child) => mapTilBarnepensjonSoeknad(t, child, application, user))
}

const mapTilBarnepensjonSoeknad = (
    t: TFunction,
    child: IChild,
    application: IApplication,
    user: User
): Barnepensjon => {
    const innsender: Innsender = mapInnsender(t, user)

    const harSamtykket: Opplysning<boolean> = mapSamtykke(t, application, user)

    const foreldre: Person[] = mapForeldreMedUtvidetInfo(t, child, application, user)

    const soesken: Barn[] = mapSoesken(t, child, application, user)

    return {
        type: SoeknadType.BARNEPENSJON,
        spraak: Language.BOKMAAL, // TODO: Lagre språk i søknad

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
            opplysning: child.paymentDetails.taxWithhold.answer === JaNeiVetIkke.JA ? {
                spoersmaal: t('desiredTaxPercentage', { ns: 'paymentDetails' }),
                svar: {
                    innhold: child.paymentDetails.taxWithhold.taxPercentage || '-'
                }
            } : undefined
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

    const verge: BetingetOpplysning<EnumSvar<JaNeiVetIkke>, Verge> | undefined = mapVerge(t, child)

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
        verge,
    }
}

const mapSoesken = (t: TFunction, child: IChild, application: IApplication, user: User): Barn[] => {
    const allChildren: IChild[] = application.aboutChildren!!.children!!

    // TODO: Sjekke at dette fungerer som forventet
    return allChildren
        .filter((c: IChild) => c.fnrDnr !== child.fnrDnr)
        .map((c: IChild) => mapBarn(t, c, application, user))
}

const mapSamtykke = (t: TFunction, application: IApplication, user: User): Opplysning<boolean> => ({
    spoersmaal: t('consentToNav', { ns: 'frontPage', fornavn: user.fornavn!!, etternavn: user.etternavn!! }),
    svar: !!application.applicant?.consent,
})

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

const mapVerge = (t: TFunction, child: IChild): BetingetOpplysning<EnumSvar<JaNeiVetIkke>, Verge> | undefined => {
    if (!child.childHasGuardianship?.answer) return undefined

    let opplysningOmVerge: Verge | undefined

    if (child.childHasGuardianship!!.answer === JaNeiVetIkke.JA) {
        opplysningOmVerge = {
            type: PersonType.VERGE,
            fornavn: child.childHasGuardianship!!.firstName
                ? {
                      spoersmaal: t('firstName', { ns: 'common' }),
                      svar: child.childHasGuardianship!!.firstName,
                  }
                : undefined,
            etternavn: child.childHasGuardianship!!.lastName
                ? {
                      spoersmaal: t('lastName', { ns: 'common' }),
                      svar: child.childHasGuardianship!!.lastName,
                  }
                : undefined,
            foedselsnummer: child.childHasGuardianship!!.fnr
                ? {
                      spoersmaal: t('fnr', { ns: 'common' }),
                      svar: child.childHasGuardianship!!.fnr,
                  }
                : undefined,
        }
    }

    return {
        spoersmaal: t('childHasGuardian', { ns: 'aboutChildren' }),
        svar: {
            innhold: t(child.childHasGuardianship!!.answer!!, { ns: 'radiobuttons' }),
            verdi: child.childHasGuardianship!!.answer!!,
        },
        opplysning: opplysningOmVerge,
    }
}
