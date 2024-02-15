import { capitalize, capitalizeName } from './capitalize'

describe('Test av capitalize', () => {
    it('Tester at enkelt navn i uppercase får stor forbokstav', () => {
        const testString = 'TEST'
        const fasitString = 'Test'

        expect(capitalize(testString)).toStrictEqual(fasitString)
    })

    it('Tester at enkelt navn i lowercase får stor forbokstav', () => {
        const testString = 'test'
        const fasitString = 'Test'

        expect(capitalize(testString)).toStrictEqual(fasitString)
    })
})

describe('Test av capitalizeName', () => {
    it('Tester at enkelt navn i uppercase får stor forbokstav', () => {
        const testString = 'TEST'
        const fasitString = 'Test'

        expect(capitalizeName(testString)).toStrictEqual(fasitString)
    })

    it('Two words in uppercase is capitalized', () => {
        const testString = 'TEST TESTESEN'
        const fasitString = 'Test Testesen'

        expect(capitalizeName(testString)).toStrictEqual(fasitString)
    })

    it('Tester at dobbeltnavn med "-" i uppercase får stor forbokstav', () => {
        const testString = 'TEST-TESTESEN'
        const fasitString = 'Test-Testesen'

        expect(capitalizeName(testString)).toStrictEqual(fasitString)
    })

    it('Tester at enkelt navn i lowercase får stor forbokstav', () => {
        const testString = 'test'
        const fasitString = 'Test'

        expect(capitalizeName(testString)).toStrictEqual(fasitString)
    })

    it('Tester at dobbelt navn i lowercase får stor forbokstav', () => {
        const testString = 'test testesen'
        const fasitString = 'Test Testesen'

        expect(capitalizeName(testString)).toStrictEqual(fasitString)
    })

    it('Tester at dobbeltnavn med "-" i lowercase får stor forbokstav', () => {
        const testString = 'test-testesen'
        const fasitString = 'Test-Testesen'

        expect(capitalizeName(testString)).toStrictEqual(fasitString)
    })
})
