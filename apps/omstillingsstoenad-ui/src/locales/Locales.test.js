import nbLocale from './nb'
import nnLocale from './nn'
import enLocale from './en'

describe('Validering av språkfiler', () => {
    it('Nynorsk har alle de samme tekstnøklene som bokmål', () => {
        expect(inneholderSammeNoekler(nbLocale, nnLocale)).toStrictEqual([])
    })

    it('Bokmål har alle de samme tekstnøklene som nynorsk', () => {
        expect(inneholderSammeNoekler(nnLocale, nbLocale)).toStrictEqual([])
    })

    it('Engelsk har alle de samme tekstnøklene som bokmål', () => {
        expect(inneholderSammeNoekler(nbLocale, enLocale)).toStrictEqual([])
    })

    it('Bokmål har ingen tomme verdier', () => {
        expect(finnesTommeVerdier(nbLocale)).toBeFalsy()
    })

    it('Nynorsk har ingen tomme verdier', () => {
        expect(finnesTommeVerdier(nnLocale)).toBeFalsy()
    })

    it('Engelsk har ingen tomme verdier', () => {
        expect(finnesTommeVerdier(enLocale)).toBeFalsy()
    })

    it('Alle har like mange nøkler', () => {
        const nbCount = Object.entries(nbLocale).length
        const nnCount = Object.entries(nnLocale).length
        const enCount = Object.entries(enLocale).length

        expect(nbCount).toEqual(nnCount)
        expect(nbCount).toEqual(enCount)

        expect(nnCount).toEqual(nbCount)
        expect(nnCount).toEqual(enCount)

        expect(enCount).toEqual(nbCount)
        expect(enCount).toEqual(nnCount)
    })

    function finnesTommeVerdier(locale) {
        return Object.keys(locale).filter((key) => !locale[key]).length
    }

    function inneholderSammeNoekler(obj1, obj2) {
        const o1 = Object.keys(obj1)
        const o2 = Object.keys(obj2)

        return o1.filter((key) => !o2.includes(key))
    }
})
