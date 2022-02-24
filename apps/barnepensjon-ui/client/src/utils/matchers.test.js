import { kontonrMatcher, telefonnrMatcher } from "./matchers";

describe("Verifiser at kontonummer-matcher fungerer som tiltenkt", () => {
    it("Skal matche på korrekte kontonummer", () => {
        const validKontonummer = [
            "1234.56.12345",
            "9999.99.99999",
            "0000.00.00000"
        ];

        validKontonummer.forEach(kontonummer => {
            expect(kontonummer).toMatch(kontonrMatcher)
        });
    })

    it("Skal ikke matche på ugyldige kontonummer", () => {
        const invalidKontonummer = [
            "1234.1.12345",
            "1234.56.abcde",
            "12345",
            "12345.12",
            "12345.12.12345",
            "1234.12.1234",
        ]

        invalidKontonummer.forEach(kontonummer => {
            expect(kontonummer).not.toMatch(kontonrMatcher)
        });
    })
})

describe("Verifiser at telefonnummer-matcher fungerer som tiltenkt", () => {
    it("Skal matche på korrekte telefonnummer", () => {
        const validTelefonnr = [
            // Diverse norske
            "+47 999 888 77",
            "+4799988877",
            "0047 999 888 77",
            "004799988877",
            "123 45 678",
            "100 00 000",
            "999 99 999",
            // USA
            "+1 (555) 555-1234",
            "001 (555) 555-1234",
            // Sverige
            "999 888 777",
            "999888777",
            "+46 999 888 777",
            "+46999888777",
            "0046 999 888 777",
            "0046999888777",
        ];

        validTelefonnr.forEach(telefonnummer => {
            expect(telefonnummer).toMatch(telefonnrMatcher);
        });
    })

    it("Skal ikke matche på ugyldige input", () => {
        const invalidTelefonnr = ["123.45.678", "123 45 abc", "ren tekst", "", "    "];

        invalidTelefonnr.forEach(telefonnummer => {
            expect(telefonnummer).not.toMatch(telefonnrMatcher);
        });
    })
})
