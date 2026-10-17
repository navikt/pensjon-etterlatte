import { cleanup, render } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { JaNeiVetIkke } from '../../../../api/dto/FellesOpplysninger'
import { SummaryAboutYou } from './SummaryAboutYou'

/**
 * @vitest-environment jsdom
 */

vi.mock('../../../../hooks/useTranslation', () => ({
    default: (namespace: string) => ({
        t: (key: string, meta?: { ns?: string }) => `${meta?.ns ?? namespace}:${key}`,
    }),
}))

afterEach(cleanup)

describe('Oppsummering om deg', () => {
    it.each(['forelder', 'verge', 'barn'])('viser svar uten personalia-gruppe for %s', (pathPrefix) => {
        const { container, getByRole, getByText, queryByText } = render(
            <MemoryRouter>
                <SummaryAboutYou
                    user={{
                        fornavn: 'Kari',
                        etternavn: 'Nordmann',
                        foedselsnummer: '12345678910',
                        statsborgerskap: 'Norge',
                    }}
                    aboutYou={{
                        phoneNumber: '12345678',
                        addressOfResidenceConfirmed: JaNeiVetIkke.NEI,
                        alternativeAddress: 'Testveien 1',
                    }}
                    pathPrefix={pathPrefix}
                />
            </MemoryRouter>
        )

        const answers = container.querySelector('dl')
        expect(container.querySelectorAll('dl')).toHaveLength(1)
        expect(queryByText('aboutYou:subtitle.personalia')).toBeNull()
        expect(
            getByRole('heading', {
                level: 2,
                name: pathPrefix === 'verge' ? 'aboutYou:titleGuardian' : 'aboutYou:title',
            })
        ).toBeDefined()
        for (const value of ['Kari Nordmann', '12345678910', 'Norge', '12345678', 'Testveien 1']) {
            expect(getByText(value).closest('dl')).toBe(answers)
        }
    })
})
