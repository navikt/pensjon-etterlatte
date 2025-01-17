export enum Endring {
    INNTEKT = 'INNTEKT',
    AKTIVITET_OG_INNTEKT = 'AKTIVITET_OG_INNTEKT',
    ANNET = 'ANNET',
}

export interface MeldtInnEndring {
    endring?: Endring
    beskrivelse: string
}

export const meldInnEndringDefaultValues: MeldtInnEndring = {
    endring: undefined,
    beskrivelse: '',
}
