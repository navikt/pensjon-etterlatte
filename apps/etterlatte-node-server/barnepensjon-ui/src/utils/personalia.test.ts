import { fullAdresse, nameAndFnr } from './personalia'
import { IParent } from '../context/application/application'

describe('Test at adresse blir korrekt bygget opp', () => {
    it('Skal bygge opp hele adressen', () => {
        const bruker = {
            adresse: 'Fyrstikkalleen',
            husnummer: '1',
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

describe('Test at navn og fnr blir korrekt', () => {
    it('Skal opprette navn og fnr, med kun fdato', () => {
        const parent: IParent = {
            firstName: 'Test',
            lastName: 'Testesen',
            fnrDnr: '1234567890',
            citizenship: '-',
        }

        expect(nameAndFnr(parent)).toBe('Test Testesen (f. 123456)')
    })
})
