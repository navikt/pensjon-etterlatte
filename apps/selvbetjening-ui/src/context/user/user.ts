export interface User {
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

export enum ActionTypes {
    SET_USER = 'SET_USER',
    RESET = 'RESET',
}

export interface IBrukerAction {
    type: ActionTypes
    payload?: User
}

export interface StegProps {
    state: User
    dispatch: (action: IBrukerAction) => void
}
