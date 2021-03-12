import { createContext, FC, useContext, useReducer } from "react";
import { AndreYtelserActionTypes, AndreYtelserProps, IAndreYtelser, IAndreYtelserAction } from "./andre-ytelser";

// const storedState = JSON.parse(localStorage.getItem("etterlatte-store"));

const initialState: IAndreYtelser = {
    mottarAndreYtelser: "",
    harKravOmAnnenStonad: "",
    annenStonadBeskrivelse: "",
    mottarPensjonFraUtlandet: "",
    pensjonUtlandBeskrivelse: "",
    pensjonUtlandBruttobelop: "",
};

const reducer = (state: IAndreYtelser, action: IAndreYtelserAction) => {
    switch (action.type) {
        case AndreYtelserActionTypes.SET_ANDRE_YTELSER:
            return { ...state, mottarAndreYtelser: action.payload };
        case AndreYtelserActionTypes.SET_KRAV_OM_ANNEN_STONAD:
            return { ...state, harKravOmAnnenStonad: action.payload };
        case AndreYtelserActionTypes.SET_ANNEN_STONAD_BESKRIVELSE:
            return { ...state, annenStonadBeskrivelse: action.payload };
        case AndreYtelserActionTypes.SET_MOTTAR_PENSJON_UTLAND:
            return { ...state, mottarPensjonFraUtlandet: action.payload };
        case AndreYtelserActionTypes.SET_PENSJON_UTLAND_BESKRIVELSE:
            return { ...state, pensjonUtlandBeskrivelse: action.payload };
        case AndreYtelserActionTypes.SET_PENSJON_UTLAND_BRUTTOBELOP:
            return { ...state, pensjonUtlandBruttobelop: action.payload };
        default:
            return state;
    }
};

const AndreYtelserContext = createContext<AndreYtelserProps>({
    state: initialState,
    dispatch: () => {},
});

const useAndreYtelserContext = () => useContext(AndreYtelserContext);

const AndreYtelserProvider: FC = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    // localStorage.setItem('etterlatte-store', JSON.stringify(state))

    return <AndreYtelserContext.Provider value={{ state, dispatch }}>{children}</AndreYtelserContext.Provider>;
};

export { useAndreYtelserContext, AndreYtelserProvider };
