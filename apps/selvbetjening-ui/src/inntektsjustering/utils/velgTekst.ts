import { Spraak } from '../../common/spraak/spraak.ts'
import { SkalGaaAvMedAlderspensjon } from '../../types/inntektsjustering.ts'
import { InntektsjusteringOppsummering } from '../sanity.types.ts'

export const velgTekstForSkalGaaAvMedAlderspensjon = (
    skalGaaAvMedAlderspensjonValue: SkalGaaAvMedAlderspensjon,
    inntektsjusteringOppsummeringInnhold: InntektsjusteringOppsummering,
    spraak: Spraak
): string | undefined => {
    switch (skalGaaAvMedAlderspensjonValue) {
        case SkalGaaAvMedAlderspensjon.JA:
            return inntektsjusteringOppsummeringInnhold?.skjemaSammendrag?.skalGaaAvMedAlderspensjon?.value?.ja?.[
                spraak
            ]
        case SkalGaaAvMedAlderspensjon.NEI:
            return inntektsjusteringOppsummeringInnhold?.skjemaSammendrag?.skalGaaAvMedAlderspensjon?.value?.nei?.[
                spraak
            ]
        case SkalGaaAvMedAlderspensjon.VET_IKKE:
            return inntektsjusteringOppsummeringInnhold?.skjemaSammendrag?.skalGaaAvMedAlderspensjon?.value?.vetIkke?.[
                spraak
            ]
    }
}
