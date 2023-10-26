import {
    BetingetOpplysning,
    EnumSvar,
    FritekstSvar,
    JaNeiVetIkke,
    Naeringsinntekt,
    OppholdUtlandType,
    Opplysning,
    Utenlandsopphold,
} from './FellesOpplysninger'
import { Avdoed, Forelder, GjenlevendeForelder, Person, PersonType } from './Person'
import {
    IAbroadStay,
    IApplication,
    IDeceasedParent,
    ILivingParent,
    IMilitaryService,
    IParent,
    ISelfEmployment,
    IStaysAbroad,
} from '../../context/application/application'
import { TFunction } from '../../hooks/useTranslation'
import { IAboutYou, IChild, ParentRelationType } from '../../types/person'
import { ApplicantRole, ApplicantSituation } from '../../components/application/scenario/ScenarioSelection'
import { User } from '../../context/user/user'
import { fullAdresse } from '../../utils/personalia'

export const hentForeldre = (t: TFunction, child: IChild, application: IApplication, user: User): Forelder[] => {
    let firstParent
    if (application?.applicant?.applicantRole === ApplicantRole.PARENT) {
        firstParent = mapForelderFraInnloggetBruker(t, application.aboutYou, user)
    } else {
        firstParent = application.firstParent!!
    }

    const forelder1 = mapTilForelder(t, firstParent)
    const forelder2 = mapTilForelder(t, application.secondParent!!)

    switch (child.parents) {
        case ParentRelationType.FIRST_PARENT:
            return [forelder1]
        case ParentRelationType.SECOND_PARENT:
            return [forelder2]
        case ParentRelationType.BOTH:
            return [forelder1, forelder2]
        default:
            throw Error(`Unexpected parent relation: ${child.parents}`)
    }
}

export const hentForeldreOver18 = (t: TFunction, application: IApplication): Forelder[] => {
    const oneParentDead = application.applicant?.applicantSituation === ApplicantSituation.ONE_PARENT_DECEASED
    const bothParentDead = application.applicant?.applicantSituation === ApplicantSituation.BOTH_PARENTS_DECEASED
    const hasUnknownParent = !!application.unknownParent

    if (oneParentDead) {
        return [mapTilForelder(t, application.secondParent!!)]
    } else if (hasUnknownParent) {
        return [mapTilForelder(t, application.firstParent!!)]
    } else if (bothParentDead) {
        const firstParent = mapTilForelder(t, application.firstParent!!)
        const secondParent = mapTilForelder(t, application.secondParent!!)
        return [firstParent, secondParent]
    } else {
        throw Error(`Unexpected parent relation: ${application.secondParent}`)
    }
}

const mapTilForelder = (t: TFunction, parent: IParent): Forelder => ({
    type: PersonType.FORELDER,
    fornavn: {
        spoersmaal: t('firstName', { ns: 'common' }),
        svar: parent!!.firstName,
    },
    etternavn: {
        spoersmaal: t('lastName', { ns: 'common' }),
        svar: parent!!.lastName,
    },
    foedselsnummer: {
        spoersmaal: t('fnrDnr', { ns: 'common' }),
        svar: parent!!.fnrDnr,
    },
})

export const mapForeldreMedUtvidetInfo = (t: TFunction, application: IApplication, user: User): Person[] => {
    if (application.applicant?.applicantRole === ApplicantRole.CHILD) {
        let avdoed1: Avdoed
        if (application.unknownParent) {
            avdoed1 = mapAvdoed(t, application.firstParent as IDeceasedParent)
        } else {
            avdoed1 = mapAvdoed(t, application.secondParent as IDeceasedParent)
            if (application.applicant.applicantSituation === ApplicantSituation.BOTH_PARENTS_DECEASED) {
                const avdoed2: Avdoed = mapAvdoed(t, application.secondParent as IDeceasedParent)
                return [avdoed1, avdoed2]
            }
        }

        return [avdoed1]
    }

    let forelder1
    if (!!(application.firstParent as IDeceasedParent)?.dateOfDeath) {
        forelder1 = mapAvdoed(t, application.firstParent as IDeceasedParent)
    } else {
        if (application.applicant?.applicantRole === ApplicantRole.PARENT) {
            const livingParent = mapForelderFraInnloggetBruker(t, application.aboutYou, user)

            forelder1 = mapGjenlevendeForelder(t, livingParent)
        } else {
            forelder1 = mapGjenlevendeForelder(t, application.firstParent as ILivingParent)
        }
    }

    const avdoed: Avdoed = mapAvdoed(t, application.secondParent as IDeceasedParent)

    return [forelder1, avdoed]
}

