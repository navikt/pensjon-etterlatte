import { IValg } from "./Spoersmaal";

export interface IAndreYtelser {
    kravOmAnnenStonad?: {
        svar?: IValg;
        ytelser?: Ytelser;
    };
    annenPensjon?: {
        svar?: IValg;
        beskrivelse: string;
    };
    mottarPensjonUtland?: {
        svar?: IValg;
        hvaSlagsPensjon?: string;
        fraHvilketLand?: string;
        bruttobeloepPrAar?: string;
        landetsValuta?: string; // bort?
    };
}

export enum Ytelser {
    dagpenger = "ytelser.dagpenger",
    sykepenger = "ytelser.sykepenger",
    pleiepenger = "ytelser.pleiepenger",
    svangerskapspenger = "ytelser.svangerskapspenger",
    foreldrepenger = "ytelser.foreldrepenger",
    arbeidsavklaringspenger = "ytelser.arbeidsavklaringspenger",
    kvalifiseringsstoenad  = "ytelser.kvalifiseringsstoenad",
    kommunal = "ytelser.kommunal",
    fosterhjem = "ytelser.fosterhjem",
    omsorgspenger = "ytelser.omsorgspenger",
    opplaeringspenger = "ytelser.opplaeringspenger"
}