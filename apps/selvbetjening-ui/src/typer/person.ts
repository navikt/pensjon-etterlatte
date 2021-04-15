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

export interface ISoeker {
    foedselsnummer?: string;
    navn?: INavn;
    bosted?: IBosted;
    sivilstatus?: string;
    statsborgerskap?: string;
    kontaktinfo?: IKontaktinfo;
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