const mapForelderFraInnloggetBruker = (t: TFunction, aboutYou: IAboutYou, user: User): ILivingParent => ({
    firstName: user.fornavn!!,
    lastName: user.etternavn!!,
    fnrDnr: user.foedselsnummer!!,
    citizenship: user.statsborgerskap!!,
    address: fullAdresse(user),
    phoneNumber: user.telefonnummer || aboutYou.phoneNumber,
})

const mapGjenlevendeForelder = (t: TFunction, livingParent: ILivingParent): GjenlevendeForelder => ({
    type: PersonType.GJENLEVENDE_FORELDER,
    fornavn: {
        spoersmaal: t('firstName', { ns: 'common' }),
        svar: livingParent.firstName,
    },
    etternavn: {
        spoersmaal: t('lastName', { ns: 'common' }),
        svar: livingParent.lastName,
    },
    foedselsnummer: {
        spoersmaal: t('fnrDnr', { ns: 'common' }),
        svar: livingParent.fnrDnr,
    },
    statsborgerskap: {
        spoersmaal: t('citizenship', { ns: 'common' }),
        svar: livingParent.citizenship,
    },
    adresse: {
        spoersmaal: t('address', { ns: 'common' }),
        svar: livingParent.address || '-',
    },
    kontaktinfo: {
        telefonnummer: {
            spoersmaal: t('phoneNumber', { ns: 'common' }),
            svar: {
                innhold: livingParent.phoneNumber || '-',
            },
        },
    },
})

const mapAvdoed = (t: TFunction, parent: IDeceasedParent): Avdoed => {
    return {
        type: PersonType.AVDOED,

        fornavn: {
            spoersmaal: t('firstName', { ns: 'common' }),
            svar: parent.firstName!!,
        },
        etternavn: {
            spoersmaal: t('lastName', { ns: 'common' }),
            svar: parent.lastName!!,
        },
        foedselsnummer: {
            spoersmaal: t('fnrDnr', { ns: 'common' }),
            svar: parent.fnrDnr!!,
        },

        datoForDoedsfallet: {
            spoersmaal: t('dateOfDeath', { ns: 'aboutTheDeceased' }),
            svar: {
                innhold: parent.dateOfDeath!!,
            },
        },
        statsborgerskap: {
            spoersmaal: t('citizenship', { ns: 'common' }),
            svar: {
                innhold: parent.citizenship!!,
            },
        },
        utenlandsopphold: mapUtenlandsopphold(t, parent.staysAbroad),
        naeringsInntekt: mapNaeringsinntekt(t, parent.selfEmplyment),
        militaertjeneste: mapMilitaertjeneste(t, parent.militaryService),
        doedsaarsakSkyldesYrkesskadeEllerYrkessykdom: {
            spoersmaal: t('occupationalInjury', { ns: 'aboutTheDeceased' }),
            svar: {
                innhold: t(parent.occupationalInjury!!, { ns: 'radiobuttons' }),
                verdi: parent.occupationalInjury!!,
            },
        },
    }
}

const mapMilitaertjeneste = (t: TFunction, militaryService?: IMilitaryService) => {
    if (!militaryService) return undefined

    let opplysningMilitaertjeneste: Opplysning<FritekstSvar> | undefined
    if (militaryService.completed === JaNeiVetIkke.JA) {
        opplysningMilitaertjeneste = {
            spoersmaal: t('militaryServiceYears', { ns: 'aboutTheDeceased' }),
            svar: {
                innhold: militaryService.period || '-',
            },
        }
    }

    return {
        spoersmaal: t('deceasedHasServedInTheMilitary', { ns: 'aboutTheDeceased' }),
        svar: {
            innhold: t(militaryService!!.completed!!, { ns: 'radiobuttons' }),
            verdi: militaryService!!.completed!!,
        },
        opplysning: opplysningMilitaertjeneste,
    }
}

