import { fullAdresse } from './adresse'

describe('Test at adresse blir korrekt bygget opp', () => {
    it('Skal bygge opp hele adressen', () => {
        const bruker = {
            adresse: 'Fyrstikkalleen',
            husnummer: 1,
            husbokstav: 'A',
            postnummer: '1024',
            poststed: 'Oslo',
            adressebeskyttelse: false,
        }

        expect(fullAdresse(bruker)).toBe('Fyrstikkalleen 1A, 1024 Oslo')
    })

    it('Skal håndtere manglende husnummer og bokstav', () => {
        const bruker = {
            adresse: 'Fyrstikkalleen',
            postnummer: '1024',
            poststed: 'Oslo',
            adressebeskyttelse: false,
        }

        expect(fullAdresse(bruker)).toBe('Fyrstikkalleen, 1024 Oslo')
    })

    it('Skal returnere tom string for personer med adressebeskyttelse', () => {
        const bruker = {
            adresse: 'Fyrstikkalleen',
            postnummer: '1024',
            poststed: 'Oslo',
            adressebeskyttelse: true,
        }

        expect(fullAdresse(bruker)).toBe('')
    })
})
