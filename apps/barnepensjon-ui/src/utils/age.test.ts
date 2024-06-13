import {
    getAgeFromDate,
    getAgeFromFoedselsnummer,
    getAgeOnDateOfDeathFromFoedselsnummer,
    getAgeOnSpecificDateFromDate,
    isLegalAge,
} from './age'
import { describe, expect, it } from 'vitest'

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

    it('should return age on specific date from date', () => {
        const deathDate = new Date('2020-01-01')

        const dateString = 'Sat Jan 01 2000 00:00:00 GMT+0000 (GMT)'
        const dateObject = new Date(dateString)

        expect(getAgeOnSpecificDateFromDate(dateString, deathDate)).toEqual(20)
        expect(getAgeOnSpecificDateFromDate(dateObject, deathDate)).toEqual(20)
    })

    it('should return age from foedselsnummer', () => {
        expect(getAgeFromFoedselsnummer('01010050027')).toEqual(age)
    })

    it('should return age on death from foedselsnummer', () => {
        const deathDate = new Date('2020-01-01')

        expect(getAgeOnDateOfDeathFromFoedselsnummer('01010050027', deathDate)).toEqual(20)
    })
})
