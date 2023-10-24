import { Barn, Person } from './Person'
import { BankkontoType, BetingetOpplysning, EnumSvar, Opplysning, UtbetalingsInformasjon } from './FellesOpplysninger'
import { Language } from '../../context/language/language'

export enum SoeknadType {
    BARNEPENSJON = 'BARNEPENSJON'
}

export interface SoeknadRequest {
    soeknader: InnsendtSoeknad[]
}

interface InnsendtSoeknad {
    type: SoeknadType
    spraak: Language

    innsender: Person
    harSamtykket: Opplysning<boolean>
    utbetalingsInformasjon?: BetingetOpplysning<EnumSvar<BankkontoType>, UtbetalingsInformasjon>
}

export interface Barnepensjon extends InnsendtSoeknad {
    soeker: Barn
    foreldre: Person[] | undefined
    soesken?: Barn[]
}
