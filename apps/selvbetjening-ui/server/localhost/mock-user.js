
const personalia = {
    adresse: "Fyrstikkaléen 1",
    husnummer: 1,
    husbokstav: null,
    postnummer: "0758",
    poststed: "Oslo",
    statsborgerskap: "Norsk",
    sivilstatus: "Ugift"
}

const SEDAT_RIPSBÆRBUSK = {
    fornavn: "SEDAT",
    etternavn: "RIPSBÆRBUSK",
    foedselsnummer: "26117512737",
    foedselsaar: 1975,
    foedselsdato: new Date(1975, 10, 26),
    ...personalia
};

const NOBEL_TØFFELDYR = {
    fornavn: "NOBEL",
    etternavn: "TØFFELDYR",
    foedselsnummer: "24116324268",
    foedselsaar: 1963,
    foedselsdato: new Date(1963, 10, 24),
    ...personalia
}

const STOR_SNERK = {
    fornavn: "STOR",
    etternavn: "SNERK",
    foedselsnummer: "11057523044",
    foedselsaar: 1975,
    foedselsdato: new Date(1975, 4, 11),
    ...personalia
}

module.exports = {
    SEDAT_RIPSBÆRBUSK,
    NOBEL_TØFFELDYR,
    STOR_SNERK
};
