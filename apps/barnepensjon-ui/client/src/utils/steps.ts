import AboutYou from '../components/application/about-you/AboutYou'
import AboutChildren from '../components/application/about-children/AboutChildren'
import Summary from '../components/application/summary/Summary'
import AboutTheDeceased from '../components/application/the-deceased/AboutTheDeceased'
import FirstParent from '../components/application/parents/FirstParent'
import SecondParent from '../components/application/parents/SecondParent'

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
        path: 'steg/om-deg',
        element: AboutYou,
    },
    {
        label: 'Om den avdøde',
        path: 'steg/om-avdoede',
        element: AboutTheDeceased,
    },
    {
        label: 'Opplysninger om barna',
        path: 'steg/om-barn',
        element: AboutChildren,
    },
    {
        label: 'Oppsummering',
        path: 'steg/oppsummering',
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
        path: 'steg/om-deg',
        element: AboutYou,
    },
    {
        label: 'Om den ene forelderen',
        path: 'steg/forelder-1',
        element: FirstParent,
    },
    {
        label: 'Om den andre forelderen',
        path: 'steg/forelder-2',
        element: SecondParent,
    },
    {
        label: 'Opplysninger om barna',
        path: 'steg/om-barn',
        element: AboutChildren,
    },
    {
        label: 'Oppsummering',
        path: 'steg/oppsummering',
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
        label: 'Om deg (og eventuelle søsken)',
        path: 'steg/om-deg',
        element: AboutYou,
    },
    {
        label: 'Om den ene forelderen',
        path: 'steg/forelder-1',
        element: FirstParent,
    },
    {
        label: 'Om den andre forelderen',
        path: 'steg/forelder-2',
        element: SecondParent,
    },
    {
        label: 'Opplysninger om barna',
        path: 'steg/om-barn',
        element: AboutChildren,
    },
    {
        label: 'Oppsummering',
        path: 'steg/oppsummering',
        element: Summary,
    },
]
