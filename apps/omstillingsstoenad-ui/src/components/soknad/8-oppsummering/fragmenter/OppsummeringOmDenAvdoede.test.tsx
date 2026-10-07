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
    it.each([0, 1, 2])('viser direkte svar med %s grupperte utenlandsopphold', (antallOpphold) => {
        const oppholdsland = ['Danmark', 'Sverige'].slice(0, antallOpphold)
        const omDenAvdoede: IAvdoed = {
            fornavn: 'Kari',
            etternavn: 'Nordmann',
            statsborgerskap: 'Norge',
            datoForDoedsfallet: new Date('2026-09-01'),
            doedsfallAarsak: IValg.NEI,
            boddEllerJobbetUtland: {
                svar: antallOpphold ? IValg.JA : IValg.NEI,
                oppholdUtland: oppholdsland.map((land) => ({ land })),
            },
        }
        const { container, getByText, queryByText } = render(
            <MemoryRouter>
                <OppsummeringOmDenAvdoede omDenAvdoede={omDenAvdoede} senderSoeknad={false} />
            </MemoryRouter>
        )

        const svar = container.querySelector('dl')

        expect(svar).not.toBeNull()
        expect(queryByText('omDeg.undertittel.personalia')).toBeNull()
        expect(queryByText('omDenAvdoede.doedsfallOgUtenlandsopphold')).toBeNull()
        expect(getByText('Kari').closest('dl')).toBe(svar)
        expect(getByText('Nordmann').closest('dl')).toBe(svar)
        expect(getByText('Norge').closest('dl')).toBe(svar)
        expect(getByText('omDenAvdoede.datoForDoedsfallet').closest('dl')).toBe(svar)
        expect(getByText('omDenAvdoede.doedsfallAarsak').closest('dl')).toBe(svar)
        expect(getByText('omDenAvdoede.boddEllerJobbetUtland.svar').closest('dl')).toBe(svar)
        expect(container.querySelectorAll('dl dl')).toHaveLength(antallOpphold)

        for (const land of oppholdsland) {
            const opphold = getByText(`Opphold i ${land}`).closest('.aksel-form-summary__answer')
            expect(opphold?.parentElement).toBe(svar)
            expect(opphold?.querySelector('dl')?.contains(getByText(land))).toBe(true)
        }
    })
})
