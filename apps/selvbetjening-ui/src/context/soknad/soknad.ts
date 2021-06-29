import { IAvdoed, IBarn, ISoeker } from "../../typer/person";
import { IOmSoeknaden } from "../../typer/ytelser";
import { ISituasjon } from "../../typer/situasjon";

export interface ISoeknad {
    harSamtykket: boolean;
    // 1 Hva søker du?
    omSoeknaden: IOmSoeknaden;
    // 2 Opplysninger om søkeren
    omDeg: ISoeker;
    // 3 Opplysninger om den avdøde
    omDenAvdoede: IAvdoed;
    // 4 Din situasjon
    dinSituasjon: ISituasjon;
    // 4 Opplysninger om barn
    opplysningerOmBarn: IBarn[];
}

export enum ActionTypes {
    MOCK_SOEKNAD = "MOCK_SOEKNAD",
    TILBAKESTILL = "TILBAKESTILL",
    OPPDATER_SAMTYKKE = "OPPDATER_SAMTYKKE",
    OPPDATERT_OM_SOEKNADEN = "OPPDATERT_OM_SOEKNADEN",
    OPPDATER_OM_DEG = "OPPDATER_OM_DEG",
    OPPDATER_AVDOED = "OPPDATER_AVDOED",
    OPPDATER_DIN_SITUASJON = "OPPDATER_DIN_SITUASJON",
    LEGG_TIL_BARN = "LEGG_TIL_BARN",
    FJERN_BARN = "FJERN_BARN",
}

export interface ISoeknadAction {
    type: ActionTypes;
    payload?: any;
}

export interface SoeknadProps {
    state: ISoeknad;
    dispatch: (action: ISoeknadAction) => void;
}
