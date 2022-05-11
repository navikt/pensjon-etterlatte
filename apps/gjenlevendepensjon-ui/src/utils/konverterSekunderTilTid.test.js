import { konverterSekunderTilTid } from "./konverterSekunderTilTid";

describe("Test at sekunder blir korrekt koneverter til timer, minutter og sekunder", () => {
    it("Skal gi korrekt konvertering", () => {
        expect(konverterSekunderTilTid(0)).toStrictEqual({ timer: 0, minutter: 0, sekunder: 0 });
        expect(konverterSekunderTilTid(59)).toStrictEqual({ timer: 0, minutter: 0, sekunder: 59 });
        expect(konverterSekunderTilTid(60)).toStrictEqual({ timer: 0, minutter: 1, sekunder: 0 });
        expect(konverterSekunderTilTid(120)).toStrictEqual({ timer: 0, minutter: 2, sekunder: 0 });
        expect(konverterSekunderTilTid(123)).toStrictEqual({ timer: 0, minutter: 2, sekunder: 3 });
        expect(konverterSekunderTilTid(3600)).toStrictEqual({ timer: 1, minutter: 0, sekunder: 0 });
        expect(konverterSekunderTilTid(3601)).toStrictEqual({ timer: 1, minutter: 0, sekunder: 1 });
        expect(konverterSekunderTilTid(3661)).toStrictEqual({ timer: 1, minutter: 1, sekunder: 1 });
    });

    it("Skal ikke konvertere string", () => {
        expect(konverterSekunderTilTid("test")).toStrictEqual({ timer: NaN, minutter: NaN, sekunder: NaN });
    });
});
