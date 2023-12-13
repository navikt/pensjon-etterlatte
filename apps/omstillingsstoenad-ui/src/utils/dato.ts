import { default as navFaker } from 'nav-faker'

// 365.25 = antall dager i året + 0.25 for å ta høyde for skuddår
const millisPrAar = 365.25 * 24 * 60 * 60 * 1000

export const erDato = (dato: Date | string | undefined) => {
    return !!dato && !isNaN(new Date(dato).getDate())
}

export const hentAlder = (foedselsdato: Date | string): number => {
    return Math.floor((Date.now() - new Date(foedselsdato).getTime()) / millisPrAar)
}

// Støtter også D-nummer.
export const hentAlderFraFoedselsnummer = (foedselsnummer: string): number => {
    try {
        const foedselsDato = navFaker.personIdentifikator.getFødselsdato(foedselsnummer)

        return hentAlder(foedselsDato)
    } catch (e) {
        // navFaker støtter ikke syntetiske fnr og kaster en feil. Returnerer 0 får å omgå problemet...
        return -1
    }
}

export const antallAarMellom = (fraDato: Date | string, tilDato: Date | string): number | undefined => {
    if (erDato(fraDato) && erDato(tilDato))
        return Math.floor((new Date(tilDato).getTime() - new Date(fraDato).getTime()) / millisPrAar)

    return undefined
}

/**
 * Regnes som gyldig dersom samlivsbruddet/skilsmissen skjedde mindre enn 5 år før dødsfallet.
 * Dersom samlivsbruddet/skilsmissen skjedde mer enn 5 år før dødsfallet, regnes det som ugyldig.
 **/
export const ugyldigPeriodeFraSamlivsbruddTilDoedsfall = (
    datoForSamlivsbrudd: Date | string,
    datoForDoedsfall: Date | string
): boolean => {
    const aarMellomSamlivsbruddOgDoed = antallAarMellom(datoForSamlivsbrudd, datoForDoedsfall)

    return !!aarMellomSamlivsbruddOgDoed && aarMellomSamlivsbruddOgDoed >= 5
}

export const erMellomOktoberogDesember = () => {
    const idag = new Date()
    idag.setHours(12, 0, 0, 0)
    const sisteDagIDesember = new Date(idag.getFullYear(), 11, 31)
    sisteDagIDesember.setHours(23, 59, 59, 0)
    const foersteDagIOktober = new Date(idag.getFullYear(), 9, 1)
    return foersteDagIOktober <= idag && idag <= sisteDagIDesember
}