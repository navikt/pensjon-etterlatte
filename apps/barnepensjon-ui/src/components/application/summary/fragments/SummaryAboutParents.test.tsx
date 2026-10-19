import { cleanup, render } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { JaNeiVetIkke } from '../../../../api/dto/FellesOpplysninger'
import { IDeceasedParent, ILivingParent } from '../../../../context/application/application'
import { SummaryAboutDeceasedParent } from './SummaryAboutDeceasedParent'
import { SummaryAboutLivingParent } from './SummaryAboutLivingParent'

/**
 * @vitest-environment jsdom
 */

vi.mock('../../../../hooks/useTranslation', () => ({
    default: (namespace: string) => ({
        t: (key: string, meta?: { ns?: string }) => `${meta?.ns ?? namespace}:${key}`,
    }),
}))

afterEach(cleanup)

const parent = {
    firstName: 'Kari',
    lastName: 'Nordmann',
    fnrDnr: '12345678910',
    citizenship: 'Norge',
}

describe('Oppsummering av foreldre', () => {
    it.each([0, 1, 2])('viser direkte svar og %s grupperte utenlandsopphold om den avdøde', (numberOfStays) => {
        const countries = ['Danmark', 'Sverige'].slice(0, numberOfStays)
        const deceasedParent: IDeceasedParent = {
            ...parent,
            dateOfDeath: new Date('2026-09-01'),
            staysAbroad: {
                hasStaysAbroad: numberOfStays ? JaNeiVetIkke.JA : JaNeiVetIkke.NEI,
                abroadStays: countries.map((country) => ({
                    country,
                    type: [],
                    medlemFolketrygd: JaNeiVetIkke.NEI,
                    pension: {},
                })),
            },
        }
        const { container, getByText, queryByText } = render(
            <MemoryRouter>
                <SummaryAboutDeceasedParent aboutTheParent={deceasedParent} pathPrefix="forelder" />
            </MemoryRouter>
        )

        const answers = container.querySelector('dl')
        expect(answers).not.toBeNull()
        expect(queryByText('aboutYou:subtitle.personalia')).toBeNull()
        expect(queryByText('aboutTheDeceased:deathAndStaysAbroad')).toBeNull()
        expect(getByText('Kari').closest('dl')).toBe(answers)
        expect(getByText('Nordmann').closest('dl')).toBe(answers)
        expect(getByText('aboutTheDeceased:dateOfDeath').closest('dl')).toBe(answers)
        expect(getByText('aboutTheDeceased:occupationalInjury').closest('dl')).toBe(answers)
        expect(getByText('aboutTheDeceased:didTheDeceasedLiveAbroad').closest('dl')).toBe(answers)
        expect(container.querySelectorAll('dl dl')).toHaveLength(numberOfStays)
        for (const country of countries) {
            const stay = getByText(`Opphold i ${country}`).closest('.aksel-form-summary__answer')
            expect(stay?.parentElement).toBe(answers)
            expect(stay?.querySelector('dl')?.contains(getByText(country))).toBe(true)
        }
    })

    it('viser personalia, adresse og telefon om levende forelder uten gruppe eller undertittel', () => {
        const livingParent: ILivingParent = {
            ...parent,
            address: 'Storgata 1',
            phoneNumber: '12345678',
        }
        const { container, getByText, queryByText } = render(
            <MemoryRouter>
                <SummaryAboutLivingParent aboutTheParent={livingParent} pathPrefix="forelder" />
            </MemoryRouter>
        )

        const answers = container.querySelector('dl')
        expect(container.querySelectorAll('dl')).toHaveLength(1)
        expect(queryByText('aboutYou:subtitle.personalia')).toBeNull()
        expect(getByText('Kari').closest('dl')).toBe(answers)
        expect(getByText('Storgata 1').closest('dl')).toBe(answers)
        expect(getByText('12345678').closest('dl')).toBe(answers)
    })
})
