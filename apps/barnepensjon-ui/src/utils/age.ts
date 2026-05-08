import { differenceInYears } from 'date-fns'
import { fødselsnummerTilDato } from './fnr'

const LEGAL_AGE = 18

export const isLegalAge = (age: number): boolean => age >= LEGAL_AGE

export const getAgeFromDate = (date: Date | string): number => {
    return differenceInYears(new Date(), new Date(date))
}

// Støtter også D-nummer.
export const getAgeFromFoedselsnummer = (foedselsnummer: string): number => {
    try {
        const birthDate = fødselsnummerTilDato(foedselsnummer)

        return getAgeFromDate(birthDate)
    } catch {
        // funksjonen støtter ikke syntetiske fnr og kaster en feil. Returnerer 0 får å omgå problemet...
        return -1
    }
}
