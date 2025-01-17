import { Endring } from '../../types/meldInnEndring.ts'
import { MeldInnEndringOppsummering } from '../sanity.types.ts'
import { Spraak } from '../../common/spraak/spraak.ts'

export const velgTekstForEndring = (
    endring: Endring,
    meldInnEndringOppsummeringInnhold: MeldInnEndringOppsummering,
    spraak: Spraak
): string | undefined => {
    switch (endring) {
        case Endring.AKTIVITET_OG_INNTEKT:
            return meldInnEndringOppsummeringInnhold.skjemaSammendrag?.endring?.value?.aktivitetOgInntekt?.[spraak]
        case Endring.INNTEKT:
            return meldInnEndringOppsummeringInnhold.skjemaSammendrag?.endring?.value?.inntekt?.[spraak]
        case Endring.ANNET:
            return meldInnEndringOppsummeringInnhold.skjemaSammendrag?.endring?.value?.annet?.[spraak]
    }
}
