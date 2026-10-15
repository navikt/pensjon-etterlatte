import { Language } from '../../i18n'
import {
    BankkontoType,
    BetingetOpplysning,
    EnumSvar,
    Opplysning,
    Stoenader,
    UtbetalingsInformasjon,
} from './FellesOpplysninger'
import { Avdoed, Barn, Gjenlevende, Person } from './Person'

export enum SoeknadType {
    OMSTILLINGSSTOENAD = 'OMSTILLINGSSTOENAD',
    UTVIDET_OMSTILLINGSSTOENAD = 'UTVIDET_OMSTILLINGSSTOENAD',
    BARNEPENSJON = 'BARNEPENSJON',
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

export interface Omstillingsstoenad extends InnsendtSoeknad {
    soeker: Gjenlevende
    avdoed: Avdoed
    barn: Barn[]
    andreStoenader: Opplysning<EnumSvar<Stoenader>>[]
}

export interface Barnepensjon extends InnsendtSoeknad {
    soeker: Barn
    foreldre: Person[] | undefined
    soesken: Barn[]
}
