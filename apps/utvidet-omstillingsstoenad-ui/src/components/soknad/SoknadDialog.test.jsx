import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, useLocation } from 'react-router'
import { afterEach, describe, expect, it, vi } from 'vitest'
import App from '../../App'
import { lagreKladd } from '../../api/api'
import { tomSoeknad } from '../../context/soknad/soknad'
import { steg } from '../../typer/steg'

const stegMock = vi.hoisted(() => ({ steg: undefined }))
vi.mock('../../typer/steg', async (importOriginal) => {
    const original = await importOriginal()
    return {
        ...original,
        get steg() {
            return stegMock.steg ?? original.steg
        },
    }
})

let state = { ...tomSoeknad, harSamtykket: true }
vi.mock('../../api/api', () => ({
    lagreKladd: vi.fn(async (soeknad) => soeknad),
}))
vi.mock('../../context/soknad/SoknadContext', () => ({
    useSoknadContext: () => ({ state, dispatch: vi.fn() }),
}))
vi.mock('../../hooks/useInnloggetBruker', () => ({ default: vi.fn() }))
vi.mock('../../hooks/useSoeknad', () => ({ default: () => false }))
vi.mock('../../hooks/useLanguage', () => ({ useLanguage: vi.fn() }))
vi.mock('../../hooks/useAnalytics', () => ({
    LogEvents: {},
    useAnalytics: () => ({ logEvent: vi.fn() }),
}))
vi.mock('react-i18next', async () => ({
    ...(await vi.importActual('react-i18next')),
    useTranslation: () => ({
        t: (key, data) => (key === 'skjema.steg' ? `Steg ${data.aktivt} av ${data.antall}` : key),
        i18n: { language: 'nb' },
    }),
}))

const Location = () => <output data-testid="path">{useLocation().pathname}</output>
const setup = (path) =>
    render(
        <MemoryRouter initialEntries={[path]}>
            <App />
            <Location />
        </MemoryRouter>
    )

afterEach(() => {
    cleanup()
    vi.clearAllMocks()
    stegMock.steg = undefined
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
        expect(screen.getByRole('radiogroup', { name: 'kontrakt.nySivilstand' })).toBeDefined()
        expect(screen.queryByText('personopplysninger.opplysningerFeil.tittel')).toBeNull()
        expect(lagreKladd).toHaveBeenLastCalledWith(expect.objectContaining({ aktivtSteg: 'situasjonen-din' }))

        fireEvent.click(screen.getByText('knapp.tilbake'))

        const heading = await screen.findByRole('heading', { name: 'skjema.personopplysninger' })
        expect(screen.getByTestId('path').textContent).toBe('/skjema/steg/personopplysninger')
        expect(screen.getByText('personopplysninger.opplysningerFeil.tittel')).toBeDefined()
        expect(screen.queryByRole('radiogroup', { name: 'kontrakt.nySivilstand' })).toBeNull()
        expect(lagreKladd).toHaveBeenLastCalledWith(expect.objectContaining({ aktivtSteg: 'personopplysninger' }))
        await waitFor(() => expect(document.activeElement).toBe(heading))
    })

    it('Gammel stegrute sender brukeren til lagret steg', async () => {
        state = { ...state, aktivtSteg: 'utdanning-og-tiltak' }
        setup('/skjema/steg')
        await screen.findByRole('heading', { name: 'skjema.utdanningOgTiltak' })
        expect(screen.getByTestId('path').textContent).toBe('/skjema/steg/utdanning-og-tiltak')
    })

    it.each([
        ['knapp.neste', 'situasjonen-din'],
        ['knapp.tilbake', 'personopplysninger'],
    ])('følger steglisten fra inntekt med %s etter at rekkefølgen endres', async (knapp, maal) => {
        const inntekt = steg.find((side) => side.path === 'inntekt')
        stegMock.steg = [steg[0], inntekt, ...steg.slice(1).filter((side) => side.path !== 'inntekt')]
        state = {
            ...state,
            skjema: {
                inntekt: {
                    arbeidsinntekt: '100',
                    naeringsinntekt: '0',
                    inntektFraUtland: '0',
                    andreInntekter: { valg: 'NEI' },
                    noeSomKanPaavirkeInntekten: { valg: 'NEI' },
                },
            },
        }
        setup('/skjema/steg/inntekt')
        fireEvent.click(screen.getByText(knapp))
        await waitFor(() => expect(screen.getByTestId('path').textContent).toBe(`/skjema/steg/${maal}`))
        expect(lagreKladd).toHaveBeenLastCalledWith(expect.objectContaining({ aktivtSteg: maal }))
    })

    it('Direktelenke uten samtykke sender brukeren til forsiden', () => {
        state = { ...state, harSamtykket: false }
        setup('/skjema/steg/inntekt')
        expect(screen.getByRole('heading', { name: 'forside.tittel' })).toBeDefined()
    })

    it('viser inntektsskjemaet', () => {
        setup('/skjema/steg/inntekt')
        expect(screen.getByRole('textbox', { name: 'kontrakt.arbeidsinntekt' })).toBeDefined()
    })

    it('lagrer utdanning og tiltak og går videre til inntekt', async () => {
        setup('/skjema/steg/utdanning-og-tiltak')
        fireEvent.click(screen.getByRole('radio', { name: 'kontrakt.INGEN' }))
        fireEvent.click(screen.getByText('knapp.neste'))

        await screen.findByRole('heading', { name: 'skjema.inntekt' })
        expect(screen.getByRole('textbox', { name: 'kontrakt.arbeidsinntekt' })).toBeDefined()
        expect(lagreKladd).toHaveBeenLastCalledWith(
            expect.objectContaining({
                aktivtSteg: 'inntekt',
                skjema: { utdanningOgTiltak: { aktivitet: 'INGEN' } },
            })
        )
    })

    it('viser plassholderen for steg uten skjema', () => {
        setup('/skjema/steg/dokumentasjon')
        expect(screen.getByText('skjema.underArbeid')).toBeDefined()
    })

    it('Ukjent steg viser feilsiden, ikke et tomt skjema', () => {
        setup('/skjema/steg/ukjent')
        expect(screen.getByText('sideIkkeFunnet.tittel')).toBeDefined()
    })
})
