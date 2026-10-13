import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { erMellomOktoberogDesember, finnInntektsaarForMeldFraEndring } from './dato'

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

    it('Skal sette inntektsår til neste år fra og med 1. oktober', () => {
        vi.setSystemTime(new Date('2026-09-30T12:00:00'))
        expect(finnInntektsaarForMeldFraEndring()).toEqual(2026)

        vi.setSystemTime(new Date('2026-10-01T12:00:00'))
        expect(finnInntektsaarForMeldFraEndring()).toEqual(2027)
    })
})
