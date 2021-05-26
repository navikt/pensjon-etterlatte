export enum StegPath {
    SoknadType = "soeknad-type",
    OmSoekeren = "opplysninger-om-soekeren",
    OmAvdoed = "opplysninger-om-den-avdoede",
    OmBarn = "opplysninger-om-barn",
    TidlArbeidsforhold = "tidligere-arbeidsforhold",
    Arbeidsforhold = "naavaerende-arbeidsforhold",
    AndreYtelser = "andre-ytelser",
}

export enum StegLabelKey {
    SoknadType = "SoknadType",
    OmSoekeren = "OmSoekeren",
    OmAvdoed = "OmAvdoed",
    OmBarn = "OmBarn",
    TidlArbeidsforhold = "TidlArbeidsforhold",
    Arbeidsforhold = "Arbeidsforhold",
    AndreYtelser = "AndreYtelser",
}

export const MuligeSteg: IStegElement[] = [
    {
        path: StegPath.SoknadType,
        label: StegLabelKey.SoknadType,
        disabled: false,
    },
    {
        path: StegPath.OmSoekeren,
        label: StegLabelKey.OmSoekeren,
        disabled: true,
    },
    {
        path: StegPath.OmAvdoed,
        label: StegLabelKey.OmAvdoed,
        disabled: true,
    },
    {
        path: StegPath.OmBarn,
        label: StegLabelKey.OmBarn,
        disabled: true,
    },
    {
        path: StegPath.TidlArbeidsforhold,
        label: StegLabelKey.TidlArbeidsforhold,
        disabled: true,
    },
    {
        path: StegPath.Arbeidsforhold,
        label: StegLabelKey.Arbeidsforhold,
        disabled: true,
    },
    {
        path: StegPath.AndreYtelser,
        label: StegLabelKey.AndreYtelser,
        disabled: true,
    },
];

export interface IStegElement {
    path: StegPath;
    label: StegLabelKey;
    disabled: boolean;
}

export interface ISteg {
    aktivtSteg: StegPath;
    steg: IStegElement[];
}

export enum StegActionTypes {
    TILBAKESTILL,
    SETT_STEG,
    NESTE,
    FORRIGE,
}

export interface IStegAction {
    type: StegActionTypes;
    payload?: any;
}

export interface StegProps {
    state: ISteg;
    dispatch: (action: IStegAction) => void;
}
