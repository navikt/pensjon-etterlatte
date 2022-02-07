import { createContext, FC, useContext, useReducer } from "react"
import { ISoeknad, ISoeknadAction, SoeknadProps } from "./soeknad"

const initialState: ISoeknad = {};

const reducer = (state: ISoeknad, action: ISoeknadAction) => {
    switch (action.type) {
        default:
            return state;
    }
};

const SoeknadContext = createContext<SoeknadProps>({
    state: initialState,
    dispatch: () => {},
});

const useSoeknadContext = () => useContext(SoeknadContext);

const SoeknadProvider: FC = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    return <SoeknadContext.Provider value={{ state, dispatch }}>{children}</SoeknadContext.Provider>;
};

export { useSoeknadContext, SoeknadProvider };
