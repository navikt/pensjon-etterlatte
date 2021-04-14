import { createContext, FC, useContext, useReducer } from "react";
import { ISoeknad, ISoeknadAction, SoeknadActionTypes, SoeknadProps } from "./soknad";

const STORAGE_KEY = "etterlatte-store";

const json = localStorage.getItem(STORAGE_KEY);
const storedState = json ? JSON.parse(json) : null;

const initialState: ISoeknad = storedState || {
    fraDato: null,
    stoenadType: null,
    soeker: null,
    kontaktinfo: null,
    opplysningerOmBarn: [],
    tidligereArbeidsforhold: [],
    naavaerendeArbeidsforhold: null,
    andreYtelser: null,
};

const reducer = (state: ISoeknad, action: ISoeknadAction) => {
    switch (action.type) {
        case SoeknadActionTypes.HENT_INNLOGGET_BRUKER:
            return { ...state, soeker: action.payload };
        case SoeknadActionTypes.SETT_FRA_DATO:
            return { ...state, fraDato: action.payload };
        case SoeknadActionTypes.BEKREFT_BOADRESSE:
            return { ...state, kontaktinfo: { ...state.kontaktinfo, boadresseBekreftet: action.payload } };
        case SoeknadActionTypes.OPPHOLD_NORGE:
            return { ...state, kontaktinfo: { ...state.kontaktinfo, oppholderSegINorge: action.payload } };
        case SoeknadActionTypes.SETT_TELEFON:
            return { ...state, kontaktinfo: { ...state.kontaktinfo, telefonnummer: action.payload } };
        case SoeknadActionTypes.SETT_EPOST:
            return { ...state, kontaktinfo: { ...state.kontaktinfo, epost: action.payload } };
        case SoeknadActionTypes.OPPDATER_VALGTE_STOENADER: {
            return { ...state, stoenadType: action.payload };
        }
        case SoeknadActionTypes.LEGG_TIL_BARN: {
            const { opplysningerOmBarn } = state;

            opplysningerOmBarn.push(action.payload);

            return { ...state, opplysningerOmBarn };
        }
        case SoeknadActionTypes.LEGG_TIL_TIDLIGERE_ARBEIDSFORHOLD: {
            return { ...state, tidligereArbeidsforhold: [...state.tidligereArbeidsforhold, action.payload] };
        }
        case SoeknadActionTypes.FJERN_TIDLIGERE_ARBEIDSFORHOLD: {
            const indexToDelete: number = action.payload;

            const tidligereArbeidsforhold = [
                ...state.tidligereArbeidsforhold.filter((_: any, index: number) => index !== indexToDelete),
            ];

            return { ...state, tidligereArbeidsforhold };
        }
        case SoeknadActionTypes.OPPDATER_ANDRE_YTELSER: {
            return { ...state, andreYtelser: action.payload };
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

    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));

    return <SoknadContext.Provider value={{ state, dispatch }}>{children}</SoknadContext.Provider>;
};

export { useSoknadContext, SoknadProvider };
