export enum Endring {
    INNTEKT = 'INNTEKT',
    AKTIVITET_OG_INNTEKT = 'AKTIVITET_OG_INNTEKT',
    SVAR_PAA_ETTEROPPGJOER = 'SVAR_PAA_ETTEROPPGJOER',
    FORVENTET_INNTEKT_TIL_NESTE_AAR = 'FORVENTET_INNTEKT_TIL_NESTE_AAR',
    ANNET = 'ANNET',
}

export interface MeldtInnEndring {
    endring: Endring | undefined
    forventetInntektTilNesteAar?: ForventetInntektTilNesteAarSkjema
    beskrivelse: string
}

export const meldInnEndringDefaultValues: MeldtInnEndring = {
    endring: undefined,
    forventetInntektTilNesteAar: {
        arbeidsinntekt: '0',
        naeringsinntekt: '0',
        afpInntekt: '0',
        inntektFraUtland: '0',
    },
    beskrivelse: '',
}

export interface ForventetInntektTilNesteAarSkjema {
    skalGaaAvMedAlderspensjon?: SkalGaaAvMedAlderspensjon
    datoForAaGaaAvMedAlderspensjon?: Date | string
    arbeidsinntekt: string
    naeringsinntekt: string
    inntektFraUtland: string
    afpInntekt: string
    afpTjenesteordning?: string
}

export interface ForventetInntektTilNesteAar {
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
