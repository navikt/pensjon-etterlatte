import { IValg } from "./Spoersmaal";

export enum Sivilstatus {
    ekteskap = "nySivilstatus.ekteskap",
    samboerskap = "nySivilstatus.samboerskap",
    ingen = "nySivilstatus.ingen"
}

export enum OpploesningAarsak {
    doedsfall = "opploesningAarsak.doedsfall",
    skilsmisse = "opploesningAarsak.skilsmisse",
    samlivsbrudd = "opploesningAarsak.samlivsbrudd",
}

export enum ForholdTilAvdoede {
    gift = "avdoede.relasjon.gift",
    samboer = "avdoede.relasjon.samboer",
    skilt = "avdoede.relasjon.skilt",
    tidligereSamboer = "avdoede.relasjon.tidligereSamboer",
    ingen = "avdoede.relasjon.ingen"
}

export enum AvdoedInntekt {
    selvstendigNaeringsdrivende = "avdoedInntekt.selvstendigNaeringsdrivende",
    arbeidstaker = "avdoedInntekt.arbeidstaker",
    selvstendigOgArbeidstaker = "avdoedInntekt.selvstendigOgArbeidstaker",
    ingenInntekt = "avdoedInntekt.ingenInntekt"
}

export enum BarnRelasjon {
    fellesbarnMedAvdoede = "barn.relasjon.fellesbarnMedAvdoede",
    avdoedesSaerkullsbarn = "barn.relasjon.avdoedesSaerkullsbarn",
    egneSaerkullsbarn = "barn.relasjon.egneSaerkullsbarn",
}

export interface IBarn {
    fornavn?: string;
    etternavn?: string;
    foedselsnummer?: string;
    brukeAnnenKonto?: {
        svar?: IValg;
        kontonummer?: string;
    };
    relasjon?: string;
    bosattUtland?: {
        svar?: IValg;
        statsborgerskap?: string;
        land?: string;
    };
}

export interface IOppholdUtland {
    land?: string;
    fraDato?: Date;
    tilDato?: Date;
    beskrivelse?: string[];
}

export interface IAvdoed {
    foedselsnummer?: string;
    statsborgerskap?: string;
    boddEllerJobbetUtland?: {
        svar?: IValg;
        oppholdUtland?: IOppholdUtland[];
    }
    selvstendigNaeringsdrivende?: {
        svar?: IValg;
        beskrivelse?: string;
    }
    medlemFolketrygdUtland?: IValg;
    haddePensjonsgivendeInntekt?: {
        svar?: IValg;
        beskrivelse?: string;
    }
    mottokPensjonAndreLand?: {
        svar?: IValg;
        beskrivelse?: string;
    }
    harAvtjentMilitaerTjeneste?: {
        svar?: IValg;
        beskrivelse?: string;
    }
}

export enum SamboerInntekt {
    arbeidsinntekt = "arbeidsinntekt",
    pensjon = "pensjon",
    kapitalinntekt = "kapitalinntekt",
    andreYtelser = "andreYtelser",
}

export interface ISamboer {
    navn?: string;
    foedselsnummer?: string;
    hattBarnEllerVaertGift?: IValg;
    harInntekt?: {
        svar?: IValg;
        inntektstype?: SamboerInntekt[];
        samletBruttoinntektPrAar?: string;
    }
}

export interface IKontaktinfo {
    telefonnummer?: string;
    epost?: string;
}

export interface INySivilstatus {
    inngaatt?: {
        svar?: string;
        dato?: Date;
    };
    fremdelesGift?: IValg;
    samboerskapOpploest?: IValg;
    opploestDato?: Date;
    aarsakForOpploesningen?: string;
}

export interface IForholdAvdoede {
    relasjon?: string; // 2.9
    datoForInngaattPartnerskap?: Date;
    datoForSkilsmisse?: Date;
    datoForInngaattSamboerskap?: Date;
    datoForSamlivsbrudd?: Date;
    fellesBarn?: IValg;
    omsorgForBarn?: IValg;
    tidligereGift?: IValg;
    mottokBidrag?: IValg;
}

export interface ISoeker {
    bostedsadresseBekreftet?: IValg;
    alternativAdresse?: string;
    kontaktinfo?: IKontaktinfo;
    kontonummer?: string; // 2.8
    flyktning?: IValg;
    oppholderSegINorge?: IValg; // 2.7
    oppholdsland?: string; // 2.7
    medlemFolketrygdenUtland?: IValg;
    nySivilstatus?: INySivilstatus;
    samboer?: ISamboer; // 2.16
}

export interface ISoekerOgAvdoed {
    avdoed?: {
        fornavn?: string;
        etternavn?: string;
        datoForDoedsfallet?: Date;
        doedsfallAarsak?: string;
    }
    forholdTilAvdoede?: IForholdAvdoede;
}
