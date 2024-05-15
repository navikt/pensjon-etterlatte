export enum StegPath {
    OmDeg = 'om-deg',
    OmDegOgAvdoed = 'om-deg-og-avdoed',
    OmAvdoed = 'om-den-avdoede',
    SituasjonenDin = 'situasjonen-din',
    MerOmSituasjonenDin = 'mer-om-situasjonen-din',
    InntektenDin = 'inntekten-din',
    OmBarn = 'om-barn',
    Oppsummering = 'oppsummering',
}

export enum StegLabelKey {
    OmDeg = 'steg.OmDeg',
    OmDegOgAvdoed = 'steg.OmDegOgAvdoed',
    OmAvdoed = 'steg.OmAvdoed',
    SituasjonenDin = 'steg.SituasjonenDin',
    MerOmSituasjonenDin = 'steg.MerOmSituasjonenDin',
    InntektenDin = 'steg.InntektenDin',
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
        path: StegPath.SituasjonenDin,
        label: StegLabelKey.SituasjonenDin,
    },
    {
        path: StegPath.MerOmSituasjonenDin,
        label: StegLabelKey.MerOmSituasjonenDin,
    },
    {
        path: StegPath.InntektenDin,
        label: StegLabelKey.InntektenDin,
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
