import { isLegalAge, getAgeFromDate, getAgeFromFoedselsnummer } from './age'

describe('Test age', () => {
    it('should only return true if age is 18 or above', () => {
        expect(isLegalAge(18)).toBeTruthy()
        expect(isLegalAge(21)).toBeTruthy()
        expect(isLegalAge(17)).toBeFalsy()
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
