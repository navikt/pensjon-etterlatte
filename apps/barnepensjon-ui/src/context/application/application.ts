import { BankkontoType, JaNeiVetIkke, OppholdUtlandType } from '../../api/dto/FellesOpplysninger'
import { ApplicantRole, ApplicantSituation } from '../../components/application/scenario/ScenarioSelection'
import { IAboutChildren, IAboutYou } from '../../types/person'
import { ISituationChild } from '../../types/situation'

export const emptyApplication: IApplication = {
    aboutYou: { paymentDetails: { accountType: BankkontoType.NORSK } },
}

export interface IApplication {
    meta?: IApplicationMeta
    applicant?: IApplicant
    aboutYou: IAboutYou
    yourSituation?: ISituationChild
    firstParent?: IParent | IDeceasedParent
    secondParent?: IParent | IDeceasedParent
    aboutChildren?: IAboutChildren
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
    firstName: string
    lastName: string
    fnrDnr: string
    citizenship: string
}

export interface ILivingParent extends IParent {
    address?: string
    phoneNumber?: string
}

export interface IDeceasedParent extends IParent {
    dateOfDeath: Date
    staysAbroad: IStaysAbroad
    selfEmplyment: ISelfEmployment
    occupationalInjury?: JaNeiVetIkke
    militaryService?: IMilitaryService
}

export interface IMilitaryService {
    completed: JaNeiVetIkke
    period?: string
}

export interface IStaysAbroad {
    hasStaysAbroad: JaNeiVetIkke
    abroadStays?: IAbroadStay[]
}

export interface IAbroadStay {
    country: string
    fromDate?: Date
    toDate?: Date
    type: OppholdUtlandType[]
    medlemFolketrygd: JaNeiVetIkke
    pensionAmount?: string
}

export interface ISelfEmployment {
    wasSelfEmployed: JaNeiVetIkke
    selfEmplymentDetails: {
        income?: string
        incomeAtDeath?: JaNeiVetIkke
    }
}
