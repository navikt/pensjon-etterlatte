import { differenceInYears } from 'date-fns'
import { IBruker } from '~context/bruker/bruker'

export const skalKunneTaUtAlderspensjon = (bruker: IBruker) => {
    if (bruker.foedselsdato) {
        const alder = differenceInYears(new Date(), bruker.foedselsdato)
        return alder >= 62
    }

    return false
}
