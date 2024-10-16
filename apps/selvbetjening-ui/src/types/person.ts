export interface IInnloggetBruker {
    fornavn?: string
    etternavn?: string
    foedselsnummer?: string
    foedselsaar?: number
    foedselsdato?: Date | string
}

export enum Alder {
    ATTEN_TIL_FEMTI_SEKS,
    FEMTI_SYV_TIL_SEKSTI_SEKS,
    SEKSTI_SYV,
    IKKE_GYLDIG,
}
