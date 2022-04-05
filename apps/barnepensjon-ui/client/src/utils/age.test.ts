import { isLegalAge } from './age'

describe('Testing av alder', () => {
    it('Sjekk om person er myndig', () => {
        expect(isLegalAge(47)).toBeTruthy()
        expect(isLegalAge(19)).toBeTruthy()
        expect(isLegalAge(18)).toBeTruthy()
        expect(isLegalAge(17)).toBeFalsy()
        expect(isLegalAge(5)).toBeFalsy()
    })
})
