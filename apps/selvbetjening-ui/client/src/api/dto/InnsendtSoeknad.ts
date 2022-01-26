import { Person, Gjenlevende, Avdoed, Barn } from "./Person"
import { Opplysning, BetingetOpplysning, BankkontoType, UtbetalingsInformasjon, EnumSvar } from "./FellesOpplysninger";

export enum SoeknadType {
    GJENLEVENDEPENSJON = "GJENLEVENDEPENSJON",
    BARNEPENSJON = "BARNEPENSJON",
}

export interface SoeknadRequest {
    soeknader: InnsendtSoeknad[]
}

interface InnsendtSoeknad {
    type: SoeknadType;

    innsender: Person;
    harSamtykket: Opplysning<Boolean>;
    utbetalingsInformasjon?: BetingetOpplysning<EnumSvar<BankkontoType>, UtbetalingsInformasjon>;
}

export interface Gjenlevendepensjon extends InnsendtSoeknad {
    soeker: Gjenlevende;
    avdoed: Avdoed;
    barn: Barn[];
}

export interface Barnepensjon extends InnsendtSoeknad {
    soeker: Barn;
    foreldre: Person[] | undefined;
    soesken: Barn[];
}
