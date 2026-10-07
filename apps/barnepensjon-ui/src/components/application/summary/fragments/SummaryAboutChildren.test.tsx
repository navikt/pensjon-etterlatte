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
    it('viser ikke søkerens verge-svar selv om ja eller nei er oppgitt', () => {
        const { getByText, queryByText } = renderChildren(ApplicantRole.GUARDIAN)

        expect(getByText('Kari Nordmann')).toBeDefined()
        expect(getByText('Per Nordmann')).toBeDefined()
        expect(queryByText('aboutChildren:loggedInUserIsGuardian')).toBeNull()
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
