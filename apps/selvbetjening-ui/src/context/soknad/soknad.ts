import { IAvdoed, IBarn, ISoeker, ISoekerOgAvdoed } from "../../typer/person";
import { ISituasjon } from "../../typer/situasjon";

export interface ISoeknad {
    harSamtykket: boolean;
    omDeg: ISoeker;
    omDegOgAvdoed: ISoekerOgAvdoed;
    omDenAvdoede: IAvdoed;
    dinSituasjon: ISituasjon;
    opplysningerOmBarn: IBarn[];
}

export enum ActionTypes {
    MOCK_SOEKNAD = "MOCK_SOEKNAD",
    TILBAKESTILL = "TILBAKESTILL",
    OPPDATER_SAMTYKKE = "OPPDATER_SAMTYKKE",
    OPPDATER_OM_DEG = "OPPDATER_OM_DEG",
    OPPDATER_OM_DEG_OG_AVDOED = "OPPDATER_OM_DEG_OG_AVDOED",
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
