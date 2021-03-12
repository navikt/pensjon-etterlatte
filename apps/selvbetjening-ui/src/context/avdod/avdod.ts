export interface IAvdod {
    fornavn: string;
    etternavn: string;
    fnr: string;
    dodsdato: string;
    statsborgerskap: string;
    bosetning: string;
    dodsfallAarsak: string;
    boddEllerJobbetUtland: string;
    pensjonsgivendeInntekt: string;
    pensjonAndreLand: string;
    militaerTjeneste: string;
}

export enum AvdodActionTypes {
    SET_AVDOD_FORNAVN,
    SET_AVDOD_ETTERNAVN,
    SET_AVDOD_FNR,
    SET_AVDOD_DODSDATO,
    SET_AVDOD_STATSBORGERSKAP,
    SET_AVDOD_BOSETNING,
    SET_AVDOD_DODSFALL_ARSAK,
    SET_AVDOD_BODD_ELLER_JOBBET_UTLAND,
    SET_AVDOD_PENSJONSGIVEDE_INNTEKT,
    SET_AVDOD_PENSJON_ANDRE_LAND,
    SET_AVDOD_MILITAER_TJENESTE,
}

export interface IAvdodAction {
    type: AvdodActionTypes;
    payload: any;
}

export interface AvdodProps {
    state: IAvdod;
    dispatch: (action: IAvdodAction) => void;
}
