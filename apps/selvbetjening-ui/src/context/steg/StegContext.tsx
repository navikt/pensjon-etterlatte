import { createContext, FC, useContext, useReducer } from "react";
import { ISteg, IStegAction, StegActionTypes, StegProps } from "./steg";

const STORAGE_KEY = "etterlatte-soknad-steg";

const json = localStorage.getItem(STORAGE_KEY) || null;
const lagretState = json ? JSON.parse(json) : null;

const initialState: ISteg = lagretState || {
    aktivtSteg: 1,
    steg: [
        {
            path: "soeknad-type",
            label: "Hva søker du?",
            disabled: false,
        },
        {
            path: "opplysninger-om-sokeren",
            label: "Opplysninger om søkeren",
            disabled: true,
        },
        {
            path: "om-den-avdode",
            label: "Opplysninger om den avdøde",
            disabled: true,
        },
        {
            path: "opplysninger-om-barn",
            label: "Opplysninger om barn",
            disabled: true,
        },
        {
            path: "tidligere-arbeidsforhold",
            label: "Tidligere arbeidsforhold, kurs, m.m.",
            disabled: true,
        },
        {
            path: "navaerende-arbeidsforhold",
            label: "Nåværende arbeidsforhold",
            disabled: true,
        },
        {
            path: "andre-ytelser",
            label: "Andre ytelser",
            disabled: true,
        },
    ],
};

const oppdaterSteg = (state: ISteg) => {
    const index = state.aktivtSteg - 1;
    const oppdaterteSteg = [...state.steg];

    let element = { ...oppdaterteSteg[index] };
    element.disabled = false;
    oppdaterteSteg[index] = element;

    return { index, oppdaterteSteg };
};

const reducer = (state: ISteg, action: IStegAction) => {
    switch (action.type) {
        case StegActionTypes.TILBAKESTILL: {
            return {
                ...state,
                aktivtSteg: 1,
            };
        }
        case StegActionTypes.SETT_STEG: {
            const index = action.payload;
            const oppdaterteSteg = [...state.steg];

            let element = { ...oppdaterteSteg[index] };
            element.disabled = false;
            oppdaterteSteg[index] = element;

            return {
                ...state,
                aktivtSteg: index + 1,
                steg: oppdaterteSteg,
            };
        }
        case StegActionTypes.FORRIGE: {
            const { index, oppdaterteSteg } = oppdaterSteg(state);

            return {
                ...state,
                aktivtSteg: index,
                steg: oppdaterteSteg,
            };
        }
        case StegActionTypes.NESTE: {
            const { oppdaterteSteg } = oppdaterSteg(state);

            return {
                ...state,
                aktivtSteg: state.aktivtSteg + 1,
                steg: oppdaterteSteg,
            };
        }
        default:
            return { ...state };
    }
};

const StegContext = createContext<StegProps>({
    state: initialState,
    dispatch: () => {},
});

const useStegContext = () => useContext(StegContext);

const StegProvider: FC = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));

    return <StegContext.Provider value={{ state, dispatch }}>{children}</StegContext.Provider>;
};

export { useStegContext, StegProvider };
