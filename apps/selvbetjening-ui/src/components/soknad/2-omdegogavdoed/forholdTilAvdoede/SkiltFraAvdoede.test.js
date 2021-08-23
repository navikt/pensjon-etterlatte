import { IValg } from "../../../../typer/Spoersmaal";
import { giftMindreEnnFemtenOgDodsfallInnenfemAarEtterSkilsmisse } from "./SkiltFraAvdoede";

describe("Test av funksjon for varighet", () => {
    test("Gift i mer enn femten år", () => {
        const result = giftMindreEnnFemtenOgDodsfallInnenfemAarEtterSkilsmisse(
            new Date("1990-02-21"),
            new Date("2020-02-21"),
            new Date("2013-02-21")
        );
        expect(result).toBe(IValg.NEI);
    });
    test("Gift i mindre enn femten år og mer enn fem år mellom skillsmisse og dødsfallet", () => {
        const result = giftMindreEnnFemtenOgDodsfallInnenfemAarEtterSkilsmisse(
            new Date("2005-02-21"),
            new Date("2020-06-17"),
            new Date("2013-01-23")
        );
        expect(result).toBe(IValg.JA);
    });
    test("Gift i mindre enn femten år og mindre enn fem år mellom skillsmisse og dødsfallet", () => {
        const result = giftMindreEnnFemtenOgDodsfallInnenfemAarEtterSkilsmisse(
            new Date("2005-02-21"),
            new Date("2020-01-23"),
            new Date("2016-01-23")
        );
        expect(result).toBe(IValg.NEI);
    });
    test("Gift i mindre enn femten år og mer enn fem år mellom skillsmisse og dødsfallet", () => {
        const result = giftMindreEnnFemtenOgDodsfallInnenfemAarEtterSkilsmisse(
            new Date("2005-02-21"),
            new Date("2021-01-23"),
            new Date("2016-01-23")
        );
        expect(result).toBe(IValg.JA);
    });
});
