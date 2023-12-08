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
    OppholdUtland,
    Opplysning,
    UtbetalingsInformasjon,
    Utenlandsadresse,
} from './FellesOpplysninger'
import { IAboutYou, IChild } from '../../types/person'
import { Language } from '../../context/language/language'
import { hentForeldre, hentForeldreOver18, mapForeldreMedUtvidetInfo } from './foreldreMapper'
import { mapVerge } from './mapVerge'
import { ApplicantRole } from '../../components/application/scenario/ScenarioSelection'

export const mapTilBarnepensjonSoeknadListe = (
    t: TFunction,
    application: IApplication,
    user: User,
    isChild: boolean
): Barnepensjon[] => {
    if (isChild) {
        return [mapTilBarnepensjonSoeknad(t, application, user)]
    }
    const children: IChild[] = application.aboutChildren!!.children!!

    if (!children.length) {
        throw Error('Kan ikke sende inn søknad med tom liste over barn!')
    }

    return children
        .filter((child) => !!child.appliesForChildrensPension)
        .map((child) => mapTilBarnepensjonSoeknad(t, application, user, child))
}

const mapTilBarnepensjonSoeknad = (
    t: TFunction,
    application: IApplication,
    user: User,
    child?: IChild
): Barnepensjon => {
    const innsender: Innsender = mapInnsender(t, user)

    const harSamtykket: Opplysning<boolean> = mapSamtykke(t, application)

    const foreldre: Person[] = mapForeldreMedUtvidetInfo(t, application, user)

    const soesken: Barn[] = child ? mapSoesken(t, child, application, user) : []

    return {
        type: SoeknadType.BARNEPENSJON,
        spraak: application.meta?.language || Language.BOKMAAL,

        innsender,
        harSamtykket,

        utbetalingsInformasjon: child ? mapUtbetalingsinfo(t, child) : mapUtbetalingsinfo(t, application.aboutYou),

        soeker: child ? mapBarn(t, child, application, user) : mapBarnOver18(t, application, user),
        foreldre,
        soesken,
    }
}

const mapUtbetalingsinfo = (
    t: TFunction,
    person: IChild | IAboutYou
): BetingetOpplysning<EnumSvar<BankkontoType>, UtbetalingsInformasjon> | undefined => {
    if (person.paymentDetails?.accountType === BankkontoType.UTENLANDSK) {
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
                        innhold: person.paymentDetails.foreignBankName!!,
                    },
                },
                utenlandskBankAdresse: {
                    spoersmaal: t('foreignBankAddress', { ns: 'paymentDetails' }),
                    svar: {
                        innhold: person.paymentDetails.foreignBankAddress!!,
                    },
                },
                iban: {
                    spoersmaal: t('iban', { ns: 'paymentDetails' }),
                    svar: {
                        innhold: person.paymentDetails.iban!!,
                    },
                },
                swift: {
                    spoersmaal: t('swift', { ns: 'paymentDetails' }),
                    svar: {
                        innhold: person.paymentDetails.swift!!,
                    },
                },
            },
        }
    } else if (!!person.paymentDetails?.bankAccount) {
        let skattetrekk: BetingetOpplysning<EnumSvar<JaNeiVetIkke>, Opplysning<FritekstSvar> | undefined> | undefined
        if (!!person.paymentDetails?.taxWithhold?.answer) {
            skattetrekk = {
                spoersmaal: t('doYouWantUsToWithholdTax', { ns: 'paymentDetails' }),
                svar: {
                    verdi: person.paymentDetails.taxWithhold.answer,
                    innhold: t(person.paymentDetails.taxWithhold.answer, { ns: 'radiobuttons' }),
                },
                opplysning:
                    person.paymentDetails.taxWithhold.answer === JaNeiVetIkke.JA
                        ? {
                              spoersmaal: t('desiredTaxPercentage', { ns: 'paymentDetails' }),
                              svar: {
                                  innhold: person.paymentDetails.taxWithhold.taxPercentage || '-',
                              },
                          }
                        : undefined,
            }
        }

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
                        innhold: person.paymentDetails?.bankAccount!!,
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

    const ukjentForelder: Opplysning<string> | undefined = !!application.unknownParent
        ? {
              spoersmaal: t('unknownParentQuestionGuardian', {
                  ns: 'aboutParents',
              }),
              svar: t('yesUnknownParentGuardian', { ns: 'btn' }),
          }
        : undefined

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
        ukjentForelder,
        foreldre: hentForeldre(t, child, application, user),
        verge: mapVerge(t, child, user),
    }
}

