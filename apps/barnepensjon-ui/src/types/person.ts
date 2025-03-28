import { BankkontoType, JaNeiVetIkke } from '../api/dto/FellesOpplysninger'

export interface IAboutYou {
    addressOfResidenceConfirmed?: JaNeiVetIkke
    alternativeAddress?: string
    phoneNumber?: string
    paymentDetails?: IPaymentDetails
    residesInNorway?: JaNeiVetIkke
    countryOfResidence?: string
    stayedAbroad?: JaNeiVetIkke
    stayedAbroadCountry?: string
    stayedAbroadFromDate?: Date
    stayedAbroadToDate?: Date
    memberFolketrygdenAbroad?: JaNeiVetIkke
    disabilityBenefits?: JaNeiVetIkke
    workAssessmentAllowance?: JaNeiVetIkke
}

export interface IPaymentDetails {
    accountType: BankkontoType
    bankAccount?: string
    foreignBankName?: string
    foreignBankAddress?: string
    iban?: string
    swift?: string
}

export interface IAboutChildren {
    children?: IChild[]
    erValidert?: boolean
}

export interface IChild {
    firstName?: string
    lastName?: string
    fnrDnr?: string
    fnrIsUnknown?: boolean
    dateOfBirth?: string
    childHasGuardianship?: {
        answer?: JaNeiVetIkke
        firstName?: string
        lastName?: string
        fnr?: string
    }
    loggedInUserIsGuardian?: JaNeiVetIkke
    parents?: ParentRelationType
    citizenship?: string
    staysAbroad?: {
        answer?: JaNeiVetIkke
        country?: string
        address?: string
    }
    appliesForChildrensPension?: boolean
    paymentDetails?: IPaymentDetails
    disabilityBenefitsIsGuardian?: JaNeiVetIkke
    workAssessmentAllowanceIsGuardian?: JaNeiVetIkke
}

export enum ParentRelationType {
    FIRST_PARENT = 'FIRST_PARENT',
    SECOND_PARENT = 'SECOND_PARENT',
    BOTH = 'BOTH',
}
