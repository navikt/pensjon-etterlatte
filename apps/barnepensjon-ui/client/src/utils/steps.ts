import AboutYou from '../components/application/about-you/AboutYou'
import AboutChildren from '../components/application/about-children/AboutChildren'
import Summary from '../components/application/summary/Summary'
import AboutParents from '../components/application/about-parents/AboutParents'
import AboutTheDeceasedParentStep from '../components/application/the-deceased/AboutTheDeceasedParentStep'
import YourSituation from '../components/application/your-situation/YourSituation'

export enum StepPath {
    AboutYou = 'steg/om-deg',
    AboutTheParents = 'steg/om-foreldrene',
    AboutTheDeceased = 'steg/om-avdoede',
    YourSituation = 'steg/din-situasjon',
    AboutChildren = 'steg/om-barn',
    Summary = 'steg/oppsummering',
}

export interface StepType {
    label: string
    path: string
    element: any
}

/**
 * Forelder som søker på vegne av et eller flere barn under 18 år.
 *
 * Når den andre forelderen er død.
 */
export const ParentApplicantSteps: StepType[] = [
    {
        label: 'Om deg (den gjenlevende)',
        path: StepPath.AboutYou,
        element: AboutYou,
    },
    {
        label: 'Om den avdøde',
        path: StepPath.AboutTheDeceased,
        element: AboutTheDeceasedParentStep,
    },
    {
        label: 'Opplysninger om barna',
        path: StepPath.AboutChildren,
        element: AboutChildren,
    },
    {
        label: 'Oppsummering',
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
        label: 'Om deg (vergen)',
        path: StepPath.AboutYou,
        element: AboutYou,
    },
    {
        label: 'Om foreldrene',
        path: StepPath.AboutTheParents,
        element: AboutParents,
    },
    {
        label: 'Opplysninger om barna',
        path: StepPath.AboutChildren,
        element: AboutChildren,
    },
    {
        label: 'Oppsummering',
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
        label: 'Om deg',
        path: StepPath.AboutYou,
        element: AboutYou,
    },
    {
        label: 'Din situasjon',
        path: StepPath.YourSituation,
        element: YourSituation,
    },
    {
        label: 'Om foreldrene',
        path: StepPath.AboutTheParents,
        element: AboutParents,
    },
    {
        label: 'Opplysninger om søsken',
        path: StepPath.AboutChildren,
        element: AboutChildren,
    },
    {
        label: 'Oppsummering',
        path: StepPath.Summary,
        element: Summary,
    },
]
