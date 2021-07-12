import { ugyldigPeriodeFraSamlivsbruddTilDoedsfall } from "./dato";

describe("Verifiser gyldighet av periode mellom samlivsbrudd og dødsfall", () => {
    it("Mer enn fem år mellom samlivsbrudd og dødsfall", () => {
        const samlivsbrudd = new Date(2005, 0, 0)
        const doedsfall = new Date(2010, 0, 1)

        const resultat = ugyldigPeriodeFraSamlivsbruddTilDoedsfall(samlivsbrudd.toDateString(), doedsfall.toDateString());

        expect(resultat).toBe(true)
    })

    it("Mindre enn fem år mellom samlivsbrudd og dødsfall", () => {
        const samlivsbrudd = new Date(2005, 0, 0)
        const doedsfall = new Date(2009, 11, 30)

        const resultat = ugyldigPeriodeFraSamlivsbruddTilDoedsfall(samlivsbrudd.toDateString(), doedsfall.toDateString());

        expect(resultat).toBe(false)
    })

    it("Dato for samlivsbrudd mangler", () => {
        const doedsfall = new Date(2009, 11, 30)

        const resultat = ugyldigPeriodeFraSamlivsbruddTilDoedsfall(undefined, doedsfall.toDateString());

        expect(resultat).toBe(false)
    })

    it("Dato for samlivsbrudd er ugyldig", () => {
        const samlivsbrudd = "01012000"
        const doedsfall = new Date(2009, 11, 30)

        const resultat = ugyldigPeriodeFraSamlivsbruddTilDoedsfall(samlivsbrudd, doedsfall.toDateString());

        expect(resultat).toBe(false)
    })

    it("Dato for doedsfall mangler", () => {
        const samlivsbrudd = new Date(2009, 11, 30)

        const resultat = ugyldigPeriodeFraSamlivsbruddTilDoedsfall(samlivsbrudd.toDateString(), undefined);

        expect(resultat).toBe(false)
    })

    it("Dato for doedsfall er ugyldig", () => {
        const samlivsbrudd = new Date(2009, 11, 30)
        const doedsfall = "01012000"

        const resultat = ugyldigPeriodeFraSamlivsbruddTilDoedsfall(samlivsbrudd.toDateString(), doedsfall);

        expect(resultat).toBe(false)
    })
})
