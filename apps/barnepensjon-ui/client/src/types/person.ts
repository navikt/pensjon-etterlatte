import { JaNeiVetIkke } from '../api/dto/FellesOpplysninger'

export interface IAboutChild {
    child?: IChild[]
    gravidEllerNyligFoedt?: JaNeiVetIkke
    erValidert?: boolean
}

export interface IChild {
    firstName?: string
    lastName?: string
    foedselsnummer?: string
    childHasGuardianship?: {
        answer?: JaNeiVetIkke
        firstName?: string
        lastName?: string
        foedselsnummer?: string
    }
    relation?: string
    citizenship?: string
    staysAbroad?: {
        answer?: JaNeiVetIkke
        country?: string
        address?: string
    }
    dailyCare?: JaNeiVetIkke
    childrensPension?: {
        applies?: JaNeiVetIkke.JA | undefined
        bankAccount?: {
            answer?: JaNeiVetIkke
            bankAccount?: string
        }
        taxWithhold?: {
            answer?: JaNeiVetIkke
            trekkprosent?: string
        }
    }
}

export enum ChildRelation {
    fellesbarnMedAvdoede = 'childrenRelation.fellesbarnMedAvdoede',
    avdoedesSaerkullsbarn = 'childrenRelation.avdoedesSaerkullsbarn',
    egneSaerkullsbarn = 'childrenRelation.egneSaerkullsbarn',
}
