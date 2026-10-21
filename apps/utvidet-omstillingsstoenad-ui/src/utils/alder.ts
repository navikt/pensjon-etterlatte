import { differenceInYears } from 'date-fns'
import { IBruker } from '~context/bruker/bruker'

const MAKS_ALDER = 67
const MIN_ALDER = 18

export const gyldigAlder = (alder: number): boolean => {
    return !erForUng(alder)
}

export const erForUng = (alder: number): boolean => alder < MIN_ALDER

export const erMyndig = (alder: number): boolean => alder >= MIN_ALDER

export const erForGammel = (alder: number): boolean => alder > MAKS_ALDER

export const fyllerSekstiSyvIAar = (bruker: IBruker): boolean => {
    if (bruker.foedselsdato) {
        const alderIAar = differenceInYears(new Date(), new Date(bruker.foedselsdato).setMonth(0, 0))
        return alderIAar === 67
    }

    return false
}

export const erEldreEnnSekstiEn = (bruker: IBruker): boolean => {
    if (bruker.foedselsdato) {
        const alderIAar = differenceInYears(new Date(), new Date(bruker.foedselsdato).setMonth(0, 0))
        return alderIAar >= 62
    }

    return false
}
