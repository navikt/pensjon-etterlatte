import { createContext, useReducer } from "react";

const storedState = JSON.parse(localStorage.getItem("etterlatte-store"));

const initialState = storedState || {
    types: {
        pensjonOvergangsstonad: false,
        gjenlevendetillegg: false,
        barnepensjon: false,
        stonadTilBarnetilsyn: false,
        stonadTilSkolepenger: false,
    },
    // soker
    avdod: {
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
    },
    language: "",
    confirmation: false,
};

const store = createContext({});
const { Provider } = store;

const StateProvider = ({ children }) => {
    const [state, dispatch] = useReducer((state, action) => {
        switch (action.type) {
            case "SET_TYPES": {
                const { name, checked } = action.payload;
                console.log(name);
                if (name === "0") return { ...state, types: { ...state.types, pensjonOvergangsstonad: checked } };
                else if (name === "1") return { ...state, types: { ...state.types, gjenlevendetillegg: checked } };
                else if (name === "2") return { ...state, types: { ...state.types, barnepensjon: checked } };
                else if (name === "3") return { ...state, types: { ...state.types, stonadTilBarnetilsyn: checked } };
                else if (name === "4") return { ...state, types: { ...state.types, stonadTilSkolepenger: checked } };
                else return { ...state };
            }
            case "SET_AVDOD_FORNAVN":
                return { ...state, avdod: { ...state.avdod, fornavn: action.payload } };
            case "SET_AVDOD_ETTERNAVN":
                return { ...state, avdod: { ...state.avdod, etternavn: action.payload } };
            case "SET_AVDOD_FNR":
                return { ...state, avdod: { ...state.avdod, fnr: action.payload } };
            case "SET_AVDOD_DODSDATO":
                return { ...state, avdod: { ...state.avdod, dodsdato: action.payload } };
            case "SET_AVDOD_STATSBORGERSKAP":
                return { ...state, avdod: { ...state.avdod, statsborgerskap: action.payload } };
            case "SET_AVDOD_BOSETNING":
                return { ...state, avdod: { ...state.avdod, bosetning: action.payload } };
            case "SET_AVDOD_DODSFALL_ARSAK":
                return { ...state, avdod: { ...state.avdod, dodsfallAarsak: action.payload } };
            case "SET_AVDOD_BODD_ELLER_JOBBET_UTLAND":
                return { ...state, avdod: { ...state.avdod, boddEllerJobbetUtland: action.payload } };
            case "SET_AVDOD_PENSJONSGIVEDE_INNTEKT":
                return { ...state, avdod: { ...state.avdod, pensjonsgivendeInntekt: action.payload } };
            case "SET_AVDOD_PENSJON_ANDRE_LAND":
                return { ...state, avdod: { ...state.avdod, pensjonAndreLand: action.payload } };
            case "SET_AVDOD_MILITAER_TJENESTE":
                return { ...state, avdod: { ...state.avdod, militaerTjeneste: action.payload } };
            case "SET_LANGUAGE":
                return { ...state, language: action.payload };
            case "SET_CONFIRMATION":
                return { ...state, confirmation: action.payload };
            default:
                throw new Error();
        }
    }, initialState);

    // localStorage.setItem('etterlatte-store', JSON.stringify(state))

    return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { store, StateProvider };
