import {
    EnumSvar,
    FritekstSvar,
    JaNeiVetIkke,
    Naeringsinntekt,
    OppholdUtlandType,
    Opplysning,
    Utenlandsopphold,
} from './FellesOpplysninger'
import { Avdoed, Forelder, GjenlevendeForelder, Person, PersonType } from './Person'
import { IAbroadStay, IApplication, IDeceasedParent, ILivingParent } from '../../context/application/application'
import { TFunction } from '../../hooks/useTranslation'
import { IChild } from '../../types/person'

export const hentForeldre = (t: TFunction, child: IChild, application: IApplication): Forelder[] => {
    const forelder1: Forelder = {
        type: PersonType.FORELDER,
        fornavn: {
            spoersmaal: t('firstName', { ns: 'common' }),
            svar: application.firstParent!!.firstName,
        },
        etternavn: {
            spoersmaal: t('lastName', { ns: 'common' }),
            svar: application.firstParent!!.lastName,
        },
        foedselsnummer: {
            spoersmaal: t('fnrDnr', { ns: 'common' }),
            svar: application.firstParent!!.fnrDnr,
        },
    }

    const forelder2: Forelder = {
        type: PersonType.FORELDER,
        fornavn: {
            spoersmaal: t('firstName', { ns: 'common' }),
            svar: application.secondParent!!.firstName,
        },
        etternavn: {
            spoersmaal: t('lastName', { ns: 'common' }),
            svar: application.secondParent!!.lastName,
        },
        foedselsnummer: {
            spoersmaal: t('fnrDnr', { ns: 'common' }),
            svar: application.secondParent!!.fnrDnr,
        },
    }

    return [forelder1, forelder2]
}

export const mapForeldreMedUtvidetInfo = (t: TFunction, child: IChild, application: IApplication): Person[] => {
    let forelder1
    if ((application.firstParent as IDeceasedParent).dateOfDeath) {
        forelder1 = mapAvdoed(t, application.firstParent as IDeceasedParent)
    } else {
        forelder1 = mapGjenlevendeForelder(t, application.firstParent as ILivingParent)
    }

    const avdoed: Avdoed = mapAvdoed(t, application.secondParent as IDeceasedParent)

    return [forelder1, avdoed]
}

const mapGjenlevendeForelder = (t: TFunction, livingParent: ILivingParent): GjenlevendeForelder => {
    return {
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
            svar: livingParent.address,
        },
        kontaktinfo: {
            telefonnummer: {
                spoersmaal: t('phoneNumber', { ns: 'common' }),
                svar: {
                    innhold: livingParent.phoneNumber || '-',
                },
            },
        },
    }
}

const mapAvdoed = (t: TFunction, parent: IDeceasedParent): Avdoed => {
    let oppholdUtland: Utenlandsopphold[] | undefined

    if (parent.staysAbroad?.hasStaysAbroad === JaNeiVetIkke.JA) {
        oppholdUtland =
            parent.staysAbroad?.abroadStays?.map((info: IAbroadStay) => {
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

    let opplysningNaeringsInntekt: Naeringsinntekt | undefined
    if (parent.selfEmplyment?.wasSelfEmployed === JaNeiVetIkke.JA) {
        opplysningNaeringsInntekt = {
            naeringsinntektPrAarFoerDoedsfall: {
                spoersmaal: t('incomeFromSelfEmployymentYearBeforeDeath', { ns: 'aboutTheDeceased' }),
                svar: {
                    innhold: `${parent.selfEmplyment?.income}`,
                },
            },
            naeringsinntektVedDoedsfall: {
                spoersmaal: t('hadIncomeFromSelfEmployment', { ns: 'aboutTheDeceased' }),
                svar: {
                    innhold: t(parent.selfEmplyment.incomeAtDeath!!, { ns: 'radiobuttons' }),
                    verdi: parent.selfEmplyment.incomeAtDeath!!,
                },
            },
        }
    }

    let opplysningMilitaertjeneste: Opplysning<FritekstSvar> | undefined
    if (parent.militaryService?.completed === JaNeiVetIkke.JA) {
        opplysningMilitaertjeneste = {
            spoersmaal: t('militaryServiceYears', { ns: 'aboutTheDeceased' }),
            svar: {
                innhold: parent.militaryService?.period || '-',
            },
        }
    }

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
        utenlandsopphold: {
            spoersmaal: t('didTheDeceasedLiveAbroad', { ns: 'aboutTheDeceased' }),
            svar: {
                innhold: t(parent.staysAbroad.hasStaysAbroad!!, { ns: 'radiobuttons' }),
                verdi: parent.staysAbroad.hasStaysAbroad!!,
            },
            opplysning: oppholdUtland,
        },
        naeringsInntekt: {
            spoersmaal: t('wasTheDeceasedSelfEmployed', { ns: 'aboutTheDeceased' }),
            svar: {
                innhold: t(parent.selfEmplyment?.wasSelfEmployed, { ns: 'radiobuttons' }),
                verdi: parent.selfEmplyment?.wasSelfEmployed,
            },
            opplysning: opplysningNaeringsInntekt,
        },
        militaertjeneste: {
            spoersmaal: t('deceasedHasServedInTheMilitary', { ns: 'aboutTheDeceased' }),
            svar: {
                innhold: t(parent.militaryService!!.completed!!, { ns: 'radiobuttons' }),
                verdi: parent.militaryService!!.completed!!,
            },
            opplysning: opplysningMilitaertjeneste,
        },
        doedsaarsakSkyldesYrkesskadeEllerYrkessykdom: {
            spoersmaal: t('occupationalInjury', { ns: 'aboutTheDeceased' }),
            svar: {
                innhold: t(parent.occupationalInjury!!, { ns: 'radiobuttons' }),
                verdi: parent.occupationalInjury!!,
            },
        },
    }
}
