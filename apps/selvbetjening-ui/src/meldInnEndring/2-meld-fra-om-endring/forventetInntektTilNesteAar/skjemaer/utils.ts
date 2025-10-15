import { Spraak } from '../../../../common/spraak/spraak.ts'
import { ForventetInntektTilNesteAar, ForventetInntektTilNesteAarSkjema } from '../../../../types/meldInnEndring.ts'

export const forventetInntektTilNesteAarTilSkjemaValues = (
    forventetInntektTilNesteAar: ForventetInntektTilNesteAar,
    spraak: Spraak
): ForventetInntektTilNesteAarSkjema => {
    return {
        ...forventetInntektTilNesteAar,
        arbeidsinntekt: new Intl.NumberFormat(spraak.toLowerCase()).format(forventetInntektTilNesteAar.arbeidsinntekt),
        naeringsinntekt: new Intl.NumberFormat(spraak.toLowerCase()).format(
            forventetInntektTilNesteAar.naeringsinntekt
        ),
        afpInntekt: new Intl.NumberFormat(spraak.toLowerCase()).format(forventetInntektTilNesteAar.afpInntekt),
        inntektFraUtland: new Intl.NumberFormat(spraak.toLowerCase()).format(
            forventetInntektTilNesteAar.inntektFraUtland
        ),
    }
}

export const forventetInntektTilNesteAarSkjemaValuesTilValues = (
    forventetInntektTilNesteAarSkjema: ForventetInntektTilNesteAarSkjema
): ForventetInntektTilNesteAar => {
    return {
        ...forventetInntektTilNesteAarSkjema,
        arbeidsinntekt: Number(forventetInntektTilNesteAarSkjema.arbeidsinntekt.replace(/[^0-9.]/g, '')),
        naeringsinntekt: Number(forventetInntektTilNesteAarSkjema.naeringsinntekt.replace(/[^0-9.]/g, '')),
        inntektFraUtland: Number(forventetInntektTilNesteAarSkjema.inntektFraUtland.replace(/[^0-9.]/g, '')),
        afpInntekt: Number(forventetInntektTilNesteAarSkjema.afpInntekt.replace(/[^0-9.]/g, '')),
    }
}
