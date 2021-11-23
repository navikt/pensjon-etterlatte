import { IAvdoed, IOmBarn, ISoeker, ISoekerOgAvdoed } from "./person";
import { ISituasjon } from "./situasjon";

export interface ISoeknad {
    harSamtykket: boolean;
    klarForLagring?: false;
    sistLagretDato?: Date;
    visFortsettSoeknadModal: boolean;
    error: null | string;
    omDeg: ISoeker;
    omDegOgAvdoed: ISoekerOgAvdoed;
    omDenAvdoede: IAvdoed;
    dinSituasjon: ISituasjon;
    opplysningerOmBarn: IOmBarn;
}
