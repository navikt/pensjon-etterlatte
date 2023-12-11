import nbLocale from './nb'
import nnLocale from './nn'
import enLocale from './en'

describe('Validering av språkfiler', () => {
    it('Nynorsk har alle de samme tekstnøklene som bokmål', () => {
        const noklerSomMangler = Object.keys(nbLocale).map((nokkel) => {
            return inneholderSammeNoekler(nbLocale[nokkel], nnLocale[nokkel])
        })

        expect(noklerSomMangler.flat()).toStrictEqual([])
    })

    it('Bokmål har alle de samme tekstnøklene som nynorsk', () => {
        const noklerSomMangler = Object.keys(nbLocale).map((nokkel) => {
            return inneholderSammeNoekler(nnLocale[nokkel], nbLocale[nokkel])
        })

        expect(noklerSomMangler.flat()).toStrictEqual([])
    })

    it('Engelsk har alle de samme tekstnøklene som bokmål', () => {
        const noklerSomMangler = Object.keys(nbLocale).map((nokkel) => {
            return inneholderSammeNoekler(nbLocale[nokkel], enLocale[nokkel])
        })

        expect(noklerSomMangler.flat()).toStrictEqual([])
    })

    it('Bokmål har alle de samme tekstnøklene som engelsk', () => {
        const noklerSomMangler = Object.keys(nbLocale).map((nokkel) => {
            return inneholderSammeNoekler(enLocale[nokkel], nbLocale[nokkel])
        })

        expect(noklerSomMangler.flat()).toStrictEqual([])
    })

    it('Bokmål har ingen tomme verdier', () => {
        Object.keys(nbLocale).forEach((nokkel) => {
            expect(finnesTommeVerdier(nbLocale[nokkel])).toBeFalsy()
        })

    })

    it('Nynorsk har ingen tomme verdier', () => {
      Object.keys(nnLocale).forEach((nokkel) => {
        expect(finnesTommeVerdier(nnLocale[nokkel])).toBeFalsy()
      })
    })

    it('Engelsk har ingen tomme verdier', () => {
      Object.keys(enLocale).forEach((nokkel) => {
        expect(finnesTommeVerdier(enLocale[nokkel])).toBeFalsy()
      })
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
