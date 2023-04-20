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
    const foedselsDato = navFaker.personIdentifikator.getFødselsdato(foedselsnummer)

    return hentAlder(foedselsDato)
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
