import { createContext, FC, useContext, useReducer } from "react";
import { ISoeknad, ISoeknadAction, SoeknadActionTypes, SoeknadProps } from "./soknad";

// const storedState = JSON.parse(localStorage.getItem("etterlatte-store"));

const initialState: ISoeknad = {
    spraak: "",
    fraDato: null,
    bekreftet: false,
    valgteStoenader: [
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
    soeker: null,
    kontaktinfo: undefined,
    opplysningerOmBarn: [],
};

const reducer = (state: ISoeknad, action: ISoeknadAction) => {
    switch (action.type) {
        case SoeknadActionTypes.HENT_INNLOGGET_BRUKER:
            return { ...state, soeker: action.payload };
        case SoeknadActionTypes.SETT_FRA_DATO:
            return { ...state, fraDato: action.payload };
        case SoeknadActionTypes.VELG_SPRAAK:
            return { ...state, spraak: action.payload };
        case SoeknadActionTypes.SETT_BEKREFTET:
            return { ...state, bekreftet: action.payload };
        case SoeknadActionTypes.BEKREFT_BOADRESSE:
            return { ...state, kontaktinfo: { ...state.kontaktinfo, boadresseBekreftet: action.payload } };
        case SoeknadActionTypes.OPPHOLD_NORGE:
            return { ...state, kontaktinfo: { ...state.kontaktinfo, oppholderSegINorge: action.payload } };
        case SoeknadActionTypes.SETT_TELEFON:
            return { ...state, kontaktinfo: { ...state.kontaktinfo, telefonnummer: action.payload } };
        case SoeknadActionTypes.SETT_EPOST:
            return { ...state, kontaktinfo: { ...state.kontaktinfo, epost: action.payload } };
        case SoeknadActionTypes.VELG_STOENAD: {
            const index = action.payload;
            const oppdatertListe = [...state.valgteStoenader];

            let element = { ...oppdatertListe[index] };
            element.checked = !element.checked;
            oppdatertListe[index] = element;

            return { ...state, valgteStoenader: oppdatertListe };
        }
        case SoeknadActionTypes.LEGG_TIL_BARN: {
            const { opplysningerOmBarn } = state;

            opplysningerOmBarn.push(action.payload);

            return { ...state, opplysningerOmBarn };
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

    // localStorage.setItem('etterlatte-store', JSON.stringify(state))

    return <SoknadContext.Provider value={{ state, dispatch }}>{children}</SoknadContext.Provider>;
};

export { useSoknadContext, SoknadProvider };
