import { IPerson, IKontaktinfo, IBarn } from "../../typer/IPerson";

interface IStoenad {
    label: string;
    checked: boolean;
    beskjed?: string;
}

export interface ISoeknad {
    spraak: string;
    fraDato: Date | null;
    bekreftet: boolean;
    valgteStoenader: IStoenad[];
    soeker: IPerson | null;
    kontaktinfo?: IKontaktinfo;
    opplysningerOmBarn: IBarn[];
}

export enum SoeknadActionTypes {
    HENT_INNLOGGET_BRUKER,
    BEKREFT_BOADRESSE,
    OPPHOLD_NORGE,
    SETT_FRA_DATO,
    SETT_BEKREFTET,
    VELG_SPRAAK,
    VELG_STOENAD,
    SETT_TELEFON,
    SETT_EPOST,
    LEGG_TIL_BARN,
}

export interface ISoeknadAction {
    type: SoeknadActionTypes;
    payload?: any;
}

export interface SoeknadProps {
    state: ISoeknad;
    dispatch: (action: ISoeknadAction) => void;
}
