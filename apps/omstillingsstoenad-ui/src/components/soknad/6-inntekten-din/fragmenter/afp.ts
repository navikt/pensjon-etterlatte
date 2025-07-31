// Inntekts felter for Avtalefestet alderspensjon skal kun vises hvis bruker fyller 62 neste år eller er eldre enn 62
import { differenceInYears } from 'date-fns'
import { IBruker } from '~context/bruker/bruker'

export const skalViseAFPFelter = (bruker: IBruker): boolean => {
    if (!!bruker.foedselsdato) {
        const nesteAar = new Date().setFullYear(new Date().getFullYear() + 1)
        const alderNesteAar = differenceInYears(nesteAar, bruker.foedselsdato)

        const alder = differenceInYears(new Date(), bruker.foedselsdato)
        if (alder > 62) {
            return true
        } else if (alderNesteAar === 62) {
            return true
        } else {
            return false
        }
    } else {
        return false
    }
}
