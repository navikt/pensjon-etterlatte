export interface Inntekt {
    skalGaaAvMedAlderspensjon?: SkalGaaAvMedAlderspensjon
    arbeidsinntekt: number
    naeringsinntekt: number
    inntektFraUtland: number
    AFPInntekt: number
    AFPTjenesteordning?: string
}

export enum SkalGaaAvMedAlderspensjon {
    JA,
    NEI,
    VET_IKKE,
}

export const inntektDefaultValues: Inntekt = {
    skalGaaAvMedAlderspensjon: undefined,
    arbeidsinntekt: 0,
    naeringsinntekt: 0,
    inntektFraUtland: 0,
    AFPInntekt: 0,
    AFPTjenesteordning: '',
}
