import { IPerson, IKontaktinfo } from "../../typer/IPerson";

interface IStønad {
    label: string;
    checked: boolean;
    beskjed?: string;
}

export interface ISoknad {
    sprak: string;
    fraDato: Date | null;
    bekreftet: boolean;
    valgteStønader: IStønad[];
    søker: IPerson | null;
    kontaktinfo?: IKontaktinfo;
}

export enum SoknadActionTypes {
    HENT_INNLOGGET_BRUKER,
    BEKREFT_BOADRESSE,
    OPPHOLD_NORGE,
    SET_FRA_DATO,
    SET_SPRAK,
    SET_BEKREFTET,
    VELG_STØNAD,
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
