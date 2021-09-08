import { antallAarMellom, erDato, ugyldigPeriodeFraSamlivsbruddTilDoedsfall } from "./dato";

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

describe("Funksjon fraDato fungerer som forventet", () => {
    it("Standard ISO er gyldig", () => {
        const isoDate = "2021-07-12T07:53:21.107Z"

        expect(erDato(isoDate)).toBeTruthy();

        const dato = new Date(isoDate);

        expect(dato.getDate()).toBe(12)
        expect(dato.getMonth()).toBe(6) // juli
        expect(dato.getFullYear()).toBe(2021)
    })

    it("Forenklet format er gyldig", () => {
        const forenkletDato = "2021-07-12"

        expect(erDato(forenkletDato)).toBeTruthy();

        const dato = new Date(forenkletDato);

        expect(dato.getDate()).toBe(12)
        expect(dato.getMonth()).toBe(6) // juli
        expect(dato.getFullYear()).toBe(2021)
    })

    it("Måned som ord format er gyldig", () => {
        const datoString = "2. mars 2020"

        expect(erDato(datoString)).toBeTruthy();

        const dato = new Date(datoString);

        expect(dato.getDate()).toBe(2)
        expect(dato.getMonth()).toBe(2) // mars
        expect(dato.getFullYear()).toBe(2020)
    })

    it("undefined er ikke gyldig", () => {
        expect(erDato(undefined)).toBeFalsy();
    })

    it("tilfeldig streng er ikke gyldig", () => {
        expect(erDato("første i syvende")).toBeFalsy();
    })

    it("tilfeldige tall er ikke gyldig", () => {
        expect(erDato("1531531908")).toBeFalsy();
    })

    it("Skal hente antall år i mellom to datoer", () => {
        expect(antallAarMellom("2000-01-01", "2015-01-01")).toBe(15)
        expect(antallAarMellom("2000-01-01", "2000-12-01")).toBe(0)
        expect(antallAarMellom("2000-01-01", "2010-12-01")).toBe(10)
        expect(antallAarMellom("2000-12-01", "2005-01-01")).toBe(4)
    })
})
