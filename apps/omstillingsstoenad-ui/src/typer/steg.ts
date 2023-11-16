export enum StegPath {
    OmDeg = 'om-deg',
    OmDegOgAvdoed = 'om-deg-og-avdoed',
    OmAvdoed = 'om-den-avdoede',
    DinSituasjon = 'situasjonen-din',
    InntektenDin = 'inntekten-din',
    OmsorgForBarn = 'omsorg-for-barn',
    OmBarn = 'om-barn',
    Oppsummering = 'oppsummering',
}

export enum StegLabelKey {
    OmDeg = 'steg.OmDeg',
    OmDegOgAvdoed = 'steg.OmDegOgAvdoed',
    OmAvdoed = 'steg.OmAvdoed',
    DinSituasjon = 'steg.DinSituasjon',
    InntektenDin = 'steg.InntektenDin',
    OmsorgForBarn = 'steg.OmsorgForBarn',
    OmBarn = 'steg.OmBarn',
    Oppsummering = 'steg.Oppsummering',
}

export const MuligeSteg: IStegElement[] = [
    {
        path: StegPath.OmDeg,
        label: StegLabelKey.OmDeg,
    },
    {
        path: StegPath.OmAvdoed,
        label: StegLabelKey.OmAvdoed,
    },
    {
        path: StegPath.OmDegOgAvdoed,
        label: StegLabelKey.OmDegOgAvdoed,
    },
    {
        path: StegPath.DinSituasjon,
        label: StegLabelKey.DinSituasjon,
    },
    {
        path: StegPath.InntektenDin,
        label: StegLabelKey.InntektenDin,
    },
    {
        path: StegPath.OmsorgForBarn,
        label: StegLabelKey.OmsorgForBarn,
    },
    {
        path: StegPath.OmBarn,
        label: StegLabelKey.OmBarn,
    },
    {
        path: StegPath.Oppsummering,
        label: StegLabelKey.Oppsummering,
    },
]

export interface IStegElement {
    path: StegPath
    label: StegLabelKey
}
