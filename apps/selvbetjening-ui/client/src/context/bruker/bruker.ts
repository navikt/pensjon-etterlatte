export interface IBruker {
    fornavn?: string;
    etternavn?: string;
    foedselsnummer?: string;
    foedselsaar?: number;
    foedselsdato?: Date;
    alder?: number;
    kanSoeke?: boolean;
    adresse?: string;
    husnummer?: string;
    husbokstav?: string;
    postnummer?: string;
    poststed?: string;
    statsborgerskap?: string;
    sivilstatus?: string;
}

export enum ActionTypes {
    HENT_INNLOGGET_BRUKER = "HENT_INNLOGGET_BRUKER",
    TILBAKESTILL = "TILBAKESTILL",
}

export interface IBrukerAction {
    type: ActionTypes;
    payload?: IBruker;
}

export interface StegProps {
    state: IBruker;
    dispatch: (action: IBrukerAction) => void;
}
