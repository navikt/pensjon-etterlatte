import { createContext, FC, useContext, useReducer } from "react";
import { ActionTypes, ISoeknad, ISoeknadAction, SoeknadProps, tomSoeknad } from "./soknad";
import mockJson from "../../assets/dummy-soeknad.json";

const initialState: ISoeknad = tomSoeknad;

const reducer = (state: ISoeknad, action: ISoeknadAction) => {
    switch (action.type) {
        case ActionTypes.MOCK_SOEKNAD: {
            const json = JSON.stringify(mockJson)

            return JSON.parse(json) as ISoeknad;
        }
        case ActionTypes.TILBAKESTILL:
            return tomSoeknad;
        case ActionTypes.HENT_SOEKNAD:
            return {
                ...action.payload,
                klarForLagring: false,
                hentetFraBackend: true
            };
        case ActionTypes.LAGRE_SOEKNAD:
            return {
                ...state,
                sistLagretDato: action.payload
            }
        case ActionTypes.OPPDATER_SAMTYKKE:
            return {
                ...state,
                // sistLagretDato,
                klarForLagring: true,
                harSamtykket: action.payload
            };
        case ActionTypes.OPPDATER_OM_DEG:
            return {
                ...state,
                // sistLagretDato,
                klarForLagring: true,
                omDeg: action.payload
            };
        case ActionTypes.OPPDATER_OM_DEG_OG_AVDOED:
            return {
                ...state,
                // sistLagretDato,
                klarForLagring: true,
                omDegOgAvdoed: action.payload
            };
        case ActionTypes.OPPDATER_AVDOED:
            return {
                ...state,
                // sistLagretDato,
                klarForLagring: true,
                omDenAvdoede: action.payload
            };
        case ActionTypes.OPPDATER_DIN_SITUASJON:
            return {
                ...state,
                // sistLagretDato,
                klarForLagring: true,
                dinSituasjon: action.payload
            };
        case ActionTypes.OPPDATER_OM_BARN: {
            return {
                ...state,
                // sistLagretDato,
                klarForLagring: true,
                opplysningerOmBarn: action.payload
            };
        }
        default:
            return state;
    }
};

const SoknadContext = createContext<SoeknadProps>({
    state: initialState,
    dispatch: () => {},
});

const useSoknadContext = () => useContext(SoknadContext);

const SoknadProvider: FC = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    return <SoknadContext.Provider value={{ state, dispatch }}>{children}</SoknadContext.Provider>;
};

export { useSoknadContext, SoknadProvider };
