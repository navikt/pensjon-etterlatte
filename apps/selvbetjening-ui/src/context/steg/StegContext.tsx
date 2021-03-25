import { createContext, FC, useContext, useReducer } from "react";
import { ISteg, IStegAction, StegActionTypes, StegProps } from "./steg";
import SoknadType from "../../components/soknad/1-type/SoknadType";
import OpplysningerOmSokeren from "../../components/soknad/2-soker/OpplysningerOmSokeren";
import OmDenAvdode from "../../components/soknad/3-avdod/OmDenAvdode";
import OpplysningerOmBarn from "../../components/soknad/4-barn/OpplysningerOmBarn";
import TidligereArbeidsforhold from "../../components/soknad/5-tidligerearbeidsforhold/TidligereArbeidsforhold";
import NavaerendeArbeidsforhold from "../../components/soknad/6-arbeidsforhold/NavaerendeArbeidsforhold";
import AndreYtelser from "../../components/soknad/7-andreytelser/AndreYtelser";
import Sprakform from "../../components/soknad/8-sprakform/Sprakform";
import ErklaeringOgUnderskrift from "../../components/soknad/9-signering/ErklaeringOgUnderskrift";

const initialState: ISteg = {
    aktivtSteg: undefined,
    steg: [
        {
            label: "1",
            component: SoknadType,
            path: "/steg/1",
            disabled: false,
        },
        {
            label: "2",
            component: OpplysningerOmSokeren,
            path: "/steg/2",
            disabled: true,
        },
        {
            label: "3",
            component: OmDenAvdode,
            path: "/steg/3",
            disabled: true,
        },
        {
            label: "4",
            component: OpplysningerOmBarn,
            path: "/steg/4",
            disabled: true,
        },
        {
            label: "5",
            component: TidligereArbeidsforhold,
            path: "/steg/5",
            disabled: true,
        },
        {
            label: "6",
            component: NavaerendeArbeidsforhold,
            path: "/steg/6",
            disabled: true,
        },
        {
            label: "7",
            component: AndreYtelser,
            path: "/steg/7",
            disabled: true,
        },
        {
            label: "8",
            component: Sprakform,
            path: "/steg/8",
            disabled: true,
        },
        {
            label: "9",
            component: ErklaeringOgUnderskrift,
            path: "/steg/9",
            disabled: true,
        },
    ],
};

const reducer = (state: ISteg, action: IStegAction) => {
    switch (action.type) {
        case StegActionTypes.FORRIGE:
        case StegActionTypes.NESTE: {
            const index = action.payload - 1;

            const oppdatertListe = [...state.steg];

            let element = { ...oppdatertListe[index] };
            element.disabled = false;
            oppdatertListe[index] = element;

            return {
                ...state,
                aktivtSteg: action.payload,
                steg: oppdatertListe,
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

    return <StegContext.Provider value={{ state, dispatch }}>{children}</StegContext.Provider>;
};

export { useStegContext, StegProvider };
