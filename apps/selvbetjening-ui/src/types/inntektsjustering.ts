export interface Inntekt {
    arbeidsinntekt: number
    naeringsinntekt: number
    inntektFraUtland: number
    AFPInntekt: number
    AFPTjenesteordning?: string
}
export const inntektDefaultValues: Inntekt = {
    arbeidsinntekt: 0,
    naeringsinntekt: 0,
    inntektFraUtland: 0,
    AFPInntekt: 0,
    AFPTjenesteordning: '',
}
