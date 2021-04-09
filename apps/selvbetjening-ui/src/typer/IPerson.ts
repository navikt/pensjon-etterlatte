export interface IBarn {
    fornavn?: string;
    etternavn?: string;
    fødselsnummer?: string;
    foreldre?: string;
    bosattUtland?: string;
    statsborgerskapOgLand?: string;
}

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
    oppholderSegINorge?: string;
    telefonnummer?: string;
    epost?: string;
}
