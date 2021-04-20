import { createContext, FC, useContext, useReducer } from "react";
import { ISteg, IStegAction, StegActionTypes, StegProps } from "./steg";
import SoeknadType from "../../components/soknad/1-type/SoeknadType";
import OpplysningerOmSokeren from "../../components/soknad/2-soker/OpplysningerOmSokeren";
import OmDenAvdode from "../../components/soknad/3-avdod/OmDenAvdode";
import OpplysningerOmBarn from "../../components/soknad/4-barn/OpplysningerOmBarn";
import TidligereArbeidsforhold from "../../components/soknad/5-tidligerearbeidsforhold/TidligereArbeidsforhold";
import NavaerendeArbeidsforhold from "../../components/soknad/6-arbeidsforhold/NavaerendeArbeidsforhold";
import AndreYtelser from "../../components/soknad/7-andreytelser/AndreYtelser";

const STORAGE_KEY = "etterlatte-soknad-steg";

const lagretSteg = localStorage.getItem(STORAGE_KEY) || null;

const initialState: ISteg = {
    aktivtSteg: lagretSteg ? Number(lagretSteg) : 1,
    steg: [
        {
            component: SoeknadType,
            disabled: false,
        },
        {
            component: OpplysningerOmSokeren,
            disabled: true,
        },
        {
            component: OmDenAvdode,
            disabled: true,
        },
        {
            component: OpplysningerOmBarn,
            disabled: true,
        },
        {
            component: TidligereArbeidsforhold,
            disabled: true,
        },
        {
            component: NavaerendeArbeidsforhold,
            disabled: true,
        },
        {
            component: AndreYtelser,
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

    localStorage.setItem(STORAGE_KEY, `${state.aktivtSteg}`);

    return <StegContext.Provider value={{ state, dispatch }}>{children}</StegContext.Provider>;
};

export { useStegContext, StegProvider };