const mapBarnOver18 = (t: TFunction, application: IApplication, user: User): Barn => {
    const residesInNorway = application.aboutYou.residesInNorway
    const isChild = application.applicant?.applicantRole === ApplicantRole.CHILD
    const aboutYou = application.aboutYou

    const utenlandsAdresse: BetingetOpplysning<EnumSvar<JaNeiVetIkke>, Utenlandsadresse> | undefined = residesInNorway
        ? {
              spoersmaal: t('residesInNorwaySummaryQuestion', { ns: 'aboutYou' }),
              svar:
                  residesInNorway === JaNeiVetIkke.JA
                      ? {
                            innhold: t(JaNeiVetIkke.NEI, { ns: 'radiobuttons' }),
                            verdi: JaNeiVetIkke.NEI,
                        }
                      : {
                            innhold: t(JaNeiVetIkke.JA, { ns: 'radiobuttons' }),
                            verdi: JaNeiVetIkke.JA,
                        },
          }
        : undefined

    if (residesInNorway === JaNeiVetIkke.NEI && !!utenlandsAdresse) {
        utenlandsAdresse.opplysning = {
            land: {
                spoersmaal: t('countryOfResidence', { ns: 'aboutYou' }),
                svar: {
                    innhold: aboutYou!!.countryOfResidence!!,
                },
            },
        }
    }

    const bosattNorge: BetingetOpplysning<EnumSvar<JaNeiVetIkke>, OppholdUtland | undefined> | undefined =
        residesInNorway === JaNeiVetIkke.JA
            ? {
                  spoersmaal: t('stayedAbroad', { ns: 'aboutYou' }),
                  svar: {
                      innhold: t(aboutYou.stayedAbroad!!, { ns: 'radiobuttons' }),
                      verdi: aboutYou.stayedAbroad!!,
                  },
              }
            : undefined

    if (residesInNorway === JaNeiVetIkke.JA && aboutYou.stayedAbroad!! === JaNeiVetIkke.JA && !!bosattNorge) {
        bosattNorge.opplysning = {
            oppholdLand: {
                spoersmaal: t('stayedAbroadCountry', { ns: 'aboutYou' }),
                svar: {
                    innhold: aboutYou!!.stayedAbroadCountry!!,
                },
            },
            oppholdFra: aboutYou.stayedAbroadFromDate
                ? {
                      spoersmaal: t('stayedAbroadFromDate', { ns: 'aboutYou' }),
                      svar: {
                          innhold: aboutYou.stayedAbroadFromDate!!,
                      },
                  }
                : undefined,
            oppholdTil: aboutYou.stayedAbroadToDate
                ? {
                      spoersmaal: t('stayedAbroadToDate', { ns: 'aboutYou' }),
                      svar: {
                          innhold: aboutYou.stayedAbroadToDate!!,
                      },
                  }
                : undefined,
        }
    } else if (!!bosattNorge) {
        bosattNorge.opplysning = undefined
    }

    const ukjentForelder: Opplysning<string> | undefined = !!application.unknownParent
        ? {
              spoersmaal: t(isChild ? 'unknownParentQuestion' : 'unknownParentQuestionGuardian', {
                  ns: 'aboutParents',
              }),
              svar: t(isChild ? 'yesUnknownParent' : 'yesUnknownParentGuardian', { ns: 'btn' }),
          }
        : undefined

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
        ukjentForelder,
        utenlandsAdresse,
        bosattNorge,
    }
}

const mapSoesken = (t: TFunction, child: IChild, application: IApplication, user: User): Barn[] => {
    const allChildren: IChild[] = application.aboutChildren!!.children!!

    // TODO: Sjekke at dette fungerer som forventet
    return allChildren
        .filter((c: IChild) => c.fnrDnr !== child.fnrDnr)
        .map((c: IChild) => mapBarn(t, c, application, user))
}

const mapSamtykke = (t: TFunction, application: IApplication): Opplysning<boolean> => {
    if (!application.applicant!!.consent) throw Error('Kan ikke sende inn søknad uten å ha samtykket!')

    return {
        spoersmaal: t('consentToNav', { ns: 'frontPage' }),
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
