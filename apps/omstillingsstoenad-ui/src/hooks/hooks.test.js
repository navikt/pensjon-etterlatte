import { act } from '@testing-library/react-hooks'
import { renderHook } from '@testing-library/react'
import useEffectOnce from './useEffectOnce'
import { useError } from './useError'

describe('useError', () => {
    it('Skal dispatche en error-action', () => {
        const { result } = renderHook(() => useError())
        act(() => {
            result.current.setError('Dette er en testerror')
        })
        expect(result.current.message).toBe('Dette er en testerror')
    })
})

describe('useEffectOnce', () => {
    it('skal kjøre en gang', () => {
        const fakeCallback = jest.fn()
        renderHook(() => {
            useEffectOnce(fakeCallback, true)
            useEffectOnce(fakeCallback, false)
        })
        expect(fakeCallback).toBeCalledTimes(1)
    })

    it('skal kjøre to ganger', () => {
        const fakeCallback = jest.fn()
        renderHook(() => {
            useEffectOnce(fakeCallback, true)
            useEffectOnce(fakeCallback, true)
        })
        expect(fakeCallback).toBeCalledTimes(2)
    })
})
