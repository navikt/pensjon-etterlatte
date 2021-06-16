export enum StegPath {
    DinSituasjon = "din-situasjon",
    OmSoekeren = "om-deg",
    OmAvdoed = "om-den-avdoede",
    OmBarn = "om-barn",
    TidlArbeidsforhold = "tidligere-arbeidsforhold",
    Arbeidsforhold = "naavaerende-arbeidsforhold",
    AndreYtelser = "andre-ytelser",
    Oppsummering = "oppsummering",
}

export enum StegLabelKey {
    DinSituasjon = "DinSituasjon",
    OmSoekeren = "OmSoekeren",
    OmAvdoed = "OmAvdoed",
    OmBarn = "OmBarn",
    TidlArbeidsforhold = "TidlArbeidsforhold",
    Arbeidsforhold = "Arbeidsforhold",
    AndreYtelser = "AndreYtelser",
    Oppsummering = "Oppsummering"
}

export const MuligeSteg: IStegElement[] = [
    {
        path: StegPath.DinSituasjon,
        label: StegLabelKey.DinSituasjon,
        disabled: false,
    },
    {
        path: StegPath.OmSoekeren,
        label: StegLabelKey.OmSoekeren,
        disabled: false,
    },
    {
        path: StegPath.OmAvdoed,
        label: StegLabelKey.OmAvdoed,
        disabled: false,
    },
    {
        path: StegPath.OmBarn,
        label: StegLabelKey.OmBarn,
        disabled: false,
    },
    {
        path: StegPath.TidlArbeidsforhold,
        label: StegLabelKey.TidlArbeidsforhold,
        disabled: false,
    },
    {
        path: StegPath.Arbeidsforhold,
        label: StegLabelKey.Arbeidsforhold,
        disabled: false,
    },
    {
        path: StegPath.AndreYtelser,
        label: StegLabelKey.AndreYtelser,
        disabled: false,
    },
    {
        path: StegPath.Oppsummering,
        label: StegLabelKey.Oppsummering,
        disabled: false,
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
    TILBAKESTILL = "TILBAKESTILL",
    SETT_STEG = "SETT_STEG",
    NESTE = "NESTE",
    FORRIGE = "FORRIGE",
}

export interface IStegAction {
    type: StegActionTypes;
    payload?: any;
}

export interface StegProps {
    state: ISteg;
    dispatch: (action: IStegAction) => void;
}
