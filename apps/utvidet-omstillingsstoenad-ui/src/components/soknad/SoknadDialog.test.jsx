import { cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { tomSoeknad } from '../../context/soknad/soknad'
import { steg } from '../../typer/steg'
import SoknadDialog from './SoknadDialog'

let state = { ...tomSoeknad, harSamtykket: true }
vi.mock('../../context/soknad/SoknadContext', () => ({
    useSoknadContext: () => ({ state, dispatch: vi.fn() }),
}))
vi.mock('../../hooks/useLanguage', () => ({ useLanguage: vi.fn() }))
vi.mock('../../hooks/useAnalytics', () => ({
    LogEvents: {},
    useAnalytics: () => ({ logEvent: vi.fn() }),
}))
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key, data) => (data ? `Steg ${data.aktivt} av ${data.antall}` : key),
        i18n: { language: 'nb' },
    }),
}))

const Location = () => <output data-testid="path">{useLocation().pathname}</output>
const setup = (path) =>
    render(
        <MemoryRouter initialEntries={[path]}>
            <Routes>
                <Route path="/skjema/steg/*" element={<SoknadDialog />} />
                <Route path="/" element={<p>Forside</p>} />
            </Routes>
            <Location />
        </MemoryRouter>
    )

afterEach(() => {
    cleanup()
    state = { ...tomSoeknad, harSamtykket: true }
})

describe('Stegruter', () => {
    it.each(steg)('Viser $path og riktig fremdrift uten intro og kvittering', (side) => {
        setup(`/skjema/steg/${side.path}`)
        expect(screen.getByRole('heading', { name: side.label })).toBeDefined()
        expect(screen.getByText(`Steg ${steg.indexOf(side) + 1} av 6`)).toBeDefined()
        expect(screen.queryByText('knapp.sendSoeknad')).toBeNull()
    })

    it('Gammel stegrute sender brukeren til lagret steg', async () => {
        state = { ...state, aktivtSteg: 'utdanning-og-tiltak' }
        setup('/skjema/steg')
        await screen.findByRole('heading', { name: 'skjema.utdanningOgTiltak' })
        expect(screen.getByTestId('path').textContent).toBe('/skjema/steg/utdanning-og-tiltak')
    })

    it('Direktelenke uten samtykke sender brukeren til forsiden', () => {
        state = { ...state, harSamtykket: false }
        setup('/skjema/steg/inntekt')
        expect(screen.getByText('Forside')).toBeDefined()
    })

    it('Ukjent steg viser feilsiden, ikke et tomt skjema', () => {
        setup('/skjema/steg/ukjent')
        expect(screen.getByText('sideIkkeFunnet.tittel')).toBeDefined()
    })
})
