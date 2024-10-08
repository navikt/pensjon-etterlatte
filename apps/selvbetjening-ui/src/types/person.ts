export interface IInnloggetBruker {
    fornavn?: string
    etternavn?: string
    foedselsnummer?: string
    foedselsaar?: number
    foedselsdato?: Date
    alder?: number
    kanSoeke?: boolean
    adresse?: string
    husnummer?: string
    husbokstav?: string
    postnummer?: string
    poststed?: string
    statsborgerskap?: string
    sivilstatus?: string
    adressebeskyttelse?: boolean
    telefonnummer?: string
    spraak?: string
}

export enum Alder {
    ATTEN_TIL_FEMTI_SEKS,
    FEMTI_SYV_TIL_SEKSTI_EN,
    SEKSTI_TO_TIL_SEKSTI_SEKS,
    SEKSTI_SYV,
    IKKE_GYLDIG,
}
