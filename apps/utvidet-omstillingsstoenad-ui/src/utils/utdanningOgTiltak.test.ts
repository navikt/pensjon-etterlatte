import { describe, expect, it } from 'vitest'
import { gyldigStudieprosent, rensUtdanningOgTiltak } from './utdanningOgTiltak'

describe('Utdanning og tiltak', () => {
    it.each([
        ['1', true],
        ['49', true],
        ['100', true],
        ['0', false],
        ['101', false],
        ['-1', false],
        ['1.5', false],
        ['1,5', false],
        ['1e2', false],
        ['abc', false],
        ['', false],
        [undefined, false],
    ])('Validerer studieprosent %s', (verdi, gyldig) => {
        expect(gyldigStudieprosent(verdi)).toBe(gyldig)
    })

    it('Renser også skjulte felt fra ufullstendige og eldre kladder uten å mutere originalen', () => {
        const data = {
            aktivitet: 'UTDANNING' as const,
            utdanning: { studieform: 'HELTID' as const, studieprosent: '40' },
            arbeidsrettetTiltak: { tiltak: 'Gammelt tiltak' },
            aktivitetsplan: 'JA' as const,
        }
        expect(rensUtdanningOgTiltak(data)).toEqual({
            aktivitet: 'UTDANNING',
            utdanning: { studieform: 'HELTID' },
        })
        expect(data.utdanning.studieprosent).toBe('40')
        expect(rensUtdanningOgTiltak({ ...data, aktivitet: 'INGEN' })).toEqual({ aktivitet: 'INGEN' })
        expect(rensUtdanningOgTiltak({ utdanning: data.utdanning })).toEqual({})
    })
})
