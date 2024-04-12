import { basePath, getById } from "../util/cy-functions";

describe("Skal avbryte en soeknad",() => {
    const startSoeknad = () => {
        // Gå til søknad med eksisterende kladd
        cy.intercept("GET", `${basePath}/api/person/innlogget?soeknadType=BARNEPENSJON`, {fixture: "testbruker"}).as("hentInnloggetPerson");
        cy.intercept("GET", `${basePath}/api/api/kladd`, {fixture: "kladd"}).as("hentSoeknad");

        cy.visit("localhost:3000/omstillingsstonad/soknad", {
            onBeforeLoad: (obj) => {
                Object.defineProperty(obj.navigator, "language", {value: "nb-NO"});
            },
        });
        cy.injectAxe();
        cy.wait(["@hentInnloggetPerson"]);
        cy.wait(["@hentSoeknad"]);

        getById("fortsett_soeknad").click();
        cy.url().should("include", "steg/om-den-avdoede");
    }

    it("Fortsett søknad etter å ha trykket avbryt", () => {
        startSoeknad()

        getById("avbryt-btn").click();

        getById("avbryt-nei-btn").click();
        cy.url().should("include", "steg/om-den-avdoede");
    })

    it("Avbryt og fortsett senere", () => {
        getById("avbryt-btn").click();

        getById("avbryt-ja-btn").click();
        cy.url().should("include", "https://www.nav.no/omstillingsstonad");
    })

    it("Avbryt og slett søknad", () => {
        Cypress.on('uncaught:exception', () => { return false })
        startSoeknad()

        getById("avbryt-btn").click();

        cy.intercept("DELETE", `${basePath}/api/api/kladd`, {}).as("slettSoeknad");
        getById("slett-soeknad").click();
        cy.wait(["@slettSoeknad"]); // Verifiser at slett kladd blir kalt
        cy.url().should("include", "https://www.nav.no/omstillingsstonad");
    })

});

