export enum StegPath {
    OmDeg = "om-deg",
    OmDegOgAvdoed = "om-deg-og-avdoed",
    OmAvdoed = "om-den-avdoede",
    DinSituasjon = "din-situasjon",
    OmBarn = "om-barn",
    Oppsummering = "oppsummering",
}

export enum StegLabelKey {
    OmDeg = "OmDeg",
    OmDegOgAvdoed = "OmDegOgAvdoed",
    OmAvdoed = "OmAvdoed",
    DinSituasjon = "DinSituasjon",
    OmBarn = "OmBarn",
    Oppsummering = "Oppsummering"
}

export const MuligeSteg: IStegElement[] = [
    {
        path: StegPath.OmDeg,
        label: StegLabelKey.OmDeg,
        disabled: false,
    },
    {
        path: StegPath.OmDegOgAvdoed,
        label: StegLabelKey.OmDegOgAvdoed,
        disabled: false,
    },
    {
        path: StegPath.OmAvdoed,
        label: StegLabelKey.OmAvdoed,
        disabled: false,
    },
    {
        path: StegPath.DinSituasjon,
        label: StegLabelKey.DinSituasjon,
        disabled: false,
    },
    {
        path: StegPath.OmBarn,
        label: StegLabelKey.OmBarn,
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
