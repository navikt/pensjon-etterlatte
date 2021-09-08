import { emailMatcher, kontonrMatcher, telefonnrMatcher } from "./matchers";

describe("Verifiser at epost-matcher fungerer som tiltenkt", () => {
    it("Skal matche på korrekte epost-adresser", () => {
        const validEmails = [
            "ola.nordmann@nav.no",
            "ola@nav.no",
            "ola@test.lang.no",
            "ola-nordmann@test-lang.no"
        ]

        validEmails.forEach(email =>
                expect(emailMatcher.test(email)).toBe(true)
        )
    })

    it("Skal ikke matche på ugyldige epost-adresser", () => {
        const invalidEmails = [
            ".ola@nav.no",
            "ola,nordmann@nav.no",
            "ola@@nav.no",
            "ola@nav_test.no",
            "ola..nordmann@nav.no",
            "ola.nordmann.@nav.no",
            "ola nordmann@nav.no"
            // Følgende adresser er egentlig ugyldige men fanges ikke opp av denne regex-en.
            // "ola#nordmann@nav.no",
            // "ola-@nav.no",
        ]

        invalidEmails.forEach(email =>
                expect(emailMatcher.test(email)).toBe(false)
        )
    })
})

describe("Verifiser at kontonummer-matcher fungerer som tiltenkt", () => {
    it("Skal matche på korrekte kontonummer", () => {
        const validKontonummer = ["1234.56.12345", "9999.99.99999"]

        validKontonummer.forEach(kontonummer =>
                expect(kontonrMatcher.test(kontonummer)).toBe(true)
        )
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

        invalidKontonummer.forEach(kontonummer =>
                expect(kontonrMatcher.test(kontonummer)).toBe(false)
        )
    })
})

describe("Verifiser at telefonnummer-matcher fungerer som tiltenkt", () => {
    it("Skal matche på korrekte telefonnummer", () => {
        const validTelefonnr = ["123 45 678", "100 00 000", "999 99 999"]

        validTelefonnr.forEach(telefonnummer =>
                expect(telefonnrMatcher.test(telefonnummer)).toBe(true)
        )
    })

    it("Skal ikke matche på ugyldige input", () => {
        const invalidTelefonnr = ["12345678", "123.45.678", "123", "123 45 abc", "123 45 67", "000 00 000"]

        invalidTelefonnr.forEach(telefonnummer =>
                expect(telefonnrMatcher.test(telefonnummer)).toBe(false)
        )
    })
})
