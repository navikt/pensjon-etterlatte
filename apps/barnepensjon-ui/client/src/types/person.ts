import { JaNeiVetIkke } from '../api/dto/FellesOpplysninger'

export interface IAboutChild {
    child?: IChild[]
    gravidEllerNyligFoedt?: JaNeiVetIkke
    erValidert?: boolean
}

export interface IChild {
    fornavn?: string
    etternavn?: string
    foedselsnummer?: string
    harBarnetVerge?: {
        svar?: JaNeiVetIkke
        fornavn?: string
        etternavn?: string
        foedselsnummer?: string
    }
    relasjon?: string
    statsborgerskap?: string
    bosattUtland?: {
        svar?: JaNeiVetIkke
        land?: string
        adresse?: string
    }
    dagligOmsorg?: JaNeiVetIkke
    barnepensjon?: {
        soeker?: JaNeiVetIkke.JA | undefined
        kontonummer?: {
            svar?: JaNeiVetIkke
            kontonummer?: string
        }
        forskuddstrekk?: {
            svar?: JaNeiVetIkke
            trekkprosent?: string
        }
    }
}

export enum ChildRelation {
    fellesbarnMedAvdoede = 'barnRelasjon.fellesbarnMedAvdoede',
    avdoedesSaerkullsbarn = 'barnRelasjon.avdoedesSaerkullsbarn',
    egneSaerkullsbarn = 'barnRelasjon.egneSaerkullsbarn',
}
