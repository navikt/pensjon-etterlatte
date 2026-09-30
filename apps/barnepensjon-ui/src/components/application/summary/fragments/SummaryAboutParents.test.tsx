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
    it.each([false, true])('grupperer personalia om den avdøde med utenlandsopphold: %s', (hasStaysAbroad) => {
        const deceasedParent: IDeceasedParent = {
            ...parent,
            dateOfDeath: new Date('2026-09-01'),
            staysAbroad: {
                hasStaysAbroad: hasStaysAbroad ? JaNeiVetIkke.JA : JaNeiVetIkke.NEI,
                abroadStays: hasStaysAbroad
                    ? [{ country: 'Danmark', type: [], medlemFolketrygd: JaNeiVetIkke.NEI, pension: {} }]
                    : [],
            },
        }
        const { getByText } = render(
            <MemoryRouter>
                <SummaryAboutDeceasedParent aboutTheParent={deceasedParent} pathPrefix="forelder" />
            </MemoryRouter>
        )

        const personalia = getByText('aboutYou:subtitle.personalia').closest('.aksel-form-summary__answer')
        const personaliaAnswers = personalia?.querySelector('.aksel-form-summary__value .aksel-form-summary__answers')
        expect(personaliaAnswers?.contains(getByText('Kari'))).toBe(true)
        expect(personaliaAnswers?.contains(getByText('Nordmann'))).toBe(true)
        expect(personaliaAnswers?.contains(getByText('aboutTheDeceased:dateOfDeath'))).toBe(false)
        const deathAndAbroad = getByText('aboutTheDeceased:deathAndStaysAbroad').closest('.aksel-form-summary__answer')
        const deathAndAbroadAnswers = deathAndAbroad?.querySelector(
            '.aksel-form-summary__value .aksel-form-summary__answers'
        )
        expect(deathAndAbroadAnswers?.contains(getByText('aboutTheDeceased:dateOfDeath'))).toBe(true)
        expect(deathAndAbroadAnswers?.contains(getByText('aboutTheDeceased:occupationalInjury'))).toBe(true)
        expect(deathAndAbroadAnswers?.contains(getByText('aboutTheDeceased:didTheDeceasedLiveAbroad'))).toBe(true)
        expect(personalia?.parentElement).toBe(deathAndAbroad?.parentElement)
        if (hasStaysAbroad) {
            expect(personaliaAnswers?.contains(getByText('Opphold i Danmark'))).toBe(false)
            expect(deathAndAbroadAnswers?.contains(getByText('Opphold i Danmark'))).toBe(false)
        }
    })

    it('grupperer personalia, adresse og telefon om levende forelder', () => {
        const livingParent: ILivingParent = {
            ...parent,
            address: 'Storgata 1',
            phoneNumber: '12345678',
        }
        const { getByText } = render(
            <MemoryRouter>
                <SummaryAboutLivingParent aboutTheParent={livingParent} pathPrefix="forelder" />
            </MemoryRouter>
        )

        const personalia = getByText('aboutYou:subtitle.personalia').closest('.aksel-form-summary__answer')
        const personaliaAnswers = personalia?.querySelector('.aksel-form-summary__value .aksel-form-summary__answers')
        expect(personaliaAnswers?.contains(getByText('Kari'))).toBe(true)
        expect(personaliaAnswers?.contains(getByText('Storgata 1'))).toBe(true)
        expect(personaliaAnswers?.contains(getByText('12345678'))).toBe(true)
    })
})
