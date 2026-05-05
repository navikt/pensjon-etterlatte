import { subYears } from 'date-fns'
import { describe, expect, it } from 'vitest'
import { Alder } from '../../../types/person.ts'
import { finnAlder } from './finnAlder.ts'

describe('Finn alder', () => {
    it('Burde gi ut riktig enum for riktig alder neste år', () => {
        const naa = new Date()
        const attenTilSekstiEn = subYears(naa, 20)
        const sekstiToTilSekstiSeks = subYears(naa, 63)
        // Vi kalkulerer alderen til neste år, dermed gir 66 mening
        const sekstiSyv = subYears(naa, 66)
        const ettHundre = subYears(naa, 100)

        const brukerUtenFoedselsdato = {
            fornavn: '',
            etternavn: '',
            foedselsnummer: '',
            foedselsaar: 12345,
            foedselsdato: '',
        }

        expect(finnAlder({ ...brukerUtenFoedselsdato, foedselsdato: attenTilSekstiEn })).toEqual(
            Alder.ATTEN_TIL_SEKSTI_EN
        )
        expect(finnAlder({ ...brukerUtenFoedselsdato, foedselsdato: sekstiToTilSekstiSeks })).toEqual(
            Alder.SEKSTI_TO_TIL_SEKSTI_SEKS
        )
        expect(finnAlder({ ...brukerUtenFoedselsdato, foedselsdato: sekstiSyv })).toEqual(Alder.SEKSTI_SYV)
        expect(finnAlder({ ...brukerUtenFoedselsdato, foedselsdato: ettHundre })).toEqual(Alder.IKKE_GYLDIG)
        expect(finnAlder(brukerUtenFoedselsdato)).toEqual(Alder.IKKE_GYLDIG)
    })
})
