import { createContext, FC, useContext, useReducer } from "react";
import {
    IOpplysningElement,
    ITidligereArbeidsforhold,
    ITidligereArbeidsforholdAction,
    TidlArbActionTypes,
    TidligereArbeidsforholdProps,
} from "./tidligere-arbeidsforhold";

const tomtElement: IOpplysningElement = {
    beskrivelse: "",
    varighet: "",
};

const initialState: ITidligereArbeidsforhold = {
    liste: [tomtElement],
};

const reducer = (state: ITidligereArbeidsforhold, action: ITidligereArbeidsforholdAction) => {
    switch (action.type) {
        case TidlArbActionTypes.OPPDATER_BESKRIVELSE: {
            const { index, value } = action.payload;
            const oppdatertListe = [...state.liste];

            let element = { ...oppdatertListe[index] };
            element.beskrivelse = value;
            oppdatertListe[index] = element;

            return { ...state, liste: oppdatertListe };
        }
        case TidlArbActionTypes.OPPDATER_VARIGHET: {
            const { index, value } = action.payload;
            const oppdatertListe = [...state.liste];

            let element = { ...oppdatertListe[index] };
            element.varighet = value;
            oppdatertListe[index] = element;

            return { ...state, liste: oppdatertListe };
        }
        case TidlArbActionTypes.LEGG_TIL_NY: {
            return { ...state, liste: [...state.liste, tomtElement] };
        }
        case TidlArbActionTypes.FJERN: {
            console.log(action.payload);
            const indexToDelete: number = action.payload;

            const nyListe = [...state.liste.filter((_: any, index: number) => index !== indexToDelete)];

            return { ...state, liste: nyListe };
        }
        default:
            return state;
    }
};

const TidligereArbeidsforholdContext = createContext<TidligereArbeidsforholdProps>({
    state: initialState,
    dispatch: () => {},
});

const useTidligereArbeidsforholdContext = () => useContext(TidligereArbeidsforholdContext);

const TidligereArbeidsforholdProvider: FC = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <TidligereArbeidsforholdContext.Provider value={{ state, dispatch }}>
            {children}
        </TidligereArbeidsforholdContext.Provider>
    );
};

export { useTidligereArbeidsforholdContext, TidligereArbeidsforholdProvider };
