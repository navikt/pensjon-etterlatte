export interface IPerson {
    fornavn: string;
    etternavn: string;
    fødselsnummer: string;
    adresse: string;
    statsborgerskap: string;
    sivilstatus: string;
}

export interface IKontaktinfo {
    boadresseBekreftet?: string;
    telefonnummer?: string;
    epost?: string;
}
