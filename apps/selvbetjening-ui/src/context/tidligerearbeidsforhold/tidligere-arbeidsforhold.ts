export interface TidligereArbeidsforholdProps {
    state: ITidligereArbeidsforhold;
    dispatch: (action: ITidligereArbeidsforholdAction) => void;
}

export interface IOpplysningElement {
    beskrivelse: string;
    varighet: string;
}

export interface ITidligereArbeidsforhold {
    liste: IOpplysningElement[];
}

export enum TidlArbActionTypes {
    OPPDATER_BESKRIVELSE,
    OPPDATER_VARIGHET,
    LEGG_TIL_NY,
    FJERN,
}

export interface ITidligereArbeidsforholdAction {
    type: TidlArbActionTypes;
    payload?: any;
}
