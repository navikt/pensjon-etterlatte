import { act, render, screen } from '@testing-library/react'
import App from './App'

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

jest.mock('react-i18next', () => ({
    ...jest.requireActual('react-i18next'),
    useTranslation: () => ({ t: jest.fn((key) => key) }),
}))

const mockedUsedNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedUsedNavigate,
}))

beforeEach(() => {
    act(() => {
        render(<App />)
    })
})

describe('Mulighet for å søke har utgått', () => {
    beforeAll(() => {
        jest.useFakeTimers('modern')
        jest.setSystemTime(new Date(2024, 4, 1))
    })

    afterAll(() => {
        jest.useRealTimers()
    })

    it('Etter 1. april så skal ikke bruker ha mulighet til å søke', async () => {
        const tittel = await screen.findByText('Muligheten til å søke pengestøtte har utgått')

        expect(tittel).toBeVisible()
    })
})
