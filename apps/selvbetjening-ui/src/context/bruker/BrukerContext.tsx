import { createContext, FC, useContext, useReducer } from "react";
import { ActionTypes, IBruker, IBrukerAction, StegProps } from "./bruker";

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
        case ActionTypes.INIT_TEST_BRUKER: {
            return {
                fornavn: "STERK",
                etternavn: "BUSK",
                foedselsnummer: "24014021406",
                adresse: "Testveien 12, 0539 Oslo",
                statsborgerskap: "Norsk",
                sivilstatus: "Gift",
            };
        }
        case ActionTypes.HENT_INNLOGGET_BRUKER: {
            const innloggetBruker: IBruker = action.payload;

            // TODO: Håndtere manglende person på en god måte
            if (!innloggetBruker) return state;

            return { ...innloggetBruker };
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
