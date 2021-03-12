import { createContext, FC, useContext, useReducer } from "react";

// const storedState = JSON.parse(localStorage.getItem("etterlatte-store"));

interface IAvdod {
    fornavn: string;
    etternavn: string;
    fnr: string;
    dodsdato: string;
    statsborgerskap: string;
    bosetning: string;
    dodsfallAarsak: string;
    boddEllerJobbetUtland: string;
    pensjonsgivendeInntekt: string;
    pensjonAndreLand: string;
    militaerTjeneste: string;
}

export enum AvdodActionTypes {
    SET_AVDOD_FORNAVN = "SET_AVDOD_FORNAVN",
    SET_AVDOD_ETTERNAVN = "SET_AVDOD_ETTERNAVN",
    SET_AVDOD_FNR = "SET_AVDOD_FNR",
    SET_AVDOD_DODSDATO = "SET_AVDOD_DODSDATO",
    SET_AVDOD_STATSBORGERSKAP = "SET_AVDOD_STATSBORGERSKAP",
    SET_AVDOD_BOSETNING = "SET_AVDOD_BOSETNING",
    SET_AVDOD_DODSFALL_ARSAK = "SET_AVDOD_DODSFALL_ARSAK",
    SET_AVDOD_BODD_ELLER_JOBBET_UTLAND = "SET_AVDOD_BODD_ELLER_JOBBET_UTLAND",
    SET_AVDOD_PENSJONSGIVEDE_INNTEKT = "SET_AVDOD_PENSJONSGIVEDE_INNTEKT",
    SET_AVDOD_PENSJON_ANDRE_LAND = "SET_AVDOD_PENSJON_ANDRE_LAND",
    SET_AVDOD_MILITAER_TJENESTE = "SET_AVDOD_MILITAER_TJENESTE",
}

type IAvdodAction = {
    type: AvdodActionTypes;
    payload: any;
};

const initialState: IAvdod = {
    fornavn: "",
    etternavn: "",
    fnr: "",
    dodsdato: "",
    statsborgerskap: "",
    bosetning: "",
    dodsfallAarsak: "",
    boddEllerJobbetUtland: "",
    pensjonsgivendeInntekt: "",
    pensjonAndreLand: "",
    militaerTjeneste: "",
};

const reducer = (state: IAvdod, action: IAvdodAction) => {
    switch (action.type) {
        case AvdodActionTypes.SET_AVDOD_FORNAVN:
            return { ...state, fornavn: action.payload };
        case AvdodActionTypes.SET_AVDOD_ETTERNAVN:
            return { ...state, etternavn: action.payload };
        case AvdodActionTypes.SET_AVDOD_FNR:
            return { ...state, fnr: action.payload };
        case AvdodActionTypes.SET_AVDOD_DODSDATO:
            return { ...state, dodsdato: action.payload };
        case AvdodActionTypes.SET_AVDOD_STATSBORGERSKAP:
            return { ...state, statsborgerskap: action.payload };
        case AvdodActionTypes.SET_AVDOD_BOSETNING:
            return { ...state, bosetning: action.payload };
        case AvdodActionTypes.SET_AVDOD_DODSFALL_ARSAK:
            return { ...state, dodsfallAarsak: action.payload };
        case AvdodActionTypes.SET_AVDOD_BODD_ELLER_JOBBET_UTLAND:
            return { ...state, boddEllerJobbetUtland: action.payload };
        case AvdodActionTypes.SET_AVDOD_PENSJONSGIVEDE_INNTEKT:
            return { ...state, pensjonsgivendeInntekt: action.payload };
        case AvdodActionTypes.SET_AVDOD_PENSJON_ANDRE_LAND:
            return { ...state, pensjonAndreLand: action.payload };
        case AvdodActionTypes.SET_AVDOD_MILITAER_TJENESTE:
            return { ...state, militaerTjeneste: action.payload };
        default:
            return state;
    }
};

const AvdodContext = createContext<{
    state: IAvdod;
    dispatch: (action: IAvdodAction) => void;
}>({
    state: initialState,
    dispatch: () => {},
});

const useAvdodContext = () => useContext(AvdodContext);

const AvdodProvider: FC = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const value = { state, dispatch };

    // localStorage.setItem('etterlatte-store', JSON.stringify(state))

    return <AvdodContext.Provider value={value}>{children}</AvdodContext.Provider>;
};

export { useAvdodContext, AvdodProvider };
