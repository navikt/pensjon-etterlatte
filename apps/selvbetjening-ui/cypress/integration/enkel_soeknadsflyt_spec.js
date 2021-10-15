import mockSoeknad from "../../src/assets/dummy-soeknad.json";
import { IValg } from "../../src/typer/Spoersmaal";
import { gaaTilNesteSide, getById, selectValue, selectValueForId } from "../util/cy-functions";

describe("Skal gå igjennom hele søknaden uten feil", () => {
    it("Skal åpne startsiden og starte en søknad", () => {
        cy.intercept("GET", "/api/person/innlogget", { fixture: "testbruker" }).as("hentInnloggetPerson");
        cy.intercept("GET", "/api/api/kladd", {}).as("hentSoeknad"); // Ingen kladd eksisterer
        cy.intercept("POST", "/api/api/kladd", {});
        cy.visit("localhost:3000", {
            onBeforeLoad: (obj) => {
                Object.defineProperty(obj.navigator, "language", { value: "nb-NO" });
            },
        });
        cy.injectAxe();
        cy.wait(["@hentInnloggetPerson"]);
        cy.wait(["@hentSoeknad"]);

        cy.set;
        // Bekreft riktige opplysninger
        cy.get('[type="checkbox"]').check({ force: true });

        cy.checkA11y();

        // Start søknaden
        cy.get('[type="button"]').click();
    });

    it('Skal fylle ut siden "Om Deg" og gå til neste', () => {
        cy.url().should("include", "steg/om-deg");

        // Verifiser felter og fyll ut skjema.
        const omDeg = mockSoeknad.omDeg;
        selectValueForId("bostedsadresseBekreftet", omDeg.bostedsadresseBekreftet);
        cy.get("#alternativAdresse").type(omDeg.alternativAdresse);
        getById("kontaktinfo.telefonnummer").type(omDeg.kontaktinfo.telefonnummer);
        getById("kontaktinfo.epost").type(omDeg.kontaktinfo.epost);
        selectValueForId("oppholderSegINorge", omDeg.oppholderSegINorge);
        getById("utbetalingsInformasjon.kontonummer").type(omDeg.utbetalingsInformasjon.kontonummer);

        cy.checkA11y();

        gaaTilNesteSide();
    });

    it('Skal fylle ut siden "Om Deg og avdøde" og gå til neste', () => {
        cy.url().should("include", "steg/om-deg-og-avdoed");

        // Verifiser felter og fyll ut skjema.
        const omDegOgAvdoed = mockSoeknad.omDegOgAvdoed;
        getById("avdoed.fornavn").type(omDegOgAvdoed.avdoed.fornavn);
        getById("avdoed.etternavn").type(omDegOgAvdoed.avdoed.etternavn);
        getById("avdoed.datoForDoedsfallet").type(omDegOgAvdoed.avdoed.datoForDoedsfallet);
        selectValue(omDegOgAvdoed.forholdTilAvdoede.relasjon);
        getById("forholdTilAvdoede.datoForInngaattPartnerskap").type(
            omDegOgAvdoed.forholdTilAvdoede.datoForInngaattPartnerskap
        );
        selectValue(omDegOgAvdoed.nySivilstatus.sivilstatus);

        cy.checkA11y();

        gaaTilNesteSide();
    });

    it('Skal fylle ut siden "Om den avdøde" og gå til neste', () => {
        cy.url().should("include", "steg/om-den-avdoede");

        // Verifiser felter og fyll ut skjema.
        const omDenAvdoede = mockSoeknad.omDenAvdoede;
        getById("foedselsnummer").type(omDenAvdoede.foedselsnummer);
        getById("statsborgerskap").type(omDenAvdoede.statsborgerskap);
        selectValueForId("boddEllerJobbetUtland.svar", omDenAvdoede.boddEllerJobbetUtland.svar);

        // Legg til land
        omDenAvdoede.boddEllerJobbetUtland.oppholdUtland.map((oppholdUtland, idx) => {
            const baseId = `boddEllerJobbetUtland\.oppholdUtland\[${idx}\].`;

            getById(baseId + "land").type(oppholdUtland.land);
            oppholdUtland.beskrivelse.map((utlandType) => selectValue(utlandType)); // Bodd/Arbeidet checkbox
            getById(baseId + "fraDato").type(oppholdUtland.fraDato);
            getById(baseId + "tilDato").type(oppholdUtland.tilDato);
            selectValueForId(baseId + "medlemFolketrygd", oppholdUtland.medlemFolketrygd);
            getById(baseId + "mottokPensjon.beskrivelse").type(oppholdUtland.mottokPensjon.beskrivelse);
        });

        selectValueForId("selvstendigNaeringsdrivende.svar", omDenAvdoede.selvstendigNaeringsdrivende.svar);
        getById("selvstendigNaeringsdrivende.beskrivelse").type(omDenAvdoede.selvstendigNaeringsdrivende.beskrivelse);
        selectValueForId("haddePensjonsgivendeInntekt.svar", omDenAvdoede.haddePensjonsgivendeInntekt.svar);
        selectValueForId("doedsfallAarsak", omDenAvdoede.doedsfallAarsak);
        selectValueForId("harAvtjentMilitaerTjeneste.svar", omDenAvdoede.harAvtjentMilitaerTjeneste.svar);
        getById("harAvtjentMilitaerTjeneste.beskrivelse").type(omDenAvdoede.harAvtjentMilitaerTjeneste.beskrivelse);

        cy.checkA11y();

        gaaTilNesteSide();
    });

    it('Skal fylle ut siden "Din situasjon" og gå til neste', () => {
        cy.url().should("include", "steg/din-situasjon");

        // Verifiser felter og fyll ut skjema.
        const dinSituasjon = mockSoeknad.dinSituasjon;
        selectValue(dinSituasjon.jobbStatus);

        dinSituasjon.arbeidsforhold.map((arbeid, idx) => {
            const baseId = `arbeidsforhold\[${idx}\].`;

            getById(baseId + "arbeidsgiver").type(arbeid.arbeidsgiver);
            getById(baseId + "ansettelsesforhold")
                .find("select")
                .select(arbeid.ansettelsesforhold);
            getById(baseId + "stillingsprosent").type(arbeid.stillingsprosent);
            selectValueForId(baseId + "forventerEndretInntekt.svar", arbeid.forventerEndretInntekt.svar);
            getById(baseId + "forventerEndretInntekt.beskrivelse").type(arbeid.forventerEndretInntekt.beskrivelse);
        });

        selectValue(dinSituasjon.utdanning.hoyesteFullfoerteUtdanning);

        const kravOmAnnenStonad = dinSituasjon.andreYtelser.kravOmAnnenStonad;
        selectValueForId("andreYtelser.kravOmAnnenStonad.svar", kravOmAnnenStonad.svar);
        getById("andreYtelser.kravOmAnnenStonad.beskrivelse").type(kravOmAnnenStonad.beskrivelse);

        const annenPensjon = dinSituasjon.andreYtelser.annenPensjon;
        selectValueForId("andreYtelser.annenPensjon.svar", annenPensjon.svar);
        getById("andreYtelser.annenPensjon.beskrivelse").type(annenPensjon.beskrivelse);

        const mottarPensjonUtland = dinSituasjon.andreYtelser.mottarPensjonUtland;
        selectValueForId("andreYtelser.mottarPensjonUtland.svar", mottarPensjonUtland.svar);
        getById("andreYtelser.mottarPensjonUtland.hvaSlagsPensjon").type(mottarPensjonUtland.hvaSlagsPensjon);
        getById("andreYtelser.mottarPensjonUtland.fraHvilketLand").type(mottarPensjonUtland.fraHvilketLand);
        getById("andreYtelser.mottarPensjonUtland.bruttobeloepPrAar").type(mottarPensjonUtland.bruttobeloepPrAar);

        cy.checkA11y();

        gaaTilNesteSide();
    });

    it('Skal fylle ut siden "Om barn" og gå til neste', () => {
        cy.url().should("include", "steg/om-barn");

        // Legg til barn
        mockSoeknad.opplysningerOmBarn.barn.map((barn) => {
            cy.get(".infokort-wrapper").find('[type="button"]').click();

            getById("fornavn").type(barn.fornavn);
            getById("etternavn").type(barn.etternavn);
            getById("foedselsnummer").type(barn.foedselsnummer);
            getById("statsborgerskap").type(barn.statsborgerskap);
            selectValueForId("bosattUtland.svar", barn.bosattUtland.svar);
            selectValue("barnRelasjon.fellesbarnMedAvdoede");
            getById("leggTilBarn").click();
        });

        selectValue(IValg.JA);

        cy.checkA11y();

        gaaTilNesteSide();
    });

    it("Skal verifisere at oppsummeringen er i henhold til utfyllingen", () => {
        cy.url().should("include", "steg/oppsummering");

        /*
        i18n.language = "nb";
        const tekster = new ObjectTreeReader(i18n).traverse(mockSoeknad);
        tekster
            .filter(
                (tekst) =>
                    ![
                        "harSamtykket",
                        "sistLagretDato",
                        "klarForLagring",
                        "omDenAvdoede.boddEllerJobbetUtland.oppholdUtland.0.fraDato",
                        "omDenAvdoede.boddEllerJobbetUtland.oppholdUtland.0.tilDato",
                    ].includes(tekst.key)
            )
            // ToDo: Burde også sjekke at innhold er korrekt, men sliter med å få oversatt verdiene.
            .map((tekst) => getById(tekst.key));
        */
    });

    it("Skal bli sendt til kvitteringssiden ved suksessfull søknad", () => {
        cy.intercept("POST", "/api/api/soeknad", "13").as("postSoeknad");

        // Send inn søknad
        cy.get('[type="button"').contains("Send søknad").click();

        // Verifiser søknad mottatt
        // TODO: Vil ikke lenger fungere nå som sendt data er annerledes fra state
        /*
        cy.wait(["@postSoeknad"]).then((xhr) => {
            // Verifiser at innholdet i requesten består av dataen vi har populert skjema med.
            sammenlignRequestMedInputdata(xhr.request.body);
        });
*/

        // Verifiser kvitteringsside
        cy.url().should("include", "/skjema/sendt");
        cy.contains("Søknaden din er sendt til oss");
    });
});

// noinspection JSUnusedLocalSymbols
const sammenlignRequestMedInputdata = (request) => {
    [mockSoeknad, request].forEach((soeknad) => {
        soeknad.sistLagretDato = undefined;
        soeknad.klarForLagring = undefined;

        // todo: Fjern datofelter fra sammenligning frem til en løsning for tidssoneproblematikk er klar...
        soeknad.omDegOgAvdoed.avdoed.datoForDoedsfallet = undefined;
        soeknad.omDenAvdoede.boddEllerJobbetUtland.oppholdUtland.forEach((oppholdUtland) => {
            oppholdUtland.fraDato = undefined;
            oppholdUtland.tilDato = undefined;
        });
        soeknad.dinSituasjon.arbeidsforhold.startDato = undefined;
        soeknad.omDegOgAvdoed.forholdTilAvdoede.datoForInngaattPartnerskap = undefined;
    });

    expect(request).to.deep.equal(mockSoeknad);
};
