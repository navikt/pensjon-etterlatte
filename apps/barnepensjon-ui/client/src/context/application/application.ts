import { BankkontoType, JaNeiVetIkke, OppholdUtlandType } from '../../api/dto/FellesOpplysninger'
import { ApplicantRole, ApplicantSituation } from '../../components/application/scenario/ScenarioSelection'
import { IAboutChild, IAboutYou } from '../../types/person'
import { ISituationChild } from '../../types/situation'

export const emptyApplication: IApplication = {
    aboutYou: { paymentDetails: { accountType: BankkontoType.NORSK } },
}
export interface IApplication {
    meta?: IApplicationMeta
    applicant?: IApplicant
    aboutChildren?: IAboutChild
    aboutYou: IAboutYou
    firstParent?: IParent | IDeceasedParent
    secondParent?: IParent | IDeceasedParent
    yourSituation?: ISituationChild
}

export enum ActionTypes {
    MOCK_PARENT_APPLICATION,
    MOCK_GUARDIAN_APPLICATION,
    MOCK_CHILD_APPLICATION,
    SET_APPLICATION,
    SAVE_APPLICATION,
    UPDATE_ABOUT_CHILDREN,
    UPDATE_APPLICANT,
    UPDATE_ABOUT_YOU,
    UPDATE_FIRST_PARENT,
    UPDATE_SECOND_PARENT,
    UPDATE_YOUR_SITUATION,
    RESET,
    CLOSE_CONTINUE_MODAL,
}

export interface IApplicationAction {
    type: ActionTypes
    payload?: any
}

export interface ApplicationProps {
    state: IApplication
    dispatch: (action: IApplicationAction) => void
}

export interface IApplicationMeta {
    readyForSaving?: boolean
    savedTimestamp?: Date
    showContinueModal?: boolean
    currentPath?: string
}

export interface IApplicant {
    consent: boolean
    applicantRole: ApplicantRole
    applicantSituation?: ApplicantSituation
}

export interface IParent {
    firstName: String
    lastName: String
    fnrDnr: String
    citizenship: String
}

export interface ILivingParent extends IParent {
    address: String
    phoneNumber?: String
}

export interface IDeceasedParent extends IParent {
    dateOfDeath: Date
    staysAbroad: {
        hasStaysAbroad?: JaNeiVetIkke
        abroadStays?: IAbroadStay[]
    }
    selfEmplyment: {
        wasSelfEmployed: JaNeiVetIkke
        income?: String
        incomeAtDeath?: JaNeiVetIkke
        selfEmplymentDetails: {
            income?: String
            incomeAtDeath?: JaNeiVetIkke
        }
    }
    occupationalInjury?: JaNeiVetIkke
    militaryService?: {
        completed?: JaNeiVetIkke
        period?: String
    }
}

export interface IAbroadStay {
    country: String
    fromDate?: Date
    toDate?: Date
    type: OppholdUtlandType[]
    medlemFolketrygd: JaNeiVetIkke
    pensionAmount?: String
}
