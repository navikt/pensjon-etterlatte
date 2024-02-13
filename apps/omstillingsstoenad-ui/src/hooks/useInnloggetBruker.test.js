import { renderHook } from '@testing-library/react'
import useInnloggetBruker, { captalize } from './useInnloggetBruker'

const mock = jest.fn(async () => {
    return 'Ok'
})

const mockedUsedNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedUsedNavigate,
}))

jest.mock('../api/api', () => {
    return {
        hentInnloggetPerson: async () => {
            mock()
            return new Promise(() => {
                return 'test'
            })
        },
    }
})

describe('useInnloggetBruker', () => {
    it('skal teste at innlogget person blir kalt', () => {
        const { result } = renderHook(() => useInnloggetBruker())

        expect(result.current).toBe(true)
        expect(mock).toBeCalledTimes(1)
    })
})

describe('Test av capitalize', () => {
    it('Tester at enkelt navn i uppercase får stor forbokstav', () => {
        const testString = 'TEST'
        const fasitString = 'Test'

        expect(captalize(testString)).toStrictEqual(fasitString)
    })

    it('Tester at dobbelt navn i uppercase får stor forbokstav', () => {
        const testString = 'TEST TESTESEN'
        const fasitString = 'Test Testesen'

        expect(captalize(testString)).toStrictEqual(fasitString)
    })

    it('Tester at enkelt navn i lowercase får stor forbokstav', () => {
        const testString = 'test'
        const fasitString = 'Test'

        expect(captalize(testString)).toStrictEqual(fasitString)
    })

    it('Tester at dobbelt navn i lowercase får stor forbokstav', () => {
        const testString = 'test testesen'
        const fasitString = 'Test Testesen'

        expect(captalize(testString)).toStrictEqual(fasitString)
    })
})
