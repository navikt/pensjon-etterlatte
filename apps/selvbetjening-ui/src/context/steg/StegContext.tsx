import { createContext, FC, useContext, useReducer } from "react";
import { ISteg, IStegAction, MuligeSteg, StegActionTypes, StegPath, StegProps } from "./steg";

const STORAGE_KEY = "etterlatte-soknad-steg";

const json = localStorage.getItem(STORAGE_KEY) || null;
const lagretState = json ? JSON.parse(json) : null;

const initialState: ISteg = lagretState || {
    aktivtSteg: StegPath.DinSituasjon,
    steg: MuligeSteg,
};

const oppdaterSteg = (state: ISteg) => {
    const index = state.steg.findIndex((value) => value.path === state.aktivtSteg);
    const oppdaterteSteg = [...state.steg];

    oppdaterteSteg[index] = {
        ...oppdaterteSteg[index],
        disabled: false,
    };

    return { index, oppdaterteSteg };
};

const reducer = (state: ISteg, action: IStegAction) => {
    switch (action.type) {
        case StegActionTypes.TILBAKESTILL: {
            return {
                ...state,
                aktivtSteg: state.steg[0].path,
            };
        }
        case StegActionTypes.SETT_STEG: {
            return {
                ...state,
                aktivtSteg: action.payload
            };
        }
        case StegActionTypes.FORRIGE: {
            const { index, oppdaterteSteg } = oppdaterSteg(state);

            return {
                ...state,
                aktivtSteg: state.steg[index - 1].path,
                steg: oppdaterteSteg,
            };
        }
        case StegActionTypes.NESTE: {
            const { index, oppdaterteSteg } = oppdaterSteg(state);

            return {
                ...state,
                aktivtSteg: state.steg[index + 1].path,
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
