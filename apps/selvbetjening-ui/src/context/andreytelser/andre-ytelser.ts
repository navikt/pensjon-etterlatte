export interface AndreYtelserProps {
    state: IAndreYtelser;
    dispatch: (action: IAndreYtelserAction) => void;
}

export interface IAndreYtelser {
    mottarAndreYtelser: string;
    harKravOmAnnenStonad: string;
    annenStonadBeskrivelse: string;
    mottarPensjonFraUtlandet: string;
    pensjonUtlandBeskrivelse: string;
    pensjonUtlandBruttobelop: string;
}

export enum AndreYtelserActionTypes {
    SET_ANDRE_YTELSER,
    SET_KRAV_OM_ANNEN_STONAD,
    SET_ANNEN_STONAD_BESKRIVELSE,
    SET_MOTTAR_PENSJON_UTLAND,
    SET_PENSJON_UTLAND_BESKRIVELSE,
    SET_PENSJON_UTLAND_BRUTTOBELOP,
}

export interface IAndreYtelserAction {
    type: AndreYtelserActionTypes;
    payload: any;
}
