const MAKS_ALDER = 67;
const MIN_ALDER = 18;

export const gyldigAlder = (alder: number): boolean => {
    return alder >= MIN_ALDER && alder <= MAKS_ALDER;
}
