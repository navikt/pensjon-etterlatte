import { default as navFaker } from 'nav-faker'
import { differenceInYears } from 'date-fns'

const LEGAL_AGE = 18

export const isLegalAge = (age: number): boolean => age >= LEGAL_AGE

export const getAgeFromDate = (date: Date | string): number => {
    return differenceInYears(new Date(), new Date(date))
}

// Støtter også D-nummer.
export const getAgeFromFoedselsnummer = (foedselsnummer: string): number => {
    try {
        const birthDate = navFaker.personIdentifikator.getFødselsdato(foedselsnummer)

        return getAgeFromDate(birthDate)
    } catch {
        // navFaker støtter ikke syntetiske fnr og kaster en feil. Returnerer 0 får å omgå problemet...
        return -1
    }
}
