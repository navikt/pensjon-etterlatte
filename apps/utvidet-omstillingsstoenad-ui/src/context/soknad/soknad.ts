import { Language } from '../../i18n'
import { Skjema } from '../../typer/skjema'
import { StegPath } from '../../typer/steg'

export const tomSoeknad: ISoeknad = {
    harSamtykket: false,
    spraak: undefined,
    sistLagretDato: undefined,
    klarForLagring: false,
    visFortsettSoeknadModal: false,
    error: null,
    aktivtSteg: 'personopplysninger',
    skjema: {},
}

export interface ISoeknad {
    harSamtykket: boolean
    spraak?: Language
    klarForLagring: boolean
    sistLagretDato?: Date
    visFortsettSoeknadModal: boolean
    error: null | string
    aktivtSteg: StegPath
    skjema: Skjema
}

export enum ActionTypes {
    TILBAKESTILL = 'TILBAKESTILL',
    HENT_SOEKNAD = 'HENT_SOEKNAD',
    LAGRE_SOEKNAD = 'LAGRE_SOEKNAD',
    VIS_FORTSETT_SOEKNAD_MODAL = 'VIS_FORTSETT_SOEKNAD_MODAL',
    OPPDATER_SAMTYKKE = 'OPPDATER_SAMTYKKE',
    OPPDATER_SPRAAK = 'OPPDATER_SPRAAK',
    SET_ERROR = 'SET_ERROR',
    OPPDATER_KLADD = 'OPPDATER_KLADD',
}

export type ISoeknadAction =
    | { type: ActionTypes.TILBAKESTILL }
    | { type: ActionTypes.HENT_SOEKNAD | ActionTypes.OPPDATER_KLADD; payload: ISoeknad }
    | { type: ActionTypes.LAGRE_SOEKNAD; payload: Date }
    | { type: ActionTypes.VIS_FORTSETT_SOEKNAD_MODAL | ActionTypes.OPPDATER_SAMTYKKE; payload: boolean }
    | { type: ActionTypes.OPPDATER_SPRAAK; payload: Language }
    | { type: ActionTypes.SET_ERROR; payload: string | null }

export interface SoeknadProps {
    state: ISoeknad
    dispatch: (action: ISoeknadAction) => void
}
