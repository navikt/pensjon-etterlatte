import { act, fireEvent, render, screen } from '@testing-library/react'
import SoknadForside from './SoknadForside'
import { SoknadProvider } from '../../context/soknad/SoknadContext'
import { describe, it, vi } from 'vitest'
import {BrowserRouter} from "react-router-dom";

import * as chai from "chai";

chai.use(require("chai-dom"));
var expect = chai.expect;

vi.mock('react-i18next', async () => ({
    ...await vi.importActual('react-i18next'),
    useTranslation: () => ({ t: vi.fn((key) => key) }),
}))

vi.mock('../../context/bruker/BrukerContext', () => ({
    useBrukerContext: () => {
        return {
            state: {
                fornavn: 'STERK',
                etternavn: 'BUSK',
            },
        }
    },
}))

vi.mock('react-router', async () => ({
    ...await vi.importActual('react-router'),
    useLocation: vi.fn().mockImplementation(() => {
        return {
            pathname: '/testroute',
            search: '',
            hash: '',
            state: null,
        }
    }),
}))

const mockedUsedNavigate = vi.fn()
vi.mock('react-router-dom', async () => ({
    ...await vi.importActual('react-router-dom'),
    useNavigate: () => mockedUsedNavigate,
}))

// Hacker til språk, Kan påvirke andre steder som bruker navigator
const navigator = { language: 'nb-NO' }
Object.defineProperty(window, 'navigator', {
    value: navigator,
    writable: true,
})

let container

beforeEach(() => {
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
})

afterEach(() => {
    document.body.removeChild(container)
    container = null
})

describe('Samtykke', () => {
    it('Knapp vises ikke hvis samtykke mangler', async () => {
        const bekreftSjekkboks = await screen.findByText('forside.samtykke.bekreftelse')
        expect(bekreftSjekkboks).to.be.visible;

        const startKnapp = screen.queryByText('forside.startSoeknad')
        expect(startKnapp).toBeNull()
    })

    it('Knapp vises hvis samtykke er huket av', async () => {
        const bekreftSjekkboks = await screen.findByLabelText('forside.samtykke.bekreftelse')
        expect(bekreftSjekkboks).to.be.visible;

        await act(async () => {
            fireEvent.click(bekreftSjekkboks)
        })
        expect(bekreftSjekkboks).to.be.checked;

        const startKnapp = await screen.findByText('forside.startSoeknad')
        expect(startKnapp).to.be.visible;
    })
})
