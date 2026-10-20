import { Language } from '../../i18n'

export const tomSoeknad: ISoeknad = {
    harSamtykket: false,
    spraak: undefined,
    sistLagretDato: undefined,
    klarForLagring: false,
    visFortsettSoeknadModal: false,
    error: null,
}

export interface ISoeknad {
    harSamtykket: boolean
    spraak?: Language
    klarForLagring: boolean
    sistLagretDato?: Date
    visFortsettSoeknadModal: boolean
    error: null | string
}

export enum ActionTypes {
    TILBAKESTILL = 'TILBAKESTILL',
    HENT_SOEKNAD = 'HENT_SOEKNAD',
    LAGRE_SOEKNAD = 'LAGRE_SOEKNAD',
    VIS_FORTSETT_SOEKNAD_MODAL = 'VIS_FORTSETT_SOEKNAD_MODAL',
    OPPDATER_SAMTYKKE = 'OPPDATER_SAMTYKKE',
    OPPDATER_SPRAAK = 'OPPDATER_SPRAAK',
    SET_ERROR = 'SET_ERROR',
}

export interface ISoeknadAction {
    type: ActionTypes
    // biome-ignore lint/suspicious/noExplicitAny: gammel kode, venter med å fikse
    payload?: any
}

export interface SoeknadProps {
    state: ISoeknad
    dispatch: (action: ISoeknadAction) => void
}
