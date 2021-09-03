import { IValg } from "./Spoersmaal";
import { IUtbetalingsInformasjon } from "./utbetaling";

export enum Sivilstatus {
    ingen = "nySivilstatus.ingen",
    ekteskap = "nySivilstatus.ekteskap",
    samboerskap = "nySivilstatus.samboerskap",
}

export enum OpploesningAarsak {
    doedsfall = "opploesningAarsak.doedsfall",
    skilsmisse = "opploesningAarsak.skilsmisse",
    samlivsbrudd = "opploesningAarsak.samlivsbrudd",
}

export enum ForholdTilAvdoede {
    gift = "avdoede.relasjon.gift",
    separert = "avdoede.relasjon.separert",
    samboer = "avdoede.relasjon.samboer",
    skilt = "avdoede.relasjon.skilt",
    tidligereSamboer = "avdoede.relasjon.tidligereSamboer",
}

export enum AvdoedInntekt {
    Ja = "avdoedInntekt.ja",
    nei = "avdoedInntekt.nei",
}

export enum BarnRelasjon {
    fellesbarnMedAvdoede = "barnRelasjon.fellesbarnMedAvdoede",
    avdoedesSaerkullsbarn = "barnRelasjon.avdoedesSaerkullsbarn",
    egneSaerkullsbarn = "barnRelasjon.egneSaerkullsbarn",
}

export enum GravidEllerNyligFoedt {
    venterEllerHarNyligFoedt = "gravidEllerNyligFoedt.venterEllerHarNyligFoedt",
    ingen = "gravidEllerNyligFoedt.ingen",
}

export enum OppholdUtlandType {
    bodd = "oppholdUtlandType.bodd",
    arbeidet = "oppholdUtlandType.arbeidet",
}

export interface IOmBarn {
    barn?: IBarn[];
    gravidEllerNyligFoedt?: GravidEllerNyligFoedt;
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
    statsborgerskap?: string;
    bosattUtland?: {
        svar?: IValg;
        land?: string;
        adresse?: string;
    };
    dagligOmsorg?: IValg;
    soekerBarnepensjon?: IValg.JA | undefined;
}

export interface IOppholdUtland {
    land?: string;
    fraDato?: Date;
    tilDato?: Date;
    beskrivelse?: OppholdUtlandType[];
    medlemFolketrygd?: IValg;
    mottokPensjon?: {
        svar?: IValg;
        beskrivelse?: string;
    };
}

export interface IAvdoed {
    foedselsnummer?: string;
    statsborgerskap?: string;
    boddEllerJobbetUtland?: {
        svar?: IValg;
        oppholdUtland?: IOppholdUtland[];
    };
    selvstendigNaeringsdrivende?: {
        svar?: IValg;
        beskrivelse?: string;
    };
    haddePensjonsgivendeInntekt?: {
        svar?: IValg;
        beskrivelse?: string;
    };
    harAvtjentMilitaerTjeneste?: {
        svar?: IValg;
        beskrivelse?: string;
    };
}

export enum SamboerInntekt {
    arbeidsinntekt = "samboerInntekt.arbeidsinntekt",
    pensjon = "samboerInntekt.pensjon",
    kapitalinntekt = "samboerInntekt.kapitalinntekt",
    andreYtelser = "samboerInntekt.andreYtelser",
}

export interface ISamboer {
    navn?: string;
    foedselsnummer?: string;
    harInntekt?: {
        svar?: IValg;
        inntektstype?: SamboerInntekt[];
        samletBruttoinntektPrAar?: string;
    };
}

export interface IKontaktinfo {
    telefonnummer?: string;
    epost?: string;
}

export interface INySivilstatus {
    sivilstatus?: string;
    ekteskap?: INyttEkteskap;
    samboerskap?: INyttSamboerskap;
}

export interface INyttSamboerskap {
    samboerskapOpploest?: IValg;
    aarsakForOpploesningen?: string;
    hattBarnEllerVaertGift?: IValg;
    inngaattDato?: Date;
    opploestDato?: Date;
    samboer?: ISamboer;
}

export interface INyttEkteskap {
    fremdelesGift?: IValg;
    aarsakForOpploesningen?: string;
    inngaattDato?: Date;
    opploestDato?: Date;
}

export interface IForholdAvdoede {
    relasjon?: string; // 2.9
    datoForInngaattPartnerskap?: Date;
    datoForSkilsmisse?: Date;
    datoForInngaattSamboerskap?: Date;
    datoForSamlivsbrudd?: Date;
    fellesBarn?: IValg;
    samboereMedFellesBarn?: IValg;
    omsorgForBarn?: IValg;
    tidligereGift?: IValg;
    mottokBidrag?: IValg;
    mottokEktefelleBidrag?: IValg;
}

export interface ISoeker {
    bostedsadresseBekreftet?: IValg;
    alternativAdresse?: string;
    kontaktinfo?: IKontaktinfo;
    utbetalingsInformasjon?: IUtbetalingsInformasjon;
    flyktning?: IValg;
    oppholderSegINorge?: IValg; // 2.7
    oppholdsland?: string; // 2.7
    medlemFolketrygdenUtland?: IValg;
    nySivilstatus?: INySivilstatus;
}

export interface ISoekerOgAvdoed {
    avdoed?: {
        fornavn?: string;
        etternavn?: string;
        datoForDoedsfallet?: Date;
        doedsfallAarsak?: string;
    };
    forholdTilAvdoede?: IForholdAvdoede;
}
