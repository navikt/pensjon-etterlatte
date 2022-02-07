export interface ISoeknad {}

export enum ActionTypes {}

export interface ISoeknadAction {
    type: ActionTypes;
    payload?: any;
}

export interface SoeknadProps {
    state: ISoeknad;
    dispatch: (action: ISoeknadAction) => void;
}
