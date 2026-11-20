import { act, fireEvent, render, screen } from '@testing-library/react'
import * as chai from 'chai'
import { BrowserRouter } from 'react-router'
import { describe, it, vi } from 'vitest'
import { hentHarOmsSak } from '../../api/api'
import { SoknadProvider } from '../../context/soknad/SoknadContext'
import SoknadForside from './SoknadForside'

chai.use(require('chai-dom'))
const expect = chai.expect

vi.mock('../../api/api', () => ({
    hentHarOmsSak: vi.fn().mockResolvedValue({ harOMSSak: true }),
    lagreKladd: vi.fn(),
}))

vi.mock('react-i18next', async () => ({
    ...(await vi.importActual('react-i18next')),
    useTranslation: () => ({ t: vi.fn((key) => key) }),
}))

vi.mock('../../context/bruker/BrukerContext', () => ({
    useBrukerContext: () => {
        return {
            state: {
                fornavn: 'STERK',
                etternavn: 'BUSK',
                foedselsnummer: '12345678910',
            },
        }
    },
}))

// Hacker til språk, Kan påvirke andre steder som bruker navigator
const navigator = { language: 'nb-NO' }
Object.defineProperty(window, 'navigator', {
    value: navigator,
    writable: true,
})

let container

const renderSoknadForside = () => {
    container = document.createElement('root')
    document.body.appendChild(container)

    act(() => {
        render(
            <SoknadProvider>
                <BrowserRouter>
                    <SoknadForside />
                </BrowserRouter>
            </SoknadProvider>,
            container
        )
    })
}

afterEach(() => {
    document.body.removeChild(container)
    container = null
})

describe('Samtykke', () => {
    it('Knapp vises selv om samtykke mangler', async () => {
        renderSoknadForside()

        const bekreftSjekkboks = await screen.findByText('forside.samtykke.bekreftelse')
        expect(bekreftSjekkboks).to.be.visible

        const startKnapp = await screen.findByText('forside.startSoeknad')
        expect(startKnapp).to.be.visible
    })

    it('Viser valideringsfeil hvis man prøver å starte uten samtykke', async () => {
        renderSoknadForside()

        const startKnapp = await screen.findByText('forside.startSoeknad')
        expect(startKnapp).to.be.visible

        await act(async () => {
            fireEvent.click(startKnapp)
        })

        expect(await screen.findByText('forside.samtykke.feil')).to.be.visible
    })

    it('Knapp vises hvis samtykke er huket av', async () => {
        renderSoknadForside()

        const bekreftSjekkboks = await screen.findByLabelText('forside.samtykke.bekreftelse')
        expect(bekreftSjekkboks).to.be.visible

        await act(async () => {
            fireEvent.click(bekreftSjekkboks)
        })
        expect(bekreftSjekkboks).to.be.checked

        const startKnapp = await screen.findByText('forside.startSoeknad')
        expect(startKnapp).to.be.visible
    })
})

describe('Forside uten omstillingsstønad', () => {
    it('viser advarsel og skjuler start av søknad', async () => {
        hentHarOmsSak.mockResolvedValueOnce({ harOMSSak: false })
        renderSoknadForside()

        expect(await screen.findByText('forside.harIkkeOms.tittel')).to.be.visible
        expect(screen.queryByText('forside.startSoeknad')).toBeNull()
    })
})
