import { IAvdoed, IOmBarn, ISoeker, ISoekerOgAvdoed } from "../../typer/person";
import { ISituasjon } from "../../typer/situasjon";

export const tomSoeknad: ISoeknad = {
    harSamtykket: false,
    sistLagretDato: undefined,
    klarForLagring: false,
    omDeg: {},
    omDegOgAvdoed: {},
    omDenAvdoede: {},
    dinSituasjon: {},
    opplysningerOmBarn: {}
};

export interface ISoeknad {
    harSamtykket: boolean;
    klarForLagring?: false;
    sistLagretDato?: Date;
    omDeg: ISoeker;
    omDegOgAvdoed: ISoekerOgAvdoed;
    omDenAvdoede: IAvdoed;
    dinSituasjon: ISituasjon;
    opplysningerOmBarn: IOmBarn;
}

export enum ActionTypes {
    MOCK_SOEKNAD = "MOCK_SOEKNAD",
    TILBAKESTILL = "TILBAKESTILL",
    HENT_SOEKNAD = "HENT_SOEKNAD",
    LAGRE_SOEKNAD = "LAGRE_SOEKNAD",
    OPPDATER_SAMTYKKE = "OPPDATER_SAMTYKKE",
    OPPDATER_OM_DEG = "OPPDATER_OM_DEG",
    OPPDATER_OM_DEG_OG_AVDOED = "OPPDATER_OM_DEG_OG_AVDOED",
    OPPDATER_AVDOED = "OPPDATER_AVDOED",
    OPPDATER_DIN_SITUASJON = "OPPDATER_DIN_SITUASJON",
    OPPDATER_OM_BARN = "OPPDATER_OM_BARN",
}

export interface ISoeknadAction {
    type: ActionTypes;
    payload?: any;
}

export interface SoeknadProps {
    state: ISoeknad;
    dispatch: (action: ISoeknadAction) => void;
}
