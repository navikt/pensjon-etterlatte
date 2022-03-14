export enum StepPath {
    AboutYou = 'om-deg',
    OmDegOgAvdoed = 'om-deg-og-avdoed',
    AboutTheParents = 'om-foreldrene',
    YourSituation = 'din-situasjon',
    AboutChildren = 'om-barn',
    Summary = 'oppsummering',
}

export enum StepLabelKey {
    AboutYou = 'steg.OmDeg',
    OmDegOgAvdoed = 'steg.OmDegOgAvdoed',
    AboutTheParents = 'steg.AboutTheParents',
    YourSituation = 'steg.YourSituation',
    AboutChildren = 'steg.AboutChildren',
    Summary = 'steg.Summary',
}

export const PossibleSteps: IStepElement[] = [
    {
        path: StepPath.AboutYou,
        label: StepLabelKey.AboutYou,
    },
    {
        path: StepPath.OmDegOgAvdoed,
        label: StepLabelKey.OmDegOgAvdoed,
    },
    {
        path: StepPath.AboutTheParents,
        label: StepLabelKey.AboutTheParents,
    },
    {
        path: StepPath.YourSituation,
        label: StepLabelKey.YourSituation,
    },
    {
        path: StepPath.AboutChildren,
        label: StepLabelKey.AboutChildren,
    },
    {
        path: StepPath.Summary,
        label: StepLabelKey.Summary,
    },
]

export interface IStepElement {
    path: StepPath
    label: StepLabelKey
}
