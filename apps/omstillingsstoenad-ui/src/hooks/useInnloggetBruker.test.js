import { renderHook } from '@testing-library/react'
import useInnloggetBruker from './useInnloggetBruker'
import * as api from '../api/api'

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
