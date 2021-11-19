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
        label: StegLabelKey.OmDeg
    },
    {
        path: StegPath.OmDegOgAvdoed,
        label: StegLabelKey.OmDegOgAvdoed
    },
    {
        path: StegPath.OmAvdoed,
        label: StegLabelKey.OmAvdoed
    },
    {
        path: StegPath.DinSituasjon,
        label: StegLabelKey.DinSituasjon
    },
    {
        path: StegPath.OmBarn,
        label: StegLabelKey.OmBarn
    },
    {
        path: StegPath.Oppsummering,
        label: StegLabelKey.Oppsummering
    },
];

export interface IStegElement {
    path: StegPath;
    label: StegLabelKey;
}
