
// 365.25 = antall dager i året + 0.25 for å ta høyde for skuddår
const millisPrAar = (365.25 * 24 * 60 * 60 * 1000)

const hentAlder = (foedselsdato: Date | string): number => {
    return Math.floor((Date.now() - new Date(foedselsdato).getTime()) / millisPrAar)
}

const MAKS_ALDER = 67;
const MIN_ALDER = 18;

const gyldigAlder = (alder: number): boolean => {
    return alder >= MIN_ALDER && alder <= MAKS_ALDER;
}

export {
    hentAlder,
    gyldigAlder
}
