import { createContext, FC, useContext, useReducer } from "react";
import { AvdodActionTypes, AvdodProps, IAvdod, IAvdodAction } from "./avdod";

// const storedState = JSON.parse(localStorage.getItem("etterlatte-store"));

const initialState: IAvdod = {
    fornavn: "",
    etternavn: "",
    fnr: "",
    dodsdato: null,
    statsborgerskap: "",
    bosetning: "",
    dodsfallAarsak: "",
    boddEllerJobbetUtland: "",
    haddePensjonsgivendeInntekt: "",
    pensjonsgivendeInntektSvar: "",
    haddePensjonAndreLand: "",
    pensjonAndreLandSvar: "",
    harAvtjentMilitærTjeneste: "",
    avtjentMilitærTjenesteSvar: "",
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
            return { ...state, haddePensjonsgivendeInntekt: action.payload };
        case AvdodActionTypes.SET_AVDOD_PENSJONSGIVEDE_INNTEKT_SVAR:
            return { ...state, pensjonsgivendeInntektSvar: action.payload };
        case AvdodActionTypes.SET_AVDOD_PENSJON_ANDRE_LAND:
            return { ...state, haddePensjonAndreLand: action.payload };
        case AvdodActionTypes.SET_AVDOD_PENSJON_ANDRE_LAND_SVAR:
            return { ...state, pensjonAndreLandSvar: action.payload };
        case AvdodActionTypes.SET_AVDOD_MILITAER_TJENESTE:
            return { ...state, harAvtjentMilitærTjeneste: action.payload };
        case AvdodActionTypes.SET_AVDOD_MILITAER_TJENESTE_SVAR:
            return { ...state, avtjentMilitærTjenesteSvar: action.payload };
        default:
            return state;
    }
};

const AvdodContext = createContext<AvdodProps>({
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