const mapUtenlandsopphold = (t: TFunction, staysAbroad: IStaysAbroad) => {
    let oppholdUtland: Utenlandsopphold[] | undefined

    if (staysAbroad?.hasStaysAbroad === JaNeiVetIkke.JA) {
        oppholdUtland =
            staysAbroad?.abroadStays?.map((info: IAbroadStay) => {
                const oppholdsTypeListe: EnumSvar<OppholdUtlandType>[] =
                    info.type?.map((type) => ({
                        verdi: type,
                        innhold: t(type),
                    })) || []

                const utenlandsopphold: Utenlandsopphold = {
                    land: {
                        spoersmaal: t('abroadInWhichCountry', {
                            ns: 'aboutTheDeceased',
                        }),
                        svar: {
                            innhold: info.country!!,
                        },
                    },
                    fraDato: info.fromDate
                        ? {
                              spoersmaal: t('stayedAbroadFromDate', {
                                  ns: 'aboutTheDeceased',
                              }),
                              svar: {
                                  innhold: info.fromDate!!,
                              },
                          }
                        : undefined,
                    tilDato: info.toDate
                        ? {
                              spoersmaal: t('stayedAbroadToDate', {
                                  ns: 'aboutTheDeceased',
                              }),
                              svar: {
                                  innhold: info.toDate!!,
                              },
                          }
                        : undefined,
                    oppholdsType: {
                        spoersmaal: t('livedOrWorkedAbroad', {
                            ns: 'aboutTheDeceased',
                        }),
                        svar: oppholdsTypeListe,
                    },
                    medlemFolketrygd: {
                        spoersmaal: t('deceasedWasMemberOfFolketrygdenAbroad', {
                            ns: 'aboutTheDeceased',
                        }),
                        svar: {
                            innhold: t(info.medlemFolketrygd!!, { ns: 'radiobuttons' }),
                            verdi: info.medlemFolketrygd!!,
                        },
                    },
                    pensjonsutbetaling: {
                        spoersmaal: t('pensionReceivedFromAbroad', {
                            ns: 'aboutTheDeceased',
                        }),
                        svar: {
                            innhold: info.pensionAmount || '-',
                        },
                    },
                }

                return utenlandsopphold
            }) || []
    }

    return {
        spoersmaal: t('didTheDeceasedLiveAbroad', { ns: 'aboutTheDeceased' }),
        svar: {
            innhold: t(staysAbroad.hasStaysAbroad!!, { ns: 'radiobuttons' }),
            verdi: staysAbroad.hasStaysAbroad!!,
        },
        opplysning: oppholdUtland,
    }
}

const mapNaeringsinntekt = (
    t: TFunction,
    selfEmployment: ISelfEmployment
): BetingetOpplysning<EnumSvar<JaNeiVetIkke>, Naeringsinntekt> | undefined => {
    if (!selfEmployment?.wasSelfEmployed) return undefined

    let opplysningNaeringsInntekt: Naeringsinntekt | undefined
    if (selfEmployment?.wasSelfEmployed === JaNeiVetIkke.JA) {
        opplysningNaeringsInntekt = {
            naeringsinntektPrAarFoerDoedsfall: {
                spoersmaal: t('incomeFromSelfEmployymentYearBeforeDeath', { ns: 'aboutTheDeceased' }),
                svar: {
                    innhold: selfEmployment.selfEmplymentDetails?.income || '-',
                },
            },
            naeringsinntektVedDoedsfall: {
                spoersmaal: t('hadIncomeFromSelfEmployment', { ns: 'aboutTheDeceased' }),
                svar: {
                    innhold: t(selfEmployment.selfEmplymentDetails?.incomeAtDeath!!, { ns: 'radiobuttons' }),
                    verdi: selfEmployment.selfEmplymentDetails?.incomeAtDeath!!,
                },
            },
        }
    }

    return {
        spoersmaal: t('wasTheDeceasedSelfEmployed', { ns: 'aboutTheDeceased' }),
        svar: {
            innhold: t(selfEmployment!!.wasSelfEmployed, { ns: 'radiobuttons' }),
            verdi: selfEmployment!!.wasSelfEmployed,
        },
        opplysning: opplysningNaeringsInntekt,
    }
}

export const _test = {
    mapTilForelder,
    mapForelderFraInnloggetBruker,
    mapGjenlevendeForelder,
    mapAvdoed,
    mapMilitaertjeneste,
    mapUtenlandsopphold,
    mapNaeringsinntekt,
}
