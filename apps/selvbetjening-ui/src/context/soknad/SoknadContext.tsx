import { createContext, FC, useContext, useReducer } from "react";
import { ISoknad, ISoknadAction, SoknadActionTypes, SoknadProps } from "./soknad";

// const storedState = JSON.parse(localStorage.getItem("etterlatte-store"));

const initialState: ISoknad = {
    sprak: "",
    fraDato: "",
    bekreftet: false,
    pensjonOvergangsstonad: false,
    gjenlevendetillegg: false,
    barnepensjon: false,
    stonadTilBarnetilsyn: false,
    stonadTilSkolepenger: false,
    søker: undefined,
    kontaktinfo: undefined,
};

const reducer = (state: ISoknad, action: ISoknadAction) => {
    switch (action.type) {
        case SoknadActionTypes.HENT_INNLOGGET_BRUKER:
            return { ...state, søker: action.payload };
        case SoknadActionTypes.SET_FRA_DATO:
            return { ...state, fraDato: action.payload };
        case SoknadActionTypes.SET_SPRAK:
            return { ...state, sprak: action.payload };
        case SoknadActionTypes.SET_BEKREFTET:
            return { ...state, bekreftet: action.payload };
        case SoknadActionTypes.BEKREFT_BOADRESSE:
            return { ...state, kontaktinfo: { ...state.kontaktinfo, boadresseBekreftet: action.payload } };
        case SoknadActionTypes.SETT_TELEFON:
            return { ...state, kontaktinfo: { ...state.kontaktinfo, telefonnummer: action.payload } };
        case SoknadActionTypes.SETT_EPOST:
            return { ...state, kontaktinfo: { ...state.kontaktinfo, epost: action.payload } };
        case SoknadActionTypes.SET_TYPER: {
            const { name, checked } = action.payload;

            if (name === "0") return { ...state, pensjonOvergangsstonad: checked };
            else if (name === "1") return { ...state, gjenlevendetillegg: checked };
            else if (name === "2") return { ...state, barnepensjon: checked };
            else if (name === "3") return { ...state, stonadTilBarnetilsyn: checked };
            else if (name === "4") return { ...state, stonadTilSkolepenger: checked };
            else return { ...state };
        }
        default:
            return state;
    }
};

const SoknadContext = createContext<SoknadProps>({
    state: initialState,
    dispatch: () => {},
});

const useSoknadContext = () => useContext(SoknadContext);

const SoknadProvider: FC = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    // localStorage.setItem('etterlatte-store', JSON.stringify(state))

    return <SoknadContext.Provider value={{ state, dispatch }}>{children}</SoknadContext.Provider>;
};

export { useSoknadContext, SoknadProvider };
