import { StegLabelKey, StegPath, MuligeSteg } from "./steg";
import nbLocale from "../assets/locales/nb.json"

test("Skal være 8 steg", () => {
    expect(MuligeSteg.length).toBe(6);
    expect(Object.values(StegLabelKey).length).toBe(6);
    expect(Object.values(StegPath).length).toBe(6);
});

test("Det finnes en bokmål locale for hver label", () => {
    const stegLocale = nbLocale["steg"];
    const labels = Object.values(StegLabelKey);

    expect(labels.length).toBe(6);

    labels.forEach((label) => {
        expect(stegLocale).toHaveProperty(label);
    });
});

describe("StegContext", () => {
    it("skal teste at reducer tilbakestiller steg", () => {
        const result = reducer(
            { aktivtSteg: "din-situasjon", steg: MuligeSteg },
            {
                type: "TILBAKESTILL",
            }
        );
        expect(result.aktivtSteg).toEqual("om-deg");
    });

    it("skal teste at reducer oppdaterer neste steg", () => {
        const result = reducer(
            { aktivtSteg: "om-deg", steg: MuligeSteg },
            {
                type: "NESTE",
            }
        );
        expect(result.aktivtSteg).toEqual("om-deg-og-avdoed");
    });

    it("skal teste at reducer oppdaterer forrige steg", () => {
        const result = reducer(
            { aktivtSteg: "om-deg-og-avdoed", steg: MuligeSteg },
            {
                type: "FORRIGE",
            }
        );
        expect(result.aktivtSteg).toEqual("om-deg");
    });

    it("skal teste at reducer setter angitt steg", () => {
        const result = reducer(
            { aktivtSteg: "om-deg-og-avdoed", steg: MuligeSteg },
            {
                type: "SETT_STEG",
                payload: "din-situasjon",
            }
        );
        expect(result.aktivtSteg).toEqual("din-situasjon");
    });

    it("skal teste at reducer uansett returnerer en state", () => {
        const result = reducer(
            { aktivtSteg: "om-deg-og-avdoed", steg: MuligeSteg },
            {
                type: "TULL_FOR_TEST",
            }
        );
        expect(result.aktivtSteg).toEqual("om-deg-og-avdoed");
    });
});
