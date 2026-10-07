import { cleanup, render } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { IAvdoed } from '../../../../typer/person'
import { IValg } from '../../../../typer/Spoersmaal'
import { OppsummeringOmDenAvdoede } from './OppsummeringOmDenAvdoede'

/**
 * @vitest-environment jsdom
 */

vi.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (key: string) => key }),
}))

afterEach(cleanup)

describe('Oppsummering om den avdøde', () => {
    it.each([false, true])('viser personalia uten gruppe, med utenlandsopphold: %s', (harOpphold) => {
        const omDenAvdoede: IAvdoed = {
            fornavn: 'Kari',
            etternavn: 'Nordmann',
            statsborgerskap: 'Norge',
            datoForDoedsfallet: new Date('2026-09-01'),
            doedsfallAarsak: IValg.NEI,
            boddEllerJobbetUtland: {
                svar: harOpphold ? IValg.JA : IValg.NEI,
                oppholdUtland: harOpphold ? [{ land: 'Danmark' }] : [],
            },
        }
        const { container, getByText, queryByText } = render(
            <MemoryRouter>
                <OppsummeringOmDenAvdoede omDenAvdoede={omDenAvdoede} senderSoeknad={false} />
            </MemoryRouter>
        )

        const svar = container.querySelector('dl')
        const doedsfall = getByText('omDenAvdoede.doedsfallOgUtenlandsopphold').closest('.aksel-form-summary__answer')
        const doedsfallAnswers = doedsfall?.querySelector('.aksel-form-summary__value .aksel-form-summary__answers')

        expect(svar).not.toBeNull()
        expect(queryByText('omDeg.undertittel.personalia')).toBeNull()
        expect(getByText('Kari').closest('dl')).toBe(svar)
        expect(getByText('Nordmann').closest('dl')).toBe(svar)
        expect(getByText('Norge').closest('dl')).toBe(svar)
        expect(doedsfallAnswers?.contains(getByText('omDenAvdoede.datoForDoedsfallet'))).toBe(true)
        expect(doedsfallAnswers?.contains(getByText('omDenAvdoede.doedsfallAarsak'))).toBe(true)
        expect(doedsfallAnswers?.contains(getByText('omDenAvdoede.boddEllerJobbetUtland.svar'))).toBe(true)
        expect(doedsfall?.parentElement).toBe(svar)

        if (harOpphold) {
            const opphold = getByText('Opphold i Danmark').closest('.aksel-form-summary__answer')
            expect(opphold?.parentElement).toBe(doedsfall?.parentElement)
            expect(doedsfallAnswers?.contains(opphold)).toBe(false)
        } else {
            expect(queryByText('Opphold i Danmark')).toBeNull()
        }
    })
})
