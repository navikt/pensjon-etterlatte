// Inntekts felter for Avtalefestet alderspensjon skal kun vises hvis bruker fyller 62 neste år eller er eldre enn 62
import { differenceInYears } from 'date-fns'
import { IBruker } from '~context/bruker/bruker'

export const skalViseAFPFelter = (bruker: IBruker): boolean => {
    if (bruker.foedselsdato) {
        const alderIAar = differenceInYears(new Date(), new Date(bruker.foedselsdato).setMonth(0))
        return alderIAar >= 62
    }

    return false
}
