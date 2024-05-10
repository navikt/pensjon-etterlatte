import { act, fireEvent, render, screen } from '@testing-library/react'
import SoknadForside from './SoknadForside'
import { SoknadProvider } from '../../context/soknad/SoknadContext'

jest.mock('react-i18next', () => ({
    ...jest.requireActual('react-i18next'),
    useTranslation: () => ({ t: jest.fn((key) => key) }),
}))

jest.mock('../../context/bruker/BrukerContext', () => ({
    useBrukerContext: () => {
        return {
            state: {
                fornavn: 'STERK',
                etternavn: 'BUSK',
            },
        }
    },
}))

jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useLocation: jest.fn().mockImplementation(() => {
        return {
            pathname: '/testroute',
            search: '',
            hash: '',
            state: null,
        }
    }),
}))

const mockedUsedNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
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
                <SoknadForside />
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
        expect(bekreftSjekkboks).toBeVisible()
        expect(bekreftSjekkboks).not.toBeChecked()

        const startKnapp = screen.queryByText('forside.startSoeknad')
        expect(startKnapp).toBeNull()
    })

    it('Knapp vises hvis samtykke er huket av', async () => {
        const bekreftSjekkboks = await screen.findByLabelText('forside.samtykke.bekreftelse')
        expect(bekreftSjekkboks).toBeVisible()

        await act(async () => {
            fireEvent.click(bekreftSjekkboks)
        })
        expect(bekreftSjekkboks).toBeChecked()

        const startKnapp = await screen.findByText('forside.startSoeknad')
        expect(startKnapp).toBeVisible()
    })
})
