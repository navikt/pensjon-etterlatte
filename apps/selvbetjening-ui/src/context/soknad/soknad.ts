import { IPerson, IKontaktinfo } from "../../typer/IPerson";

export interface ISoknad {
    sprak: string;
    fraDato: string;
    bekreftet: boolean;
    pensjonOvergangsstonad: boolean;
    gjenlevendetillegg: boolean;
    barnepensjon: boolean;
    stonadTilBarnetilsyn: boolean;
    stonadTilSkolepenger: boolean;
    søker?: IPerson;
    kontaktinfo?: IKontaktinfo;
}

export enum SoknadActionTypes {
    HENT_INNLOGGET_BRUKER,
    BEKREFT_BOADRESSE,
    SET_FRA_DATO,
    SET_SPRAK,
    SET_BEKREFTET,
    SET_TYPER,
    SETT_TELEFON,
    SETT_EPOST,
}

export interface ISoknadAction {
    type: SoknadActionTypes;
    payload?: any;
}

export interface SoknadProps {
    state: ISoknad;
    dispatch: (action: ISoknadAction) => void;
}
