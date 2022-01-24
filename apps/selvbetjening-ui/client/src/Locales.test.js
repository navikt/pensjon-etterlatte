import nbLocale from './locales/nb.json';
import nnLocale from './locales/nn.json';
import enLocale from './locales/en.json';
import { isEmpty } from "lodash";


describe("Json objekter", () => {
    it("Nynorsk har alle de samme tekstnøklene som bokmål", () => {
        expect(sammenlignSpraakNoekler(nbLocale, nnLocale)).toEqual(expect.stringMatching("Alle nøkler finnes"))
    })

    it("Bokmål har alle de samme tekstnøklene som nynorsk", () => {
        expect(sammenlignSpraakNoekler(nnLocale, nbLocale)).toEqual(expect.stringMatching("Alle nøkler finnes"))
    })

    it("Engelsk har alle de samme tekstnøklene som bokmål", () => {
        expect(sammenlignSpraakNoekler(nbLocale, enLocale)).toEqual(expect.stringMatching("Alle nøkler finnes"))
    })

    it("Bokmål har ingen tomme verdier", () => {
        expect(finnTommeVerdier(nbLocale)).toEqual(expect.stringMatching("Ingen tomme verdier"))
    })

    it("Nynorsk har ingen tomme verdier", () => {
        expect(finnTommeVerdier(nnLocale)).toEqual(expect.stringMatching("Ingen tomme verdier"))
    })

    it("Engelsk har ingen tomme verdier", () => {
        expect(finnTommeVerdier(enLocale)).toEqual(expect.stringMatching("Ingen tomme verdier"))
    })

    function finnTommeVerdier(obj) {
        let emptyValues = [];
        return hentNoeklerTilTommeVerdier(obj)

        function hentNoeklerTilTommeVerdier(obj, keyPath) {
            for (const [key, value] of Object.entries(obj)) {
                const newKeyPath = keyPath ? keyPath + "." + key : key;

                if (typeof value !== "object") {
                    if (value === "") emptyValues.push(newKeyPath)
                } else if (typeof value === "object") {
                    hentNoeklerTilTommeVerdier(obj[key], newKeyPath)
                }
            }
            return isEmpty(emptyValues) ? "Ingen tomme verdier" : emptyValues
        }
    }

    function sammenlignSpraakNoekler(obj1, obj2) {
        let missingKeys = [];
        return finnNoeklerSomMangler(obj1, obj2)

        function finnNoeklerSomMangler(obj1, obj2, keyPath) {
            for (const [key, value] of Object.entries(obj1)) {
                const newKeyPath = keyPath ? keyPath + "." + key : key;
                const keysObj2 = Object.keys(obj2)

                if (!keysObj2.includes(key)) {
                    missingKeys.push(newKeyPath)
                }

                if (keysObj2.includes(key) && typeof value === 'object') {
                    finnNoeklerSomMangler(obj1[key], obj2[key], newKeyPath)
                }

            }
            return isEmpty(missingKeys) ? "Alle nøkler finnes" : missingKeys;
        }
    }
})
