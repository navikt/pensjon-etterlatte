import { default as navFaker } from 'nav-faker'

const PENSION_AGE = 67
const LEGAL_AGE = 18

// 365.25 = antall dager i året + 0.25 for å ta høyde for skuddår
const MILLIS_IN_YEAR = 365.25 * 24 * 60 * 60 * 1000

export const validAge = (age: number): boolean => {
    return age >= LEGAL_AGE && age <= PENSION_AGE
}

export const isTooYoung = (age: number): boolean => age < LEGAL_AGE

export const isLegalAge = (age: number): boolean => age >= LEGAL_AGE

export const isTooOld = (age: number): boolean => age > PENSION_AGE

export const getAgeFromDate = (date: Date | string): number => {
    return Math.floor((Date.now() - new Date(date).getTime()) / MILLIS_IN_YEAR)
}

// Støtter også D-nummer.
export const getAgeFromFoedselsnummer = (foedselsnummer: string): number => {
    const birthDate = navFaker.personIdentifikator.getFødselsdato(foedselsnummer)

    return getAgeFromDate(birthDate)
}
