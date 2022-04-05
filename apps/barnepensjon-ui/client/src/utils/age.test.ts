import { getAgeFromDate, getAgeFromFoedselsnummer, isLegalAge } from './age'

describe('Testing av alder', () => {
    it('Sjekk om person er myndig', () => {
        expect(isLegalAge(47)).toBeTruthy()
        expect(isLegalAge(19)).toBeTruthy()
        expect(isLegalAge(18)).toBeTruthy()
        expect(isLegalAge(17)).toBeFalsy()
        expect(isLegalAge(5)).toBeFalsy()
    })

    it('should return age from date', () => {
        const dateString = 'Sun Jul 23 1994 00:00:00 GMT+0000 (GMT)'
        expect(getAgeFromDate(dateString)).toEqual(27)
        const dateObject = new Date(dateString)
        expect(getAgeFromDate(dateObject)).toEqual(27)
    })

    it('should return age from foedselsnummer', () => {
        expect(getAgeFromFoedselsnummer('23079433441')).toEqual(27)
    })
})
