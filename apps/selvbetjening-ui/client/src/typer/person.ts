import { IValg } from "./Spoersmaal";
import { IUtbetalingsInformasjon } from "./utbetaling";

export enum Sivilstatus {
    enslig = "nySivilstatus.enslig",
    ekteskap = "nySivilstatus.ekteskap",
    samboerskap = "nySivilstatus.samboerskap",
}

export enum ForholdTilAvdoede {
    gift = "avdoede.relasjon.gift",
    separert = "avdoede.relasjon.separert",
    samboer = "avdoede.relasjon.samboer",
    skilt = "avdoede.relasjon.skilt",
    tidligereSamboer = "avdoede.relasjon.tidligereSamboer",
}

export enum BarnRelasjon {
    fellesbarnMedAvdoede = "barnRelasjon.fellesbarnMedAvdoede",
    avdoedesSaerkullsbarn = "barnRelasjon.avdoedesSaerkullsbarn",
    egneSaerkullsbarn = "barnRelasjon.egneSaerkullsbarn",
}

export enum OppholdUtlandType {
    bodd = "oppholdUtlandType.bodd",
    arbeidet = "oppholdUtlandType.arbeidet",
}

export interface IOmBarn {
    barn?: IBarn[];
    gravidEllerNyligFoedt?: IValg;
    erValidert?: boolean;
}

export interface IBarn {
    fornavn?: string;
    etternavn?: string;
    foedselsnummer?: string;
    harBarnetVerge?: {
        svar?: IValg;
        fornavn?: string;
        etternavn?: string;
        foedselsnummer?: string;
    };
    relasjon?: string;
    statsborgerskap?: string;
    bosattUtland?: {
        svar?: IValg;
        land?: string;
        adresse?: string;
    };
    dagligOmsorg?: IValg;
    barnepensjon?: {
        soeker?: IValg.JA | undefined;
        kontonummer?: {
            svar?: IValg;
            kontonummer?: string;
        };
        forskuddstrekk?: {
            svar?: IValg;
            trekkprosent?: string;
        }
    }
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
    doedsfallAarsak?: IValg;
    erValidert?: boolean;
}

export interface IKontaktinfo {
    telefonnummer?: string;
}

export interface INySivilstatus {
    sivilstatus?: Sivilstatus;
    samboerskap?: INyttSamboerskap;
}

export interface INyttSamboerskap {
    hattBarnEllerVaertGift?: IValg;
    samboer?: ISamboer;
}

export interface ISamboer {
    fornavn?: string;
    etternavn?: string;
    foedselsnummer?: string;
    harInntekt?: {
        svar?: IValg;
        inntektstype?: SamboerInntekt[];
        samletBruttoinntektPrAar?: string;
    };
}

export enum SamboerInntekt {
    arbeidsinntekt = "samboerInntekt.arbeidsinntekt",
    pensjon = "samboerInntekt.pensjon",
    kapitalinntekt = "samboerInntekt.kapitalinntekt",
    andreYtelser = "samboerInntekt.andreYtelser",
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
    oppholderSegINorge?: IValg;
    oppholdsland?: string;
    medlemFolketrygdenUtland?: IValg;
    nySivilstatus?: INySivilstatus;
    erValidert?: boolean;
}

export interface ISoekerOgAvdoed {
    avdoed?: {
        fornavn?: string;
        etternavn?: string;
        datoForDoedsfallet?: Date;
    };
    forholdTilAvdoede?: IForholdAvdoede;
    erValidert?: boolean;
    nySivilstatus?: INySivilstatus
}
