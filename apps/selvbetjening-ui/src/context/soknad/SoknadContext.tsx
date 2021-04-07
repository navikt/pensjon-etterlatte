import { createContext, FC, useContext, useReducer } from "react";
import { ISoknad, ISoknadAction, SoknadActionTypes, SoknadProps } from "./soknad";

// const storedState = JSON.parse(localStorage.getItem("etterlatte-store"));

const initialState: ISoknad = {
    sprak: "",
    fraDato: null,
    bekreftet: false,
    valgteStønader: [
        {
            label: "Pensjon-/overgangsstønad",
            checked: false,
        },
        {
            label: "Gjenlevendetillegg i uføretrygden",
            checked: false,
        },
        {
            label: "Barnepensjon",
            checked: false,
        },
        {
            label: "Stønad til barnetilsyn pga. arbeid",
            checked: false,
            beskjed:
                "Hvis du søker om stønad til barnetilsyn på grunn av arbeid eller stønad til skolepenger, vil NAV ta kontakt.",
        },
        {
            label: "Stønad til skolepenger",
            checked: false,
            beskjed:
                "Hvis du søker om stønad til barnetilsyn på grunn av arbeid eller stønad til skolepenger, vil NAV ta kontakt.",
        },
    ],
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
        case SoknadActionTypes.VELG_STØNAD: {
            const index = action.payload;
            const oppdatertListe = [...state.valgteStønader];

            let element = { ...oppdatertListe[index] };
            element.checked = !element.checked;
            oppdatertListe[index] = element;

            return { ...state, valgteStønader: oppdatertListe };
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
