import { Inntekt, InntektSkjema } from '../../../types/inntektsjustering.ts'
import { Spraak } from '../../../common/spraak/spraak.ts'

export const inntektTilInntektSkjemaValues = (inntekt: Inntekt, spraak: Spraak): InntektSkjema => {
    return {
        ...inntekt,
        arbeidsinntekt: new Intl.NumberFormat(spraak.toLowerCase()).format(inntekt.arbeidsinntekt),
        naeringsinntekt: new Intl.NumberFormat(spraak.toLowerCase()).format(inntekt.naeringsinntekt),
        afpInntekt: new Intl.NumberFormat(spraak.toLowerCase()).format(inntekt.afpInntekt),
        inntektFraUtland: new Intl.NumberFormat(spraak.toLowerCase()).format(inntekt.inntektFraUtland),
    }
}

export const inntektSkjemaValuesTilInntekt = (inntektSkjema: InntektSkjema): Inntekt => {
    return {
        ...inntektSkjema,
        arbeidsinntekt: Number(inntektSkjema.arbeidsinntekt.replace(/[^0-9.]/g, '')),
        naeringsinntekt: Number(inntektSkjema.naeringsinntekt.replace(/[^0-9.]/g, '')),
        inntektFraUtland: Number(inntektSkjema.inntektFraUtland.replace(/[^0-9.]/g, '')),
        afpInntekt: Number(inntektSkjema.afpInntekt.replace(/[^0-9.]/g, '')),
    }
}
