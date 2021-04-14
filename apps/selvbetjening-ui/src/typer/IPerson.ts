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

export interface IPerson {
    fornavn: string;
    etternavn: string;
    foedselsnummer: string;
    adresse: string;
    statsborgerskap: string;
    sivilstatus: string;
}

export interface IKontaktinfo {
    boadresseBekreftet?: IValg;
    oppholderSegINorge?: IValg;
    telefonnummer?: string;
    epost?: string;
}
