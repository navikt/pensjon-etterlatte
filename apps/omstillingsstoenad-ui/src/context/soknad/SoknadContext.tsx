import { createContext, FC, useContext, useReducer } from 'react'
import { ActionTypes, ISoeknad, ISoeknadAction, SoeknadProps, tomSoeknad } from './soknad'
import mockJson from '../../assets/dummy-soeknad.json'
import { FCProps } from '../../typer/FCProps'

const initialState: ISoeknad = tomSoeknad

const reducer = (state: ISoeknad, action: ISoeknadAction) => {
    switch (action.type) {
        case ActionTypes.MOCK_SOEKNAD: {
            const json = JSON.stringify(mockJson)

            return JSON.parse(json) as ISoeknad
        }
        case ActionTypes.TILBAKESTILL:
            return tomSoeknad
        case ActionTypes.HENT_SOEKNAD:
            return {
                ...action.payload,
                klarForLagring: false,
                visFortsettSoeknadModal: true,
            }
        case ActionTypes.VIS_FORTSETT_SOEKNAD_MODAL:
            return {
                ...state,
                visFortsettSoeknadModal: action.payload,
            }
        case ActionTypes.LAGRE_SOEKNAD:
            return {
                ...state,
                sistLagretDato: action.payload,
                klarForLagring: false,
            }
        case ActionTypes.OPPDATER_SAMTYKKE:
            return {
                ...state,
                klarForLagring: true,
                harSamtykket: action.payload,
            }
        case ActionTypes.OPPDATER_SPRAAK:
            return {
                ...state,
                spraak: action.payload,
            }
        case ActionTypes.OPPDATER_OM_DEG:
            return {
                ...state,
                klarForLagring: true,
                omDeg: action.payload,
            }
        case ActionTypes.OPPDATER_OM_DEG_OG_AVDOED:
            return {
                ...state,
                klarForLagring: true,
                omDegOgAvdoed: action.payload,
            }
        case ActionTypes.OPPDATER_AVDOED:
            return {
                ...state,
                klarForLagring: true,
                omDenAvdoede: action.payload,
            }
        case ActionTypes.OPPDATER_DIN_SITUASJON:
            return {
                ...state,
                klarForLagring: true,
                dinSituasjon: action.payload,
            }
        case ActionTypes.OPPDATER_INNTEKTEN_DIN:
            return {
                ...state,
                klarForLagring: true,
                inntektenDin: action.payload,
            }
        case ActionTypes.OPPDATER_OM_BARN: {
            return {
                ...state,
                klarForLagring: true,
                opplysningerOmBarn: action.payload,
            }
        }
        case ActionTypes.SET_ERROR: {
            return {
                ...state,
                error: action.payload,
            }
        }
        default:
            return state
    }
}

const SoknadContext = createContext<SoeknadProps>({
    state: initialState,
    dispatch: () => {},
})

const useSoknadContext = () => useContext(SoknadContext)

const SoknadProvider: FC<FCProps> = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState)

    return <SoknadContext.Provider value={{ state, dispatch }}>{children}</SoknadContext.Provider>
}

export { useSoknadContext, SoknadProvider }
