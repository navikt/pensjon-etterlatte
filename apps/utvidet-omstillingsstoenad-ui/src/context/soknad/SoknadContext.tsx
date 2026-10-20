import { createContext, FC, useContext, useReducer } from 'react'
import { FCProps } from '../../typer/FCProps'
import { ActionTypes, ISoeknad, ISoeknadAction, SoeknadProps, tomSoeknad } from './soknad'

const reducer = (state: ISoeknad, action: ISoeknadAction) => {
    switch (action.type) {
        case ActionTypes.TILBAKESTILL:
            return tomSoeknad
        case ActionTypes.HENT_SOEKNAD:
            return {
                ...tomSoeknad,
                harSamtykket: action.payload.harSamtykket,
                spraak: action.payload.spraak,
                sistLagretDato: action.payload.sistLagretDato,
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
        case ActionTypes.SET_ERROR:
            return {
                ...state,
                error: action.payload,
            }
        default:
            return state
    }
}

const SoknadContext = createContext<SoeknadProps>({
    state: tomSoeknad,
    dispatch: () => {},
})

const useSoknadContext = () => useContext(SoknadContext)

const SoknadProvider: FC<FCProps> = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, tomSoeknad)

    return <SoknadContext.Provider value={{ state, dispatch }}>{children}</SoknadContext.Provider>
}

export { SoknadProvider, useSoknadContext }
