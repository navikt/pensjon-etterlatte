export interface Inntekt {
    skalGaaAvMedAlderspensjon?: SkalGaaAvMedAlderspensjon
    datoForAaGaaAvMedAlderspensjon?: Date | string
    arbeidsinntekt: number
    naeringsinntekt: number
    inntektFraUtland: number
    afpInntekt: number
    afpTjenesteordning?: string
}

export enum SkalGaaAvMedAlderspensjon {
    JA = 'JA',
    NEI = 'NEI',
    VET_IKKE = 'VET_IKKE',
}

export const inntektDefaultValues: Inntekt = {
    skalGaaAvMedAlderspensjon: undefined,
    datoForAaGaaAvMedAlderspensjon: undefined,
    arbeidsinntekt: 0,
    naeringsinntekt: 0,
    inntektFraUtland: 0,
    afpInntekt: 0,
    afpTjenesteordning: undefined,
}
