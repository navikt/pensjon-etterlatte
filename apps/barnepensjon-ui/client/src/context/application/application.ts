import { JaNeiVetIkke } from '../../api/dto/FellesOpplysninger'
import { IAboutChild } from '../../types/person'
import { ISituasjon } from '../../types/situation'

export interface IApplication {
    aboutChildren?: IAboutChild
    aboutYou?: any
    firstParent?: Parent
    secondParent?: Parent
    yourSituation?: ISituasjon
}

export enum ActionTypes {
    UPDATE_ABOUT_CHILDREN,
    UPDATE_ABOUT_YOU,
    UPDATE_FIRST_PARENT,
    UPDATE_SECOND_PARENT,
    RESET,
}

export interface IApplicationAction {
    type: ActionTypes
    payload?: any
}

export interface ApplicationProps {
    state: IApplication
    dispatch: (action: IApplicationAction) => void
}

export interface Parent {
    firstName: String
    lastName: String
    fnrDnr: String
    citizenship: String
}
export interface SurvivingParent extends Parent {}

export interface DeceasedParent extends Parent {
    dateOfDeath: Date
    abroadStays: {
        hasStaysAbroad: JaNeiVetIkke
    }
    selfEmplyment: {
        wasSelfEmployed: JaNeiVetIkke
        income?: String
        incomeAtDeath?: JaNeiVetIkke
    }
    occupationalInjury?: JaNeiVetIkke
    militaryService?: {
        completed?: JaNeiVetIkke
        period?: String
    }
}
