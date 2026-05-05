import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { erMellomOktoberogDesember } from './dato'

describe('Dato', () => {
    beforeEach(() => {
        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it('Sjekke om dagens dato er mellom oktober og desember', () => {
        const detteAaret = new Date().getFullYear()
        const foersteJanuar = new Date(detteAaret, 0, 1)
        const foersteDesember = new Date(detteAaret, 11, 1)

        vi.setSystemTime(foersteJanuar)

        expect(erMellomOktoberogDesember()).toEqual(false)

        vi.setSystemTime(foersteDesember)

        expect(erMellomOktoberogDesember()).toEqual(true)
    })
})
