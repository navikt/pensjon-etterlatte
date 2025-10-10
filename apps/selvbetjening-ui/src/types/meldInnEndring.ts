export enum Endring {
    INNTEKT = 'INNTEKT',
    AKTIVITET_OG_INNTEKT = 'AKTIVITET_OG_INNTEKT',
    SVAR_PAA_ETTEROPPGJOER = 'SVAR_PAA_ETTEROPPGJOER',
    FORVENTET_INNTEKT_TIL_NESTE_AAR = 'FORVENTET_INNTEKT_TIL_NESTE_AAR',
    ANNET = 'ANNET',
}

export interface MeldtInnEndring {
    endring: Endring | undefined
    beskrivelse: string
}

export const meldInnEndringDefaultValues: MeldtInnEndring = {
    endring: undefined,
    beskrivelse: '',
}
