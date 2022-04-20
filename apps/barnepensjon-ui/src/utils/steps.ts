import AboutYou from '../components/application/about-you/AboutYou'
import AboutChildren from '../components/application/about-children/AboutChildren'
import Summary from '../components/application/summary/Summary'
import AboutParents from '../components/application/about-parents/AboutParents'
import AboutTheDeceasedParentStep from '../components/application/the-deceased/AboutTheDeceasedParentStep'
import YourSituation from '../components/application/your-situation/YourSituation'

export enum StepLabelKey {
    AboutYou = 'AboutYou',
    AboutTheParents = 'AboutTheParents',
    AboutTheDeceased = 'AboutTheDeceased',
    YourSituation = 'YourSituation',
    AboutChildren = 'AboutChildren',
    Summary = 'Summary',
}

export enum StepPath {
    AboutYou = 'steg/om-deg',
    AboutTheParents = 'steg/om-foreldrene',
    AboutTheDeceased = 'steg/om-avdoede',
    YourSituation = 'steg/din-situasjon',
    AboutChildren = 'steg/om-barn',
    Summary = 'steg/oppsummering',
}

export enum StepPrefix {
    GUARDIAN = 'verge',
    Parent = 'forelder',
    Child = 'barn',
}

export interface StepType {
    label: StepLabelKey
    path: StepPath
    element: any
}

/**
 * Forelder som søker på vegne av et eller flere barn under 18 år.
 *
 * Når den andre forelderen er død.
 */
export const ParentApplicantSteps: StepType[] = [
    {
        label: StepLabelKey.AboutYou,
        path: StepPath.AboutYou,
        element: AboutYou,
    },
    {
        label: StepLabelKey.AboutTheDeceased,
        path: StepPath.AboutTheDeceased,
        element: AboutTheDeceasedParentStep,
    },
    {
        label: StepLabelKey.AboutChildren,
        path: StepPath.AboutChildren,
        element: AboutChildren,
    },
    {
        label: StepLabelKey.Summary,
        path: StepPath.Summary,
        element: Summary,
    },
]

/**
 * Verge som søker på vegne av et eller flere barn under 18 år.
 *
 * Når en eller begge foreldre er døde.
 */
export const GuardianApplicantSteps: StepType[] = [
    {
        label: StepLabelKey.AboutYou,
        path: StepPath.AboutYou,
        element: AboutYou,
    },
    {
        label: StepLabelKey.AboutTheParents,
        path: StepPath.AboutTheParents,
        element: AboutParents,
    },
    {
        label: StepLabelKey.AboutChildren,
        path: StepPath.AboutChildren,
        element: AboutChildren,
    },
    {
        label: StepLabelKey.Summary,
        path: StepPath.Summary,
        element: Summary,
    },
]

/**
 * Barnet er 18-20 år og søker selv.
 *
 * Når en eller begge foreldre er døde.
 */
export const ChildApplicantSteps: StepType[] = [
    {
        label: StepLabelKey.AboutYou,
        path: StepPath.AboutYou,
        element: AboutYou,
    },
    {
        label: StepLabelKey.YourSituation,
        path: StepPath.YourSituation,
        element: YourSituation,
    },
    {
        label: StepLabelKey.AboutTheParents,
        path: StepPath.AboutTheParents,
        element: AboutParents,
    },
    {
        label: StepLabelKey.AboutChildren,
        path: StepPath.AboutChildren,
        element: AboutChildren,
    },
    {
        label: StepLabelKey.Summary,
        path: StepPath.Summary,
        element: Summary,
    },
]
