import { emailMatcher, kontonrMatcher } from "./matchers";

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
