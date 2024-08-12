export interface IInntektsjustering {
    arbeidsinntekt: number
    naeringsinntekt: number
    arbeidsinntektUtland: number
    naeringsinntektUtland: number
    tidspunkt: string
}

export interface IInntektsjusteringLagre {
    arbeidsinntekt: number
    naeringsinntekt: number
    arbeidsinntektUtland: number
    naeringsinntektUtland: number
}

export interface IInntektsjusteringForm {
    skalHaArbeidsinntekt: boolean
    skalHaNaeringsinntekt: boolean
    skalHaInntektNorge: boolean
    skalHaInntektUtland: boolean

    arbeidsinntekt?: number
    naeringsinntekt?: number
    arbeidsinntektUtland?: number
    naeringsinntektUtland?: number
}
