export interface IBruker {
    fornavn: string;
    etternavn: string;
    foedselsnummer: string;
    foedselsaar: number;
    adresse: string;
    statsborgerskap: string;
    sivilstatus: string;
}

export enum ActionTypes {
    HENT_INNLOGGET_BRUKER,
    INIT_TEST_BRUKER,
}

export interface IBrukerAction {
    type: ActionTypes;
    payload?: any;
}

export interface StegProps {
    state: IBruker;
    dispatch: (action: IBrukerAction) => void;
}
