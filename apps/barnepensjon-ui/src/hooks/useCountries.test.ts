import { moveNorwayToBeginning } from './useCountries'
import { describe, expect, it } from 'vitest'
/**
 * @vitest-environment jsdom
 */

describe('Test of moveMostUsedCountriesToBeginning', () => {
    it('Sjekk mest brukte land ender på først i listen', () => {
        const countries = [
            {
                gyldigFra: '1900-01-01',
                gyldigTil: '9999-12-31',
                beskrivelser: {
                    nb: {
                        term: 'FINLAND',
                        tekst: 'FINLAND',
                    },
                },
            },

            {
                gyldigFra: '1900-01-03',
                gyldigTil: '9999-12-31',
                beskrivelser: {
                    nb: {
                        term: 'FÆRØYENE',
                        tekst: 'FÆRØYENE',
                    },
                },
            },
            {
                gyldigFra: '1900-01-04',
                gyldigTil: '9999-12-31',
                beskrivelser: {
                    nb: {
                        term: 'DANMARK',
                        tekst: 'DANMARK',
                    },
                },
            },
            {
                gyldigFra: '1900-01-05',
                gyldigTil: '9999-12-31',
                beskrivelser: {
                    nb: {
                        term: 'GRØNLAND',
                        tekst: 'GRØNLAND',
                    },
                },
            },
            {
                gyldigFra: '1900-01-06',
                gyldigTil: '9999-12-31',
                beskrivelser: {
                    nb: {
                        term: 'NORGE',
                        tekst: 'NORGE',
                    },
                },
            },
            {
                gyldigFra: '1900-01-02',
                gyldigTil: '9999-12-31',
                beskrivelser: {
                    nb: {
                        term: 'SVERIGE',
                        tekst: 'SVERIGE',
                    },
                },
            },
        ]
        const sortedCountries = moveNorwayToBeginning(countries)

        const norgeInSortedCountries = sortedCountries.filter((country) => country.beskrivelser.nb.tekst === 'NORGE')

        expect(sortedCountries[0].beskrivelser.nb.tekst).toBe('NORGE')
        expect(norgeInSortedCountries.length).toBe(1)
    })

    it('Vil returnere listen vis landene ikke finnes', () => {
        const countries = [
            {
                gyldigFra: '1900-01-01',
                gyldigTil: '9999-12-31',
                beskrivelser: {
                    nb: {
                        term: 'FINLAND',
                        tekst: 'FINLAND',
                    },
                },
            },
            {
                gyldigFra: '1900-01-03',
                gyldigTil: '9999-12-31',
                beskrivelser: {
                    nb: {
                        term: 'FÆRØYENE',
                        tekst: 'FÆRØYENE',
                    },
                },
            },
        ]
        const sortedContries = moveNorwayToBeginning(countries)

        expect(sortedContries[0].beskrivelser.nb.tekst).toBe('FINLAND')
        expect(sortedContries[1].beskrivelser.nb.tekst).toBe('FÆRØYENE')
    })
})
