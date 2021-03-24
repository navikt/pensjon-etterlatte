export interface ISoknad {
    sprak: string;
    fraDato: string;
    bekreftet: boolean;
    pensjonOvergangsstonad: boolean;
    gjenlevendetillegg: boolean;
    barnepensjon: boolean;
    stonadTilBarnetilsyn: boolean;
    stonadTilSkolepenger: boolean;
    gyldig: boolean;
    error?: {
        stønadMangler?: string;
        datoMangler?: string;
    };
}

export enum SoknadActionTypes {
    SET_FRA_DATO,
    SET_SPRAK,
    SET_BEKREFTET,
    SET_TYPER,
    VALIDER_SKJEMA,
}

export interface ISoknadAction {
    type: SoknadActionTypes;
    payload?: any;
}

export interface SoknadProps {
    state: ISoknad;
    dispatch: (action: ISoknadAction) => void;
}
