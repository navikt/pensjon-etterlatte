import { cleanup, render } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { JaNeiVetIkke } from '../../../../api/dto/FellesOpplysninger'
import { ApplicantRole } from '../../../../types/applicant'
import { IAboutChildren } from '../../../../types/person'
import { SummaryAboutChildren } from './SummaryAboutChildren'

/**
 * @vitest-environment jsdom
 */

vi.mock('../../../../hooks/useTranslation', () => ({
    default: (namespace: string) => ({
        t: (key: string, meta?: { ns?: string }) => `${meta?.ns ?? namespace}:${key}`,
    }),
}))

afterEach(cleanup)

const aboutChildren: IAboutChildren = {
    children: [
        { firstName: 'Kari', lastName: 'Nordmann', loggedInUserIsGuardian: JaNeiVetIkke.JA },
        { firstName: 'Per', lastName: 'Nordmann', loggedInUserIsGuardian: JaNeiVetIkke.NEI },
    ],
}

const renderChildren = (applicationRole: ApplicantRole, children = aboutChildren) =>
    render(
        <MemoryRouter>
            <SummaryAboutChildren
                aboutChildren={children}
                pathPrefix={applicationRole === ApplicantRole.GUARDIAN ? 'verge' : 'forelder'}
                applicationRole={applicationRole}
                parents={{ firstParent: undefined, secondParent: undefined }}
                unknownParent={false}
            />
        </MemoryRouter>
    )

describe('Oppsummering av barn', () => {
    it('viser søkerens svar om verge under riktig barn for både ja og nei', () => {
        const { getByText, getAllByText, queryByText } = renderChildren(ApplicantRole.GUARDIAN)

        const kari = getByText('Kari Nordmann').closest('.aksel-form-summary__answer')
        const per = getByText('Per Nordmann').closest('.aksel-form-summary__answer')
        const answers = getAllByText('aboutChildren:loggedInUserIsGuardian')

        expect(answers).toHaveLength(2)
        expect(kari?.contains(answers[0])).toBe(true)
        expect(kari?.contains(getByText('radiobuttons:JA'))).toBe(true)
        expect(per?.contains(answers[1])).toBe(true)
        expect(per?.contains(getByText('radiobuttons:NEI'))).toBe(true)
        expect(queryByText('aboutChildren:childHasGuardian')).toBeNull()
    })

    it('viser ikke spørsmålet om søkerens verge-rolle for en forelder', () => {
        const { getByText, queryByText } = renderChildren(ApplicantRole.PARENT, {
            children: [
                {
                    firstName: 'Kari',
                    lastName: 'Nordmann',
                    childHasGuardianship: { answer: JaNeiVetIkke.JA, firstName: 'Ola' },
                    loggedInUserIsGuardian: JaNeiVetIkke.NEI,
                },
            ],
        })

        expect(getByText('aboutChildren:childHasGuardian')).toBeDefined()
        expect(getByText('Ola')).toBeDefined()
        expect(queryByText('aboutChildren:loggedInUserIsGuardian')).toBeNull()
    })

    it('viser ikke et ubesvart verge-spørsmål', () => {
        const { queryByText } = renderChildren(ApplicantRole.GUARDIAN, {
            children: [{ firstName: 'Kari', lastName: 'Nordmann' }],
        })

        expect(queryByText('aboutChildren:loggedInUserIsGuardian')).toBeNull()
    })
})
