
// 365.25 = antall dager i året + 0.25 for å ta høyde for skuddår
const millisPrAar = (365.25 * 24 * 60 * 60 * 1000)

export const hentAlder = (foedselsdato: Date | string): number => {
    return Math.floor((Date.now() - new Date(foedselsdato).getTime()) / millisPrAar)
}

export const antallAarMellom = (fraDato: Date | string, tilDato: Date | string): number => {
    if (!fraDato || !tilDato) return -1;

    return Math.floor((new Date(tilDato).getTime() - new Date(fraDato).getTime()) / millisPrAar)
}

const MAKS_ALDER = 67;
const MIN_ALDER = 18;

export const gyldigAlder = (alder: number): boolean => {
    return alder >= MIN_ALDER && alder <= MAKS_ALDER;
}
