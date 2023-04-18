import { basePath, getById } from "../util/cy-functions";

describe("Skal fortsette og slette tidligere søknad", () => {
    it("Gå til søknad med eksisterende kladd", () => {
        cy.intercept("GET", `${basePath}/api/person/innlogget`, {fixture: "testbruker"}).as("hentInnloggetPerson");
        cy.intercept("GET", `${basePath}/api/api/kladd`, {fixture: "kladd"}).as("hentSoeknad");
        cy.visit("localhost:3000/omstillingsstoenad/soknad", {
            onBeforeLoad: (obj) => {
                Object.defineProperty(obj.navigator, "language", {value: "nb-NO"});
            },
        });
        cy.injectAxe();
        cy.wait(["@hentInnloggetPerson"]);
        cy.wait(["@hentSoeknad"]);

        cy.get("h1").contains("påbegynt søknad?");
    });

    it("Fortsett søknad skal sende deg til neste side som er klar for utfylling", () => {
        getById("fortsett_soeknad").click();
        cy.url().should("include", "steg/om-deg-og-avdoed");
    })

    it("Start på nytt skal sende deg til startsiden og slette state", () => {
        cy.intercept("GET", `${basePath}/api/person/innlogget`, {fixture: "testbruker"}).as("hentInnloggetPerson");
        cy.intercept("GET", `${basePath}/api/api/kladd`, {fixture: "kladd"}).as("hentSoeknad");
        cy.intercept("DELETE", `${basePath}/api/api/kladd`, {}).as("slettSoeknad");

        cy.reload();

        getById("start_paa_nytt").click();
        cy.get(':checkbox').should('not.be.checked');
    })
});

