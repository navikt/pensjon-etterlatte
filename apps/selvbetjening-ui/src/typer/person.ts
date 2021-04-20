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

export interface IBosted {
    adresse?: string;
    boadresseBekreftet?: IValg;
    oppholderSegINorge?: IValg;
}

export interface ISamboer {
    erSamboer?: IValg;
    fornavn?: string;
    etternavn?: string;
    foedselsnummer?: string;
    hattBarnEllerVaertGift?: IValg;
    harInntekt?: IValg;
    inntektstype?: string;
    samletBruttoinntektPrAar?: string;
}

export interface ISoeker {
    foedselsnummer?: string;
    navn?: INavn;
    bosted?: IBosted;
    kontaktinfo?: IKontaktinfo;
    sivilstatus?: string; // Fjerne?
    statsborgerskap?: string; // 2.6
    oppholderSegINorge?: IValg; // 2.7
    kontonummer?: string; // 2.8
    forholdTilAvdoede?: string; // 2.9
    datoForInngaattPartnerskap?: Date | null;
    // hvis gjenlevende samboer:
    harHattBarnEllerVaertGift?: IValg; // 2.10
    varSkiltFoerDoedsfall?: IValg; // 2.11
    datoForSkilsmisse?: string; // hvis ja over
    mottokBidragFraAvdoede?: IValg; // 2.12
    bidragBeloepPrAar?: string; // hvis ja over
    nySivilstatusEtterDoedsfallet?: string; // 2.13
    datoForInngaaelse?: Date;
    nySivilstatusOpploest?: IValg; // 2.14
    aarsakForOpploesningen?: string; // 2.15
    datoForOpploesningen?: Date;
    samboer?: ISamboer; // 2.16
}

export interface IPdlPerson {
    fornavn: string;
    etternavn: string;
    foedselsnummer: string;
    adresse: string;
    statsborgerskap: string;
    sivilstatus: string;
}

export interface IKontaktinfo {
    telefonnummer?: string;
    epost?: string;
}
