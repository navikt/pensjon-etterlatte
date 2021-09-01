import { createContext, FC, useContext, useReducer } from "react";
import { ActionTypes, ISoeknad, ISoeknadAction, SoeknadProps } from "./soknad";
import mockJson from "../../assets/dummy-soeknad.json";

const tomSoeknad = {
    harSamtykket: false,
    sistLagretDato: undefined,
    omDeg: {},
    omDegOgAvdoed: {},
    omDenAvdoede: {},
    dinSituasjon: {},
    opplysningerOmBarn: {}
};

const initialState: ISoeknad = tomSoeknad;

const reducer = (state: ISoeknad, action: ISoeknadAction) => {
    const sistLagretDato = new Date();

    switch (action.type) {
        case ActionTypes.MOCK_SOEKNAD: {
            const json = JSON.stringify(mockJson)

            return JSON.parse(json) as ISoeknad;
        }
        case ActionTypes.TILBAKESTILL:
            return tomSoeknad;
        case ActionTypes.HENT_SOEKNAD:
            return action.payload;
        case ActionTypes.OPPDATER_SAMTYKKE:
            return {
                ...state,
                sistLagretDato,
                harSamtykket: action.payload
            };
        case ActionTypes.OPPDATER_OM_DEG:
            return {
                ...state,
                sistLagretDato,
                omDeg: action.payload
            };
        case ActionTypes.OPPDATER_OM_DEG_OG_AVDOED:
            return {
                ...state,
                sistLagretDato,
                omDegOgAvdoed: action.payload
            };
        case ActionTypes.OPPDATER_AVDOED:
            return {
                ...state,
                sistLagretDato,
                omDenAvdoede: action.payload
            };
        case ActionTypes.OPPDATER_DIN_SITUASJON:
            return {
                ...state,
                sistLagretDato,
                dinSituasjon: action.payload
            };
        case ActionTypes.OPPDATER_OM_BARN: {
            return {
                ...state,
                sistLagretDato,
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
