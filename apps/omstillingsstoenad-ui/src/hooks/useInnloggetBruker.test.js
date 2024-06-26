import { renderHook } from '@testing-library/react'
import useInnloggetBruker from './useInnloggetBruker'

const mock = vi.fn(async () => {
    return 'Ok'
})

const mockedUsedNavigate = vi.fn()
vi.mock('react-router-dom', () => ({
    ...vi.importActual('react-router-dom'),
    useNavigate: () => mockedUsedNavigate,
}))

vi.mock('../api/api', () => {
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
