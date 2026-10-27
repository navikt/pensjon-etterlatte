import { describe, expect, it } from 'vitest'
import { Inntekt } from '../typer/skjema'
import { erGyldigBeloep, klargjoerInntekt, normaliserBeloep } from './inntekt'

describe('Beløp', () => {
    it.each(['0', '1', '250 000', '1\u00a0000', '99999999999999999999'])('godtar %s', (verdi) => {
        expect(erGyldigBeloep(verdi)).toBe(true)
    })

    it.each(['', ' ', '-1', '1.5', '1,5', '1e3', '+1', 'abc'])('avviser %s', (verdi) => {
        expect(erGyldigBeloep(verdi)).toBe(false)
    })

    it('fjerner mellomrom uten avrunding eller endring av ugyldige tegn', () => {
        expect(normaliserBeloep('999 999 999 999 999 999')).toBe('999999999999999999')
        expect(normaliserBeloep('-1.5')).toBe('-1.5')
    })
})

describe('Klargjøring av inntektssteget', () => {
    const inntekt: Inntekt = {
        arbeidsinntekt: '100 000',
        naeringsinntekt: '0',
        inntektFraUtland: '1 000',
        andreInntekter: { valg: 'JA', inntekt: '2 000', beskrivelse: 'Utleie' },
        noeSomKanPaavirkeInntekten: {
            valg: 'JA',
            grunnTilPaavirkelseAvInntekt: 'ANNEN_GRUNN',
            beskrivelse: 'Endring',
        },
    }

    it('normaliserer alle beløp uten å endre originalen', () => {
        expect(klargjoerInntekt(inntekt)).toEqual({
            ...inntekt,
            arbeidsinntekt: '100000',
            inntektFraUtland: '1000',
            andreInntekter: { ...inntekt.andreInntekter, inntekt: '2000' },
        })
        expect(inntekt.arbeidsinntekt).toBe('100 000')
        expect(inntekt.andreInntekter.inntekt).toBe('2 000')
    })

    it.each(['NEI', 'VET_IKKE'] as const)('fjerner skjulte oppfølgingsverdier ved %s', (valg) => {
        const resultat = klargjoerInntekt({
            ...inntekt,
            andreInntekter: { ...inntekt.andreInntekter, valg },
            noeSomKanPaavirkeInntekten: { ...inntekt.noeSomKanPaavirkeInntekten, valg },
        })
        expect(resultat.andreInntekter).toEqual({ valg })
        expect(resultat.noeSomKanPaavirkeInntekten).toEqual({ valg })
    })

    it('fjerner beskrivelse når grunnen ikke er annen', () => {
        const resultat = klargjoerInntekt({
            ...inntekt,
            noeSomKanPaavirkeInntekten: {
                ...inntekt.noeSomKanPaavirkeInntekten,
                grunnTilPaavirkelseAvInntekt: 'OEKT_STILLINGSPROSENT',
            },
        })
        expect(resultat.noeSomKanPaavirkeInntekten).toEqual({
            valg: 'JA',
            grunnTilPaavirkelseAvInntekt: 'OEKT_STILLINGSPROSENT',
        })
    })

    it('beholder ubesvarte spørsmål i kladden uten å velge et svar', () => {
        const resultat = klargjoerInntekt({
            ...inntekt,
            arbeidsinntekt: '',
            andreInntekter: {},
            noeSomKanPaavirkeInntekten: {},
        })
        expect(resultat.arbeidsinntekt).toBe('')
        expect(resultat.andreInntekter.valg).toBeUndefined()
        expect(resultat.noeSomKanPaavirkeInntekten.valg).toBeUndefined()
    })
})
