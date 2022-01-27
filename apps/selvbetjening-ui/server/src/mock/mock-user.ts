
const personalia = {
    adresse: "Adresse-mock",
    husnummer: 1,
    husbokstav: null,
    postnummer: "0000",
    poststed: "Poststed-mock",
    statsborgerskap: "Statsborgerskap-mock",
    sivilstatus: "Sivilstatus-mock"
}

export const SEDAT_RIPSBÆRBUSK = {
    fornavn: "SEDAT",
    etternavn: "RIPSBÆRBUSK",
    foedselsnummer: "26117512737",
    foedselsaar: 1975,
    foedselsdato: new Date(1975, 10, 26),
    ...personalia
};

export const NOBEL_TØFFELDYR = {
    fornavn: "NOBEL",
    etternavn: "TØFFELDYR",
    foedselsnummer: "24116324268",
    foedselsaar: 1963,
    foedselsdato: new Date(1963, 10, 24),
    ...personalia
}

export const STOR_SNERK = {
    fornavn: "STOR",
    etternavn: "SNERK",
    foedselsnummer: "11057523044",
    foedselsaar: 1975,
    foedselsdato: new Date(1975, 4, 11),
    telefonnummer: "11111111",
    spraak: "nb",
    ...personalia
}

// For ung til å søke
export const TRIVIELL_MIDTPUNKT = {
    fornavn: "TRIVIELL",
    etternavn: "MIDTPUNKT",
    foedselsnummer: "19040550081",
    foedselsaar: 2005,
    foedselsdato: new Date(2005, 3, 19),
    ...personalia
};

// For gammel til å søke
export const KRAFTIG_GAPAHAUK = {
    fornavn: "KRAFTIG",
    etternavn: "GAPAHAUK",
    foedselsnummer: "26104500284",
    foedselsaar: 1945,
    foedselsdato: new Date(1945, 9, 26),
    ...personalia
}
