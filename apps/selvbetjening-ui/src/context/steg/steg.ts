import SoknadSteg from "../../typer/SoknadSteg";

export interface IStegInnhold {
    label: string;
    component: SoknadSteg;
    path: string;
}

export interface ISteg {
    aktivtSteg?: number;
    steg: IStegInnhold[];
}

export enum StegActionTypes {
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
