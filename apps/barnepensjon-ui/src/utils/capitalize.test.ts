import { capitalize, capitalizeName } from './capitalize'

describe('Test of capitalize', () => {
    it('Single word in uppercase is capitalized', () => {
        const testString = 'TEST'
        const fasitString = 'Test'

        expect(capitalize(testString)).toStrictEqual(fasitString)
    })

    it('Single word in lowercase is capitalized', () => {
        const testString = 'test'
        const fasitString = 'Test'

        expect(capitalize(testString)).toStrictEqual(fasitString)
    })
})

describe('Test of capitalizeName', () => {
    it('Single word in uppercase is capitalized', () => {
        const testString = 'TEST'
        const fasitString = 'Test'

        expect(capitalizeName(testString)).toStrictEqual(fasitString)
    })

    it('Two words in uppercase is capitalized', () => {
        const testString = 'TEST TESTESEN'
        const fasitString = 'Test Testesen'

        expect(capitalizeName(testString)).toStrictEqual(fasitString)
    })

    it('"Dobbeltnavn" in uppercase is capitalized', () => {
        const testString = 'TEST-TESTESEN'
        const fasitString = 'Test-Testesen'

        expect(capitalizeName(testString)).toStrictEqual(fasitString)
    })

    it('Single word in lowercase is capitalized', () => {
        const testString = 'test'
        const fasitString = 'Test'

        expect(capitalizeName(testString)).toStrictEqual(fasitString)
    })

    it('Two words in lowercase is capitalized', () => {
        const testString = 'test testesen'
        const fasitString = 'Test Testesen'

        expect(capitalizeName(testString)).toStrictEqual(fasitString)
    })

    it('"Dobbeltnavn" in lowercase is capitalized', () => {
        const testString = 'test-testesen'
        const fasitString = 'Test-Testesen'

        expect(capitalizeName(testString)).toStrictEqual(fasitString)
    })
})
