export interface ISoknad {
    sprak: string;
    bekreftet: boolean;
    pensjonOvergangsstonad: boolean;
    gjenlevendetillegg: boolean;
    barnepensjon: boolean;
    stonadTilBarnetilsyn: boolean;
    stonadTilSkolepenger: boolean;
}

export enum SoknadActionTypes {
    SET_SPRAK,
    SET_BEKREFTET,
    SET_TYPER,
}

export interface ISoknadAction {
    type: SoknadActionTypes;
    payload: any;
}

export interface SoknadProps {
    state: ISoknad;
    dispatch: (action: ISoknadAction) => void;
}
