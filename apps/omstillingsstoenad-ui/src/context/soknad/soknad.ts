import { IAvdoed, IOmBarn, IOmsorgForBarn, ISoeker, ISoekerOgAvdoed } from '../../typer/person'
import { ISituasjon } from '../../typer/situasjon'
import { Language } from '../../i18n'
import { IInntekt } from '../../typer/inntekt'

export const tomSoeknad: ISoeknad = {
    harSamtykket: false,
    spraak: undefined,
    sistLagretDato: undefined,
    klarForLagring: false,
    visFortsettSoeknadModal: false,
    error: null,
    omDeg: {},
    omDegOgAvdoed: {},
    omDenAvdoede: {},
    dinSituasjon: {},
    inntektenDin: {},
    omsorgForBarn: {},
    opplysningerOmBarn: {},
}

export interface ISoeknad {
    harSamtykket: boolean
    spraak?: Language
    klarForLagring?: false
    sistLagretDato?: Date
    visFortsettSoeknadModal: boolean
    error: null | string
    omDeg: ISoeker
    omDegOgAvdoed: ISoekerOgAvdoed
    omDenAvdoede: IAvdoed
    dinSituasjon: ISituasjon
    inntektenDin: IInntekt
    omsorgForBarn: IOmsorgForBarn
    opplysningerOmBarn: IOmBarn
}

export enum ActionTypes {
    MOCK_SOEKNAD = 'MOCK_SOEKNAD',
    TILBAKESTILL = 'TILBAKESTILL',
    HENT_SOEKNAD = 'HENT_SOEKNAD',
    LAGRE_SOEKNAD = 'LAGRE_SOEKNAD',
    VIS_FORTSETT_SOEKNAD_MODAL = 'VIS_FORTSETT_SOEKNAD_MODAL',
    OPPDATER_SAMTYKKE = 'OPPDATER_SAMTYKKE',
    OPPDATER_SPRAAK = 'OPPDATER_SPRAAK',
    OPPDATER_OM_DEG = 'OPPDATER_OM_DEG',
    OPPDATER_OM_DEG_OG_AVDOED = 'OPPDATER_OM_DEG_OG_AVDOED',
    OPPDATER_AVDOED = 'OPPDATER_AVDOED',
    OPPDATER_DIN_SITUASJON = 'OPPDATER_DIN_SITUASJON',
    OPPDATER_INNTEKTEN_DIN = 'OPPDATER_INNTEKTEN_DIN',
    OPPDATER_OMSORG_FOR_BARN = 'OPPDATER_OMSORG_FOR_BARN',
    OPPDATER_OM_BARN = 'OPPDATER_OM_BARN',
    SET_ERROR = 'SET_ERROR',
}

export interface ISoeknadAction {
    type: ActionTypes
    payload?: any
}

export interface SoeknadProps {
    state: ISoeknad
    dispatch: (action: ISoeknadAction) => void
}
