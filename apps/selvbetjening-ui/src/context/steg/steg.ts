import SoknadSteg from "../../typer/SoknadSteg";

export interface IStegElement {
    component: SoknadSteg;
    disabled: boolean;
}

export interface ISteg {
    aktivtSteg: number;
    steg: IStegElement[];
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
