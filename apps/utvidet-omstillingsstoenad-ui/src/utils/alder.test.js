import { erForGammel, erForUng, erMyndig, gyldigAlder } from './alder'

describe('Test at funksjoner for alder fungerer', () => {
    it('Sjekk at alder er gyldig', () => {
        // Alder under 18
        expect(gyldigAlder(5)).toBeFalsy()
        expect(gyldigAlder(12)).toBeFalsy()
        expect(gyldigAlder(17)).toBeFalsy()

        // Alder mellom 18 og 67
        expect(gyldigAlder(18)).toBeTruthy()
        expect(gyldigAlder(26)).toBeTruthy()
        expect(gyldigAlder(49)).toBeTruthy()
        expect(gyldigAlder(53)).toBeTruthy()
        expect(gyldigAlder(67)).toBeTruthy()
    })

    it('Sjekk om bruker erForUng', () => {
        // 68 år er for gammel, men skal ikke trigge "erForUng"
        expect(erForUng(68)).toBeFalsy()

        expect(erForUng(67)).toBeFalsy()
        expect(erForUng(18)).toBeFalsy()

        // Alt under 18 år skal være true
        expect(erForUng(17)).toBeTruthy()
    })

    it('Sjekk om bruker erForGammel', () => {
        // 17 år er for gammel, men skal ikke trigge "erForGammel"
        expect(erForGammel(17)).toBeFalsy()

        expect(erForGammel(18)).toBeFalsy()
        expect(erForGammel(67)).toBeFalsy()

        // Alt over 68 skal være true
        expect(erForGammel(68)).toBeTruthy()
    })

    it('Sjekk om alderen regnes som myndig', () => {
        // Alt under 17 skal være false
        expect(erMyndig(17)).toBeFalsy()

        // Alt f.o.m 18 skal være true
        expect(erMyndig(18)).toBeTruthy()
        expect(erMyndig(20)).toBeTruthy()
    })
})
