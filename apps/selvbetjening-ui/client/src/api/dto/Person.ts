/* PERSON */

import {
    AarstallForMilitaerTjeneste,
    AndreYtelser,
    AnnenUtdanning,
    ArbeidOgUtdanning,
    BetingetOpplysning,
    Foedselsnummer, ForholdTilAvdoede, HoeyesteUtdanning,
    Kontaktinfo, Naeringsinntekt,
    OppholdUtland,
    Opplysning, SamboerInntekt,
    SivilstatusType,
    Svar, Utenlandsadresse, Utenlandsopphold
} from "./InnsendtSoeknad";

export enum PersonType {
    INNSENDER = "INNSENDER",
    GJENLEVENDE = "GJENLEVENDE",
    AVDOED = "AVDOED",
    SAMBOER = "SAMBOER",
    VERGE = "VERGE",
    BARN = "BARN",
    FORELDER = "FORELDER",
    GJENLEVENDE_FORELDER = "GJENLEVENDE_FORELDER",
}

export enum OmsorgspersonType {
    GJENLEVENDE = "GJENLEVENDE",
    VERGE = "VERGE",
    ANNET = "ANNET"
}

export interface Person {
    type: PersonType;
    fornavn: String;
    etternavn: String;
    foedselsnummer: Foedselsnummer;
}

export interface Innsender extends Person {
    type: PersonType.INNSENDER;

    fornavn: String;
    etternavn: String;
    foedselsnummer: Foedselsnummer;
}


export interface Forelder extends Person {
    type: PersonType.FORELDER;

    fornavn: String;
    etternavn: String;
    foedselsnummer: Foedselsnummer;
}

export interface GjenlevendeForelder extends Person {
    type: PersonType.GJENLEVENDE_FORELDER;

    fornavn: String;
    etternavn: String;
    foedselsnummer: Foedselsnummer;

    statsborgerskap: Opplysning<String>;
    adresse?: Opplysning<String>;
    kontaktinfo: Kontaktinfo;
}

export interface Gjenlevende extends Person {
    type: PersonType.GJENLEVENDE;

    fornavn: String;
    etternavn: String;
    foedselsnummer: Foedselsnummer;

    statsborgerskap: String;
    sivilstatus: String

    adresse?: Opplysning<String>;
    bostedsAdresse?: BetingetOpplysning<Svar, Opplysning<String>>;
    kontaktinfo: Kontaktinfo;
    flyktning?: Opplysning<Svar>;
    oppholdUtland?: BetingetOpplysning<Svar, OppholdUtland>;
    nySivilstatus?: BetingetOpplysning<SivilstatusType, Samboer>;
    arbeidOgUtdanning: ArbeidOgUtdanning;
    fullfoertUtdanning?: BetingetOpplysning<HoeyesteUtdanning, Opplysning<AnnenUtdanning>>;
    andreYtelser: AndreYtelser;
    uregistrertEllerVenterBarn: Opplysning<Svar>;
    forholdTilAvdoede: ForholdTilAvdoede;
}

export interface Barn extends Person {
    type: PersonType.BARN

    fornavn: String;
    etternavn: String;
    foedselsnummer: Foedselsnummer;

    statsborgerskap: Opplysning<String>;
    utenlandsAdresse?: BetingetOpplysning<Svar, Utenlandsadresse | undefined>;
    foreldre: Forelder[];
    verge?: BetingetOpplysning<Svar, Verge>;
    dagligOmsorg?: Opplysning<OmsorgspersonType>
}

export interface Avdoed extends Person {
    type: PersonType.AVDOED;

    fornavn: String;
    etternavn: String;
    foedselsnummer: Foedselsnummer;

    datoForDoedsfallet: Opplysning<Date>;
    statsborgerskap: Opplysning<String>;
    utenlandsopphold: BetingetOpplysning<Svar, Utenlandsopphold[] | undefined>;
    naeringsInntekt: BetingetOpplysning<Svar, Naeringsinntekt>;                 // Ikke nødvendig nytt regelverk for barnep.
    militaertjeneste: BetingetOpplysning<Svar, Opplysning<AarstallForMilitaerTjeneste>>;    // Ikke nødvendig nytt regelverk for barnep.
    doedsaarsakSkyldesYrkesskadeEllerYrkessykdom: Opplysning<Svar>;
}

export interface Verge extends Person {
    fornavn: String;
    etternavn: String;
    foedselsnummer: Foedselsnummer;
    type: PersonType.VERGE;
}

export interface Samboer extends Person {
    type: PersonType.SAMBOER;

    fornavn: String;
    etternavn: String;
    foedselsnummer: Foedselsnummer;

    fellesBarnEllertidligereGift: Opplysning<Svar>;
    inntekt?: BetingetOpplysning<Svar, SamboerInntekt | undefined>;
}
