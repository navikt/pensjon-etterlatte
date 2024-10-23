import { Alder, IInnloggetBruker } from '../../types/person.ts'
import { differenceInYears } from 'date-fns'

export const finnAlder = (innloggetBruker: IInnloggetBruker): Alder => {
    // Beregn alder utifra neste år, trenger kun å være ut ifra fødselsår, ikke spesifik dato

    if (innloggetBruker.foedselsdato) {
        const nesteAar = new Date().setFullYear(new Date().getFullYear() + 1)
        const alderNesteAar = differenceInYears(nesteAar, innloggetBruker.foedselsdato)

        if (alderNesteAar >= 18 && alderNesteAar <= 61) {
            return Alder.ATTEN_TIL_SEKSTI_EN
        } else if (alderNesteAar >= 62 && alderNesteAar <= 66) {
            return Alder.SEKSTI_TO_TIL_SEKSTI_SEKS
        } else if (alderNesteAar === 67) {
            return Alder.SEKSTI_SYV
        } else {
            return Alder.IKKE_GYLDIG
        }
    } else {
        return Alder.IKKE_GYLDIG
    }
}
