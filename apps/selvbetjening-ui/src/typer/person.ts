import { IValg } from "./ISpoersmaal";

export interface IBarn {
    fornavn?: string;
    etternavn?: string;
    foedselsnummer?: string;
    foreldre?: string;
    bosattUtland?: IValg;
    statsborgerskap?: string;
    land?: string;
}

export interface INavn {
    fornavn: string;
    mellomnavn?: string;
    etternavn: string;
}

export interface IAvdoed {
    fornavn: string;
    etternavn: string;
    foedselsnummer: string;
    doedsdato: Date | null;
    statsborgerskap: string;
    bosetning?: IValg;
    doedsfallAarsak?: IValg;
    boddEllerJobbetUtland?: IValg;
    haddePensjonsgivendeInntekt?: IValg;
    pensjonsgivendeInntektSvar: string;
    haddePensjonAndreLand?: IValg;
    pensjonAndreLandSvar: string;
    harAvtjentMilitaerTjeneste?: IValg;
    avtjentMilitaerTjenesteSvar: string;
}

export interface ISamboer {
    erSamboer?: IValg;
    navn?: string;
    foedselsnummer?: string;
    hattBarnEllerVaertGift?: IValg;
    harInntekt?: IValg;
    inntektstype?: string[];
    samletBruttoinntektPrAar?: string;
}

export interface IKontaktinfo {
    telefonnummer?: string;
    epost?: string;
}

export interface INySivilstatus {
    nySivilstatusEtterDoedsfallet?: string; // 2.13
    datoForInngaaelse?: Date;
    nySivilstatusOpploest?: IValg; // 2.14
    aarsakForOpploesningen?: string; // 2.15
    datoForOpploesningen?: Date;
}

export interface IForholdAvdoed {
    forholdTilAvdoede?: string; // 2.9
    datoForInngaattPartnerskap?: Date | null;
    // hvis gjenlevende samboer:
    varSkiltFoerDoedsfall?: IValg; // 2.11
    datoForSkilsmisse?: Date | null; // hvis ja over
    mottokBidragFraAvdoede?: IValg; // 2.12
    bidragBeloepPrAar?: string; // hvis ja over
    hattBarnEllerVaertGift?: IValg;
}

export interface ISoeker {
    kontaktinfo?: IKontaktinfo;
    kontonummer?: string; // 2.8
    oppholderSegINorge?: IValg; // 2.7
    oppholdsland?: string; // 2.7
    medlemFolketrygdenUtland?: IValg;
    forholdTilAvdoed?: IForholdAvdoed;
    nySivilstatus?: INySivilstatus;
    samboer?: ISamboer; // 2.16
}
