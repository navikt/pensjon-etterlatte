import { Spraak } from '../../common/spraak/spraak.ts'
import { Endring, SkalGaaAvMedAlderspensjon } from '../../types/meldInnEndring.ts'
import { MeldInnEndringOppsummering } from '../sanity.types.ts'

export const velgTekstForEndring = (
    endring: Endring | undefined,
    meldInnEndringOppsummeringInnhold: MeldInnEndringOppsummering,
    spraak: Spraak
): string | undefined => {
    switch (endring) {
        case Endring.AKTIVITET_OG_INNTEKT:
            return meldInnEndringOppsummeringInnhold.skjemaSammendrag?.endring?.value?.aktivitetOgInntekt?.[spraak]
        case Endring.INNTEKT:
            return meldInnEndringOppsummeringInnhold.skjemaSammendrag?.endring?.value?.inntekt?.[spraak]
        case Endring.SVAR_PAA_ETTEROPPGJOER:
            return meldInnEndringOppsummeringInnhold.skjemaSammendrag?.endring?.value?.svarPaaEtteroppgjoer?.[spraak]
        case Endring.FORVENTET_INNTEKT_TIL_NESTE_AAR:
            return meldInnEndringOppsummeringInnhold.skjemaSammendrag?.endring?.value?.forventetInntektTilNesteAar?.[
                spraak
            ]
        case Endring.ANNET:
            return meldInnEndringOppsummeringInnhold.skjemaSammendrag?.endring?.value?.annet?.[spraak]
    }
}

export const velgTekstForSkalGaaAvMedAlderspensjon = (
    skalGaaAvMedAlderspensjonValue: SkalGaaAvMedAlderspensjon,
    meldInnEndringOppsummeringInnhold: MeldInnEndringOppsummering,
    spraak: Spraak
): string | undefined => {
    switch (skalGaaAvMedAlderspensjonValue) {
        case SkalGaaAvMedAlderspensjon.JA:
            return meldInnEndringOppsummeringInnhold?.skjemaSammendrag?.skalGaaAvMedAlderspensjon?.value?.ja?.[spraak]
        case SkalGaaAvMedAlderspensjon.NEI:
            return meldInnEndringOppsummeringInnhold?.skjemaSammendrag?.skalGaaAvMedAlderspensjon?.value?.nei?.[spraak]
        case SkalGaaAvMedAlderspensjon.VET_IKKE:
            return meldInnEndringOppsummeringInnhold?.skjemaSammendrag?.skalGaaAvMedAlderspensjon?.value?.vetIkke?.[
                spraak
            ]
    }
}
