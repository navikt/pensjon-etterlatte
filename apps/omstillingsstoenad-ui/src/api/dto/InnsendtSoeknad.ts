import { Person, Gjenlevende, Avdoed, Barn } from './Person'
import {
    Opplysning,
    BetingetOpplysning,
    BankkontoType,
    UtbetalingsInformasjon,
    EnumSvar,
    Stoenader,
} from './FellesOpplysninger'
import { Language } from '../../i18n'

export enum SoeknadType {
    OMSTILLINGSSTOENAD = 'OMSTILLINGSSTOENAD',
    BARNEPENSJON = 'BARNEPENSJON',
}

export interface SoeknadRequest {
    soeknader: InnsendtSoeknad[]
}

interface InnsendtSoeknad {
    type: SoeknadType
    spraak: Language

    innsender: Person
    harSamtykket: Opplysning<Boolean>
    utbetalingsInformasjon?: BetingetOpplysning<EnumSvar<BankkontoType>, UtbetalingsInformasjon>
}

export interface Gjenlevendepensjon extends InnsendtSoeknad {
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
