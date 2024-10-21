import { Locale } from 'date-fns'
import { enGB, nb, nn } from 'date-fns/locale'

export enum Spraak {
    BOKMAAL = 'NB',
    NYNORSK = 'NN',
    ENGELSK = 'EN',
}

export const spraakTilDateFnsLocale = (spraak: Spraak): Locale => {
    switch (spraak) {
        case Spraak.BOKMAAL:
            return nb
        case Spraak.NYNORSK:
            return nn
        case Spraak.ENGELSK:
            return enGB
        default:
            return nb
    }
}
