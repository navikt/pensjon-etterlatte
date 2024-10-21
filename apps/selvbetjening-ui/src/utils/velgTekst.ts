import { SkalGaaAvMedAlderspensjon } from '../types/inntektsjustering.ts'
import { FellesKomponenter } from '../sanity.types.ts'
import { Spraak } from '../common/spraak/spraak.ts'

export const velgTekstForSkalGaaAvMedAlderspensjon = (
    skalGaaAvMedAlderspensjonValue: SkalGaaAvMedAlderspensjon,
    fellesKomponenterInnhold: FellesKomponenter,
    spraak: Spraak
): string | undefined => {
    switch (skalGaaAvMedAlderspensjonValue) {
        case SkalGaaAvMedAlderspensjon.JA:
            return fellesKomponenterInnhold?.sammendragAvInntekt?.skalGaaAvMedAlderspensjon?.value?.ja?.[spraak]
        case SkalGaaAvMedAlderspensjon.NEI:
            return fellesKomponenterInnhold?.sammendragAvInntekt?.skalGaaAvMedAlderspensjon?.value?.nei?.[spraak]
        case SkalGaaAvMedAlderspensjon.VET_IKKE:
            return fellesKomponenterInnhold?.sammendragAvInntekt?.skalGaaAvMedAlderspensjon?.value?.vetIkke?.[spraak]
    }
}
