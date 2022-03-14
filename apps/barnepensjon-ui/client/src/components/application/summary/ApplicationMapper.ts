import { TFunction } from 'i18next'
import { IAbroadStay, IDeceasedParent } from '../../../context/application/application'
import { User } from '../../../context/user/user'
import { IAboutChild, IAboutYou } from '../../../types/person'
import { ISituationChild } from '../../../types/situation'
import { StepPath } from '../../../types/steps'
import ObjectTreeReader, { Content, Element, Gruppe } from '../../../utils/ObjectTreeReader'

export default class ApplicationMapper {
    private otr: ObjectTreeReader
    private readonly t: TFunction

    constructor(t: any) {
        this.t = t
        this.otr = new ObjectTreeReader(t)
    }

    private sortArrayInPredefinedOrder(objectArray: Content[], predefinedArray: string[]): Content[] {
        return objectArray.sort((a, b) => {
            const index1 = predefinedArray.indexOf(a.key)
            const index2 = predefinedArray.indexOf(b.key)
            return (index1 > -1 ? index1 : Infinity) - (index2 > -1 ? index2 : Infinity)
        })
    }

    mapAboutYou(aboutYou: IAboutYou, user: User): Gruppe {
        const personalia = {
            name: `${user.fornavn} ${user.etternavn}`,
            fnr: user.foedselsnummer,
            address: !user.adressebeskyttelse
                ? `${user.adresse} ${user.husnummer}${user.husbokstav || ''}, ${user.postnummer} ${user.poststed}`
                : null,
            citizenship: user.statsborgerskap,
        }

        const predefinedArray = [
            'addressOfResidenceConfirmed',
            'alternativeAddress',
            'paymentDetails.accountType',
            'paymentDetails.foreignBankName',
            'paymentDetails.foreignBankAddress',
            'paymentDetails.iban',
            'paymentDetails.swift',
        ]

        return {
            title: this.t('title'),
            path: StepPath.AboutYou,
            elements: [
                {
                    title: this.t('subtitle.personalia'),
                    content: this.otr.traverse(personalia),
                },
                {
                    title: this.t('subtitle.informationAboutApplicant'),
                    content: this.sortArrayInPredefinedOrder(this.otr.traverse<IAboutYou>(aboutYou), predefinedArray),
                },
            ],
        }
    }

    mapAboutTheParent(aboutTheParent: IDeceasedParent): Gruppe {
        const stayAbroad: Element[] =
            aboutTheParent.staysAbroad?.abroadStays?.map((stayAbroad) => {
                const stay: IAbroadStay = {
                    country: stayAbroad.country,
                    fromDate: stayAbroad.fromDate,
                    toDate: stayAbroad.toDate,
                    medlemFolketrygd: stayAbroad.medlemFolketrygd,
                    pensionAmount: stayAbroad.pensionAmount,
                    type: stayAbroad.type,
                }

                return {
                    title: `Opphold i ${stay.country}`,
                    content: this.otr.traverse(stay),
                } as Element
            }) || []

        const predefinedArray = [
            'firstName',
            'lastName',
            'fnrDnr',
            'citizenship',
            'dateOfDeath',
            'abroadStays',
            'selfEmplyment',
            'occupationalInjury',
            'militaryService',
        ]

        return {
            title: this.t('title'),
            path: StepPath.AboutTheParents,
            elements: [
                {
                    content: this.sortArrayInPredefinedOrder(
                        this.otr.traverse<IDeceasedParent>({
                            ...aboutTheParent,
                            staysAbroad: { hasStaysAbroad: aboutTheParent.staysAbroad?.hasStaysAbroad },
                        }),
                        predefinedArray
                    ),
                },
                ...stayAbroad,
            ],
        }
    }

    mapYourSituation(yourSituation: ISituationChild): Gruppe {
        const predefinedArray = ['whyDoYouApply', 'timeUsedForEducation', 'doYouHaveIncome']

        return {
            title: this.t('title'),
            path: StepPath.YourSituation,
            elements: [
                {
                    content: this.sortArrayInPredefinedOrder(
                        this.otr.traverse<ISituationChild>(yourSituation),
                        predefinedArray
                    ),
                },
            ],
        }
    }

    mapAboutChildren(aboutChildren: IAboutChild): Gruppe {
        const child: Element[] =
            aboutChildren.child?.map((child) => {
                return {
                    title: `${child.firstName} ${child.lastName}`,
                    content: this.otr.traverse(child),
                } as Element
            }) || []

        return {
            title: this.t('aboutChildrenTitle'),
            path: StepPath.AboutChildren,
            elements: [
                ...child,
                {
                    content: this.otr.traverse<IAboutChild>({
                        ...aboutChildren,
                        child: undefined,
                        erValidert: undefined,
                    }),
                },
            ],
        }
    }
}
