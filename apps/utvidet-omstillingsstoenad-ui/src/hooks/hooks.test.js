import { renderHook } from '@testing-library/react'
import { act } from 'react'
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
