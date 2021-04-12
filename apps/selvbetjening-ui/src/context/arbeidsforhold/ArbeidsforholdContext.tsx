import { createContext, FC, useContext, useReducer } from "react";
import {
    ArbeidsforholdActionTypes,
    ArbeidsforholdProps,
    IArbeidsforhold,
    IArbeidsforholdAction,
} from "./arbeidsforhold";

const initialState: IArbeidsforhold = {
    yrke: "",
    stilling: "",
    startDato: null,
    sluttDato: null,
    ansettelsesforhold: "", // låse valg til type?
    heltidDeltid: "",
    stillingsprosent: null,
    arbeidsgiver: {
        navn: "",
        adresse: "",
    },
    inntekt: {
        bruttoArbeidsinntektPrMd: "",
        personinntektFraNaeringPrAr: "",
    },
};

const reducer = (state: IArbeidsforhold, action: IArbeidsforholdAction) => {
    switch (action.type) {
        case ArbeidsforholdActionTypes.OPPDATER_YRKE:
            return { ...state, yrke: action.payload };
        case ArbeidsforholdActionTypes.OPPDATER_STILLING:
            return { ...state, stilling: action.payload };
        case ArbeidsforholdActionTypes.OPPDATER_START_DATO:
            return { ...state, startDato: action.payload };
        case ArbeidsforholdActionTypes.OPPDATER_SLUTT_DATO:
            return { ...state, sluttDato: action.payload };

        case ArbeidsforholdActionTypes.OPPDATER_ANSETTELSESFORHOLD:
            return { ...state, ansettelsesforhold: action.payload };
        case ArbeidsforholdActionTypes.OPPDATER_HELTID_DELTID:
            return { ...state, heltidDeltid: action.payload };
        case ArbeidsforholdActionTypes.OPPDATER_STILLINGSPROSENT:
            return { ...state, stillingsprosent: action.payload };

        case ArbeidsforholdActionTypes.OPPDATER_ARBEIDSGIVER_NAVN:
            return { ...state, arbeidsgiver: { ...state.arbeidsgiver, navn: action.payload } };
        case ArbeidsforholdActionTypes.OPPDATER_ARBEIDSGIVER_ADRESSE:
            return { ...state, arbeidsgiver: { ...state.arbeidsgiver, adresse: action.payload } };

        case ArbeidsforholdActionTypes.OPPDATER_BRUTTO_ARBEIDSINNTEKT:
            return { ...state, inntekt: { ...state.inntekt, bruttoArbeidsinntektPrMd: action.payload } };
        case ArbeidsforholdActionTypes.OPPDATER_PERSONINNTEKT:
            return { ...state, inntekt: { ...state.inntekt, personinntektFraNaeringPrAr: action.payload } };

        default:
            return state;
    }
};

const ArbeidsforholdContext = createContext<ArbeidsforholdProps>({
    state: initialState,
    dispatch: () => {},
});

const useArbeidsforholdContext = () => useContext(ArbeidsforholdContext);

const ArbeidsforholdProvider: FC = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    return <ArbeidsforholdContext.Provider value={{ state, dispatch }}>{children}</ArbeidsforholdContext.Provider>;
};

export { useArbeidsforholdContext, ArbeidsforholdProvider };
