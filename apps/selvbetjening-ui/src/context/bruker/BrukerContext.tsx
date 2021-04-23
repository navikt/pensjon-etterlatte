import { createContext, FC, useContext, useReducer } from "react";
import { IBruker, IBrukerAction, ActionTypes, StegProps } from "./bruker";

const initialState: IBruker = {
    fornavn: "",
    etternavn: "",
    foedselsnummer: "",
    adresse: "",
    statsborgerskap: "",
    sivilstatus: "",
};

const reducer = (state: IBruker, action: IBrukerAction) => {
    switch (action.type) {
        case ActionTypes.TILBAKESTILL: {
            return {
                ...state,
            };
        }
        case ActionTypes.HENT_INNLOGGET_BRUKER: {
            const innloggetBruker: IBruker = action.payload;

            // TODO: Håndtere manglende person på en god måte
            if (!innloggetBruker) return state;

            return { ...state, innloggetBruker };
        }
        default:
            return { ...state };
    }
};

const StegContext = createContext<StegProps>({
    state: initialState,
    dispatch: () => {},
});

const useBrukerContext = () => useContext(StegContext);

const BrukerProvider: FC = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    return <StegContext.Provider value={{ state, dispatch }}>{children}</StegContext.Provider>;
};

export { useBrukerContext, BrukerProvider };
