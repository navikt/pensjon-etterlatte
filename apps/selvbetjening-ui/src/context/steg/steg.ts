export interface IStegElement {
    path: string;
    label: string;
    disabled: boolean;
}

export interface ISteg {
    aktivtSteg: number;
    steg: IStegElement[];
}

export enum StegActionTypes {
    TILBAKESTILL,
    SETT_STEG,
    NESTE,
    FORRIGE,
}

export interface IStegAction {
    type: StegActionTypes;
    payload?: any;
}

export interface StegProps {
    state: ISteg;
    dispatch: (action: IStegAction) => void;
}
