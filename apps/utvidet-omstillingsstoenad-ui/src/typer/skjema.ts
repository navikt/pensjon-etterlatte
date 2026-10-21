export type JaNei = 'JA' | 'NEI'
export type JaNeiVetIkke = JaNei | 'VET_IKKE'
export type Omfang = 'HELTID' | 'DELTID'

export interface Person {
    fornavn: string
    etternavn: string
    foedselsnummer: string
}

export interface SituasjonenDin {
    nySivilstand: 'NY_SAMBOER' | 'GIFTET_PAA_NYTT' | 'INGEN_AV_DELENE'
    samboer?: Person & { fellesBarnEllertidligereGift: JaNei }
}

export interface UtdanningOgTiltak {
    aktivitet: 'UTDANNING' | 'ARBEIDSRETTET_TILTAK' | 'INGEN'
    utdanning?: {
        studiested: string
        studie: string
        startDato: string
        sluttDato: string
        studieform: Omfang
        studieprosent?: string
    }
    arbeidsrettetTiltak?: { tiltak: string; omfang: Omfang }
    aktivitetsplan?: JaNei
}

export type Inntektsendring =
    | 'OEKT_STILLINGSPROSENT'
    | 'REDUSERT_STILLINGSPROSENT'
    | 'PERMISJON_UTEN_LOENN'
    | 'LOENNSOEKNING'
    | 'ARBEIDSLEDIG'
    | 'SESONGARBEID'
    | 'BYTTE_AV_JOBB'
    | 'ANNEN_GRUNN'

export interface Inntekt {
    arbeidsinntekt: string
    naeringsinntekt: string
    inntektFraUtland: string
    andreInntekter: {
        valg: JaNeiVetIkke
        inntekt?: string
        beskrivelse?: string
    }
    noeSomKanPaavirkeInntekten: {
        valg: JaNeiVetIkke
        grunnTilPaavirkelseAvInntekt?: Inntektsendring
        beskrivelse?: string
    }
}

export interface Skjema {
    situasjonenDinIDag?: SituasjonenDin
    utdanningOgTiltak?: UtdanningOgTiltak
    inntekt?: Inntekt
}
