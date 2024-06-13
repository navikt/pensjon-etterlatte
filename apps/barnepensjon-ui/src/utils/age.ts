import { default as navFaker } from 'nav-faker'

const LEGAL_AGE = 18

// 365.25 = antall dager i året + 0.25 for å ta høyde for skuddår
const MILLIS_IN_YEAR = 365.25 * 24 * 60 * 60 * 1000

export const isLegalAge = (age: number): boolean => age >= LEGAL_AGE

export const getAgeFromDate = (date: Date | string): number => {
    return Math.floor((Date.now() - new Date(date).getTime()) / MILLIS_IN_YEAR)
}

export const getAgeOnSpecificDateFromDate = (ageDate: Date | string, specificDate: Date | string): number => {
    return Math.floor((new Date(specificDate).getTime() - new Date(ageDate).getTime()) / MILLIS_IN_YEAR)
}

// Støtter også D-nummer.
export const getAgeFromFoedselsnummer = (foedselsnummer: string): number => {
    try {
        const birthDate = navFaker.personIdentifikator.getFødselsdato(foedselsnummer)

        return getAgeFromDate(birthDate)
    } catch (e) {
        // navFaker støtter ikke syntetiske fnr og kaster en feil. Returnerer 0 får å omgå problemet...
        return -1
    }
}

// Støtter også D-nummer.
export const getAgeOnDateOfDeathFromFoedselsnummer = (foedselsnummer: string, dateOfDeath: Date | string): number => {
    try {
        const birthDate = navFaker.personIdentifikator.getFødselsdato(foedselsnummer)

        return getAgeOnSpecificDateFromDate(birthDate, dateOfDeath)
    } catch (e) {
        // navFaker støtter ikke syntetiske fnr og kaster en feil. Returnerer 0 får å omgå problemet...
        return -1
    }
}
