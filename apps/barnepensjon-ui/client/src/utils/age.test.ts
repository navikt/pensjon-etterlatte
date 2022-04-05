import { getAgeFromDate, getAgeFromFoedselsnummer, isLegalAge } from './age'

const age = new Date().getFullYear() - 2000

describe('Test of age', () => {
    it('Sjekk om person er myndig', () => {
        expect(isLegalAge(47)).toBeTruthy()
        expect(isLegalAge(19)).toBeTruthy()
        expect(isLegalAge(18)).toBeTruthy()
        expect(isLegalAge(17)).toBeFalsy()
        expect(isLegalAge(5)).toBeFalsy()
    })

    it('should return age from date', () => {
        const dateString = 'Sat Jan 01 2000 00:00:00 GMT+0000 (GMT)'
        const dateObject = new Date(dateString)

        expect(getAgeFromDate(dateString)).toEqual(age)
        expect(getAgeFromDate(dateObject)).toEqual(age)
    })

    it('should return age from foedselsnummer', () => {
        expect(getAgeFromFoedselsnummer('01010050027')).toEqual(age)
    })
})
