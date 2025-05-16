import { Spraak } from '../../common/spraak/spraak.ts'
import { Endring } from '../../types/meldInnEndring.ts'
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
        case Endring.ANNET:
            return meldInnEndringOppsummeringInnhold.skjemaSammendrag?.endring?.value?.annet?.[spraak]
    }
}
