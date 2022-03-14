import { BankkontoType, JaNeiVetIkke } from '../api/dto/FellesOpplysninger'

export interface IAboutYou {
    addressOfResidenceConfirmed?: JaNeiVetIkke
    alternativeAddress?: string
    phoneNumber?: string
    paymentDetails?: IPaymentDetails
    residesInNorway?: JaNeiVetIkke
    countryOfResidence?: string
    memberFolketrygdenAbroad?: JaNeiVetIkke
}

export interface IPaymentDetails {
    accountType: BankkontoType
    accountNumber?: string
    foreignBankName?: string
    foreignBankAddress?: string
    iban?: string
    swift?: string
    taxWithhold?: {
        answer?: JaNeiVetIkke
        taxPercentage?: string
    }
}

export interface IAboutChild {
    child?: IChild[]
    erValidert?: boolean
}

export interface IChild {
    firstName?: string
    lastName?: string
    fnrDnr?: string
    childHasGuardianship?: {
        answer?: JaNeiVetIkke
        firstName?: string
        lastName?: string
        fnr?: string
    }
    loggedInUserIsGuardian?: JaNeiVetIkke
    bothParents?: JaNeiVetIkke
    citizenship?: string
    staysAbroad?: {
        answer?: JaNeiVetIkke
        country?: string
        address?: string
    }
    childrensPension?: {
        applies?: JaNeiVetIkke.JA | undefined
        paymentDetails?: IPaymentDetails
    }
}
