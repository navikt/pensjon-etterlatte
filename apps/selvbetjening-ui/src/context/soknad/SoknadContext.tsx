import { createContext, FC, useContext, useReducer } from "react";
import { ISoeknad, ISoeknadAction, SoeknadActionTypes, SoeknadProps } from "./soknad";
import { IPdlPerson, ISoeker } from "../../typer/person";

const STORAGE_KEY = "etterlatte-store";

const json = localStorage.getItem(STORAGE_KEY);
const storedState = json ? JSON.parse(json) : null;

const initialState: ISoeknad = storedState || {
    stoenadType: null,
    opplysningerOmSoekeren: null,
    opplysningerOmDenAvdoede: null,
    opplysningerOmBarn: [],
    tidligereArbeidsforhold: [],
    naavaerendeArbeidsforhold: null,
    andreYtelser: null,
};

const reducer = (state: ISoeknad, action: ISoeknadAction) => {
    switch (action.type) {
        case SoeknadActionTypes.HENT_INNLOGGET_BRUKER: {
            const pdlPerson: IPdlPerson = action.payload;

            // TODO: Håndtere manglende person på en god måte
            if (!pdlPerson) return state;

            const opplysningerOmSoekeren: ISoeker = {
                ...state.opplysningerOmSoekeren,
                foedselsnummer: pdlPerson.foedselsnummer,
                navn: {
                    fornavn: pdlPerson.fornavn,
                    etternavn: pdlPerson.etternavn,
                },
                bosted: {
                    adresse: pdlPerson.adresse,
                },
                statsborgerskap: pdlPerson.statsborgerskap,
                sivilstatus: pdlPerson.sivilstatus,
            };

            return { ...state, opplysningerOmSoekeren };
        }
        case SoeknadActionTypes.BEKREFT_BOADRESSE: {
            return {
                ...state,
                opplysningerOmSoekeren: {
                    ...state.opplysningerOmSoekeren,
                    bosted: {
                        ...state.opplysningerOmSoekeren?.bosted,
                        boadresseBekreftet: action.payload,
                    },
                },
            };
        }
        case SoeknadActionTypes.OPPDATER_VALGTE_STOENADER:
            return { ...state, stoenadType: action.payload };
        case SoeknadActionTypes.OPPDATER_AVDOED:
            return { ...state, opplysningerOmDenAvdoede: action.payload };
        case SoeknadActionTypes.LEGG_TIL_BARN: {
            const { opplysningerOmBarn } = state;

            opplysningerOmBarn.push(action.payload);

            return { ...state, opplysningerOmBarn };
        }
        case SoeknadActionTypes.LEGG_TIL_TIDLIGERE_ARBEIDSFORHOLD: {
            return { ...state, tidligereArbeidsforhold: [...state.tidligereArbeidsforhold, action.payload] };
        }
        case SoeknadActionTypes.FJERN_TIDLIGERE_ARBEIDSFORHOLD: {
            const indexToDelete: number = action.payload;

            const tidligereArbeidsforhold = [
                ...state.tidligereArbeidsforhold.filter((_: any, index: number) => index !== indexToDelete),
            ];

            return { ...state, tidligereArbeidsforhold };
        }
        case SoeknadActionTypes.OPPDATER_NAAVAERENDE_ARBEIDSFORHOLD:
            return { ...state, naavaerendeArbeidsforhold: action.payload };
        case SoeknadActionTypes.OPPDATER_ANDRE_YTELSER:
            return { ...state, andreYtelser: action.payload };
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

    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));

    return <SoknadContext.Provider value={{ state, dispatch }}>{children}</SoknadContext.Provider>;
};

export { useSoknadContext, SoknadProvider };
