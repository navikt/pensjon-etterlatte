import { basePath, getById } from "../util/cy-functions";

describe("Skal avbryte en soeknad", () => {
    it("Gå til søknad med eksisterende kladd", () => {
        cy.intercept("GET", `${basePath}/api/person/innlogget`, {fixture: "testbruker"}).as("hentInnloggetPerson");
        cy.intercept("GET", `${basePath}/api/api/kladd`, {fixture: "kladd"}).as("hentSoeknad");
        cy.visit("localhost:3000", {
            onBeforeLoad: (obj) => {
                Object.defineProperty(obj.navigator, "language", {value: "nb-NO"});
            },
        });
        cy.injectAxe();
        cy.wait(["@hentInnloggetPerson"]);
        cy.wait(["@hentSoeknad"]);

        getById("fortsett_soeknad").click();
        cy.url().should("include", "steg/om-deg-og-avdoed");
    });

    it("Fortsett søknad etter å ha trykket avbryt", () => {
        getById("avbryt-btn").click();

        getById("avbryt-nei-btn").click();
        cy.url().should("include", "steg/om-deg-og-avdoed");
    })

    it("Avbryt og slett søknad", () => {
        getById("avbryt-btn").click();

        cy.intercept("DELETE", `${basePath}/api/api/kladd`, {}).as("slettSoeknad");
        getById("avbryt-ja-btn").click();
        cy.url().should("include", "https://www.nav.no/no/person/pensjon/andre-pensjonsordninger/ytelser-til-gjenlevende-ektefelle");
    })
});

