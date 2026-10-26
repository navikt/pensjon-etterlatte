import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { lagreKladd } from '../../api/api'
import { tomSoeknad } from '../../context/soknad/soknad'
import { steg } from '../../typer/steg'
import { SoeknadStegRute } from './SoeknadSteg'
import SoknadDialog from './SoknadDialog'

let state = { ...tomSoeknad, harSamtykket: true }
vi.mock('../../api/api', () => ({
    lagreKladd: vi.fn(async (soeknad) => soeknad),
}))
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
                <Route path="/skjema/steg" element={<SoknadDialog />}>
                    <Route
                        path="personopplysninger"
                        element={
                            <SoeknadStegRute>
                                <p>personopplysninger.opplysningerFeil.tittel</p>
                            </SoeknadStegRute>
                        }
                    />
                    <Route
                        path="situasjonen-din"
                        element={
                            <SoeknadStegRute>
                                <p>skjema.underArbeid</p>
                            </SoeknadStegRute>
                        }
                    />
                    {steg.slice(2).map((side) => (
                        <Route
                            key={side.path}
                            path={side.path}
                            element={
                                <SoeknadStegRute>
                                    <p>skjema.underArbeid</p>
                                </SoeknadStegRute>
                            }
                        />
                    ))}
                </Route>
                <Route path="/" element={<p>Forside</p>} />
                <Route path="*" element={<p>sideIkkeFunnet.tittel</p>} />
            </Routes>
            <Location />
        </MemoryRouter>
    )

afterEach(() => {
    cleanup()
    vi.clearAllMocks()
    state = { ...tomSoeknad, harSamtykket: true }
})

describe('Stegruter', () => {
    it.each(steg)('Viser $path og riktig fremdrift uten intro og kvittering', (side) => {
        setup(`/skjema/steg/${side.path}`)
        expect(screen.getByRole('heading', { name: side.label })).toBeDefined()
        expect(screen.getByText(`Steg ${steg.indexOf(side) + 1} av 6`)).toBeDefined()
        expect(screen.queryByText('knapp.sendSoeknad')).toBeNull()
    })

    it('lagrer og bytter ruteinnhold ved navigasjon frem og tilbake', async () => {
        setup('/skjema/steg/personopplysninger')
        fireEvent.click(screen.getByText('knapp.neste'))

        await screen.findByRole('heading', { name: 'skjema.situasjonenDin' })
        expect(screen.getByTestId('path').textContent).toBe('/skjema/steg/situasjonen-din')
        expect(screen.getByText('skjema.underArbeid')).toBeDefined()
        expect(screen.queryByText('personopplysninger.opplysningerFeil.tittel')).toBeNull()
        expect(lagreKladd).toHaveBeenLastCalledWith(expect.objectContaining({ aktivtSteg: 'situasjonen-din' }))

        fireEvent.click(screen.getByText('knapp.tilbake'))

        const heading = await screen.findByRole('heading', { name: 'skjema.personopplysninger' })
        expect(screen.getByTestId('path').textContent).toBe('/skjema/steg/personopplysninger')
        expect(screen.getByText('personopplysninger.opplysningerFeil.tittel')).toBeDefined()
        expect(screen.queryByText('skjema.underArbeid')).toBeNull()
        expect(lagreKladd).toHaveBeenLastCalledWith(expect.objectContaining({ aktivtSteg: 'personopplysninger' }))
        await waitFor(() => expect(document.activeElement).toBe(heading))
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
