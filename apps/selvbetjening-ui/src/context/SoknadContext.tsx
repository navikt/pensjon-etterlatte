import { createContext, FC, useContext, useReducer } from "react";

// const storedState = JSON.parse(localStorage.getItem("etterlatte-store"));

interface ISoknad {
    sprak: string;
    bekreftet: boolean;
    pensjonOvergangsstonad: boolean;
    gjenlevendetillegg: boolean;
    barnepensjon: boolean;
    stonadTilBarnetilsyn: boolean;
    stonadTilSkolepenger: boolean;
}

export enum SoknadActionTypes {
    SET_SPRAK = "SET_SPRAK",
    SET_BEKREFTET = "SET_BEKREFTET",
    SET_TYPER = "SET_TYPER",
}

type ISoknadAction = {
    type: SoknadActionTypes;
    payload: any;
};

const initialState: ISoknad = {
    sprak: "",
    bekreftet: false,
    pensjonOvergangsstonad: false,
    gjenlevendetillegg: false,
    barnepensjon: false,
    stonadTilBarnetilsyn: false,
    stonadTilSkolepenger: false,
};

const reducer = (state: ISoknad, action: ISoknadAction) => {
    switch (action.type) {
        case SoknadActionTypes.SET_SPRAK:
            return { ...state, sprak: action.payload };
        case SoknadActionTypes.SET_BEKREFTET:
            return { ...state, bekreftet: action.payload };
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

const SoknadContext = createContext<{
    state: ISoknad;
    dispatch: (action: ISoknadAction) => void;
}>({
    state: initialState,
    dispatch: () => {},
});

const useSoknadContext = () => useContext(SoknadContext);

const SoknadProvider: FC = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const value = { state, dispatch };

    // localStorage.setItem('etterlatte-store', JSON.stringify(state))

    return <SoknadContext.Provider value={value}>{children}</SoknadContext.Provider>;
};

export { useSoknadContext, SoknadProvider };
