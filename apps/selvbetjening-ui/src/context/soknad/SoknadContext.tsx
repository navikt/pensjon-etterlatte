import { createContext, FC, useContext, useReducer } from "react";
import { ActionTypes, ISoeknad, ISoeknadAction, SoeknadProps } from "./soknad";
import mockJson from "../../assets/dummy-soeknad.json";

const tomSoeknad = {
    harSamtykket: false,
    omSoeknaden: {},
    omDeg: {},
    omDenAvdoede: {},
    dinSituasjon: {},
    opplysningerOmBarn: [],
    tidligereArbeidsforhold: [],
    naavaerendeArbeidsforhold: {},
    andreYtelser: {},
};

const STORAGE_KEY = "etterlatte-store";
const json = localStorage.getItem(STORAGE_KEY);
const initialState: ISoeknad = json ? JSON.parse(json) : tomSoeknad;

const reducer = (state: ISoeknad, action: ISoeknadAction) => {
    switch (action.type) {
        case ActionTypes.MOCK_SOEKNAD: {
            const json = JSON.stringify(mockJson)

            return JSON.parse(json) as ISoeknad;
        }
        case ActionTypes.TILBAKESTILL:
            return tomSoeknad;
        case ActionTypes.OPPDATER_SAMTYKKE:
            return { ...state, harSamtykket: action.payload }
        case ActionTypes.OPPDATERT_OM_SOEKNADEN:
            return { ...state, omSoeknaden: action.payload };
        case ActionTypes.OPPDATER_OM_DEG:
            return { ...state, omDeg: action.payload };
        case ActionTypes.OPPDATER_AVDOED:
            return { ...state, omDenAvdoede: action.payload };
        case ActionTypes.OPPDATER_DIN_SITUASJON:
            return { ...state, dinSituasjon: action.payload };
        case ActionTypes.LEGG_TIL_BARN: {
            const { opplysningerOmBarn } = state;

            opplysningerOmBarn.push(action.payload);

            return { ...state, opplysningerOmBarn };
        }
        case ActionTypes.FJERN_BARN: {
            const indexToDelete: number = action.payload;

            const opplysningerOmBarn = [
                ...state.opplysningerOmBarn.filter((_: any, index: number) => index !== indexToDelete),
            ];

            return { ...state, opplysningerOmBarn };
        }
        /*
        case ActionTypes.LEGG_TIL_TIDLIGERE_ARBEIDSFORHOLD: {
            return { ...state, tidligereArbeidsforhold: [...state.tidligereArbeidsforhold, action.payload] };
        }
        case ActionTypes.FJERN_TIDLIGERE_ARBEIDSFORHOLD: {
            const indexToDelete: number = action.payload;

            const tidligereArbeidsforhold = [
                ...state.tidligereArbeidsforhold.filter((_: any, index: number) => index !== indexToDelete),
            ];

            return { ...state, tidligereArbeidsforhold };
        }
        case ActionTypes.OPPDATER_NAAVAERENDE_ARBEIDSFORHOLD:
            return { ...state, naavaerendeArbeidsforhold: action.payload };
        case ActionTypes.OPPDATER_ANDRE_YTELSER:
            return { ...state, andreYtelser: action.payload };
        */
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

    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));

    return <SoknadContext.Provider value={{ state, dispatch }}>{children}</SoknadContext.Provider>;
};

export { useSoknadContext, SoknadProvider };
