import mockSoeknad from '../../src/assets/dummy-soeknad.json'
import ObjectTreeReader from "../../src/utils/ObjectTreeReader";
import i18n from "i18next";

describe('Skal gå igjennom hele søknaden uten feil', () => {

    it('Skal åpne startsiden og starte en søknad', () => {
        cy.intercept('GET', '/api/person/innlogget', {fixture: 'testbruker'}).as('hentInnloggetPerson')
        cy.intercept('GET', '/api/api/kladd', {}).as('hentSoeknad') // Ingen kladd eksisterer
        cy.intercept('POST', '/api/api/kladd', {})
        cy.visit('localhost:3000')
        cy.wait(['@hentInnloggetPerson'])
        cy.wait(['@hentSoeknad'])

        // Bekreft riktige opplysninger
        cy.get('[type="checkbox"]').check({force: true})

        // Start søknaden
        cy.get('[type="submit"]').click()
    })

    it('Skal fylle ut siden "Om Deg" og gå til neste', () => {
        cy.url().should('include', 'steg/om-deg')

        // Verifiser felter og fyll ut skjema.
        const omDeg = mockSoeknad.omDeg
        selectValueForId("bostedsadresseBekreftet", omDeg.bostedsadresseBekreftet)
        cy.get('#alternativAdresse').type(omDeg.alternativAdresse)
        getById('kontaktinfo.telefonnummer').type(omDeg.kontaktinfo.telefonnummer)
        getById('kontaktinfo.epost').type(omDeg.kontaktinfo.epost)
        selectValueForId('oppholderSegINorge', omDeg.oppholderSegINorge)
        getById('utbetalingsInformasjon.kontonummer').type(omDeg.utbetalingsInformasjon.kontonummer)

        gaaTilNesteSide()
    })

    it('Skal fylle ut siden "Om Deg og avdøde" og gå til neste', () => {
        cy.url().should('include', 'steg/om-deg-og-avdoed')

        // Verifiser felter og fyll ut skjema.
        const omDegOgAvdoed = mockSoeknad.omDegOgAvdoed
        getById("avdoed.fornavn").type(omDegOgAvdoed.avdoed.fornavn)
        getById("avdoed.etternavn").type(omDegOgAvdoed.avdoed.etternavn)
        getById("avdoed.datoForDoedsfallet").type(omDegOgAvdoed.avdoed.datoForDoedsfallet)
        selectValueForId("avdoed.doedsfallAarsak", omDegOgAvdoed.avdoed.doedsfallAarsak)
        selectValue(omDegOgAvdoed.forholdTilAvdoede.relasjon)
        selectValue(omDegOgAvdoed.nySivilstatus.sivilstatus)

        gaaTilNesteSide()
    })

    it('Skal fylle ut siden "Om den avdøde" og gå til neste', () => {
        cy.url().should('include', 'steg/om-den-avdoede')

        // Verifiser felter og fyll ut skjema.
        const omDenAvdoede = mockSoeknad.omDenAvdoede;
        getById("foedselsnummer").type(omDenAvdoede.foedselsnummer)
        getById("statsborgerskap").type(omDenAvdoede.statsborgerskap)
        selectValueForId("boddEllerJobbetUtland.svar", omDenAvdoede.boddEllerJobbetUtland.svar)

        // Legg til land
        omDenAvdoede.boddEllerJobbetUtland.oppholdUtland.map((oppholdUtland, idx) => {
            const baseId = `boddEllerJobbetUtland\.oppholdUtland\[${idx}\].`

            getById(baseId + "land").type(oppholdUtland.land)
            oppholdUtland.beskrivelse.map((utlandType) => selectValue(utlandType)) // Bodd/Arbeidet checkbox
            getById(baseId + "fraDato").type(oppholdUtland.fraDato)
            getById(baseId + "tilDato").type(oppholdUtland.tilDato)
            selectValueForId(baseId + "medlemFolketrygd", oppholdUtland.medlemFolketrygd)
            getById(baseId + "mottokPensjon.beskrivelse").type(oppholdUtland.mottokPensjon.beskrivelse)
        })

        selectValueForId("selvstendigNaeringsdrivende.svar", omDenAvdoede.selvstendigNaeringsdrivende.svar)
        getById("selvstendigNaeringsdrivende.beskrivelse").type(omDenAvdoede.selvstendigNaeringsdrivende.beskrivelse)
        selectValue(omDenAvdoede.haddePensjonsgivendeInntekt.svar)
        selectValueForId("harAvtjentMilitaerTjeneste.svar", omDenAvdoede.harAvtjentMilitaerTjeneste.svar)
        getById("harAvtjentMilitaerTjeneste.beskrivelse").type(omDenAvdoede.harAvtjentMilitaerTjeneste.beskrivelse)

        gaaTilNesteSide()
    })

    it('Skal fylle ut siden "Din situasjon" og gå til neste', () => {
        cy.url().should('include', 'steg/din-situasjon')

        // Verifiser felter og fyll ut skjema.
        const dinSituasjon = mockSoeknad.dinSituasjon
        selectValue(dinSituasjon.jobbStatus)
        selectValue(dinSituasjon.selvstendigNaeringsdrivende)
        getById("selvstendig.beskrivelse").type(dinSituasjon.selvstendig.beskrivelse)
        getById("selvstendig.startDato").type(dinSituasjon.selvstendig.startDato)
        getById("selvstendig.type").type(dinSituasjon.selvstendig.type)
        getById("selvstendig.endringIfmDoedsfall").type(dinSituasjon.selvstendig.endringIfmDoedsfall)

        const arbeid = dinSituasjon.arbeidsforhold;
        getById("arbeidsforhold.arbeidsgiver").type(arbeid.arbeidsgiver)
        getById("arbeidsforhold.startDato").type(arbeid.startDato)
        getById("arbeidsforhold.stilling").type(arbeid.stilling)
        getById("arbeidsforhold.ansettelsesforhold").find('select').select(arbeid.ansettelsesforhold)
        getById("arbeidsforhold.stillingsprosent").type(arbeid.stillingsprosent)
        selectValueForId("arbeidsforhold.forventerEndretInntekt.svar", arbeid.forventerEndretInntekt.svar)
        getById("arbeidsforhold.forventerEndretInntekt.beskrivelse").type(arbeid.forventerEndretInntekt.beskrivelse)

        selectValue(dinSituasjon.utdanning.hoyesteFullfoerteUtdanning)

        const kravOmAnnenStonad = dinSituasjon.andreYtelser.kravOmAnnenStonad;
        selectValueForId("andreYtelser.kravOmAnnenStonad.svar", kravOmAnnenStonad.svar)
        getById("andreYtelser.kravOmAnnenStonad.beskrivelse").type(kravOmAnnenStonad.beskrivelse)

        const mottarPensjonUtland = dinSituasjon.andreYtelser.mottarPensjonUtland;
        selectValueForId("andreYtelser.mottarPensjonUtland.svar", mottarPensjonUtland.svar)
        getById("andreYtelser.mottarPensjonUtland.hvaSlagsPensjon").type(mottarPensjonUtland.hvaSlagsPensjon)
        getById("andreYtelser.mottarPensjonUtland.fraHvilketLand").type(mottarPensjonUtland.fraHvilketLand)
        getById("andreYtelser.mottarPensjonUtland.bruttobeloepPrAar").type(mottarPensjonUtland.bruttobeloepPrAar)

        gaaTilNesteSide()
    })

    it('Skal fylle ut siden "Om barn" og gå til neste', () => {
        cy.url().should('include', 'steg/om-barn')

        // Legg til barn
        mockSoeknad.opplysningerOmBarn.barn.map(barn => {
            cy.get('.infokort-wrapper').find('[type="button"]').click()

            getById("fornavn").type(barn.fornavn)
            getById("etternavn").type(barn.etternavn)
            getById("foedselsnummer").type(barn.foedselsnummer)
            getById("statsborgerskap").type(barn.statsborgerskap)
            selectValueForId("bosattUtland.svar", barn.bosattUtland.svar)
            selectValue("barnRelasjon.fellesbarnMedAvdoede")
            getById("leggTilBarn").click()
        })

        selectValue(mockSoeknad.opplysningerOmBarn.gravidEllerNyligFoedt)

        gaaTilNesteSide()
    })

    it('Skal verifisere at oppsummeringen er i henhold til utfyllingen', () => {
        cy.url().should('include', 'steg/oppsummering')

        i18n.language = "nb"
        const tekster = new ObjectTreeReader(i18n).traverse(mockSoeknad)
        tekster.filter(tekst => !["harSamtykket", "sistLagretDato", "klarForLagring"].includes(tekst.key))
                // ToDo: Burde også sjekke at innhold er korrekt, men sliter med å få oversatt verdiene.
                .map(tekst => getById(tekst.key))
    })

    it('Skal bli sendt til kvitteringssiden ved suksessfull søknad', () => {
        cy.intercept('POST', '/api/api/soeknad', "13").as('postSoeknad')

        // Send inn søknad
        cy.get('[type="button"').contains("Send søknad").click()

        // Verifiser søknad mottatt
        cy.wait(['@postSoeknad']).then(xhr => {
            // Verifiser at innholdet i requesten består av dataen vi har populert skjema med.
            sammenlignRequestMedInputdata(xhr.request.body)
        })

        // Verifiser kvitteringsside
        cy.url().should('include', '/soknad/sendt')
        cy.get('.alertstripe').should('be.visible')
        cy.contains('Takk for søknaden')
    })
})

const sammenlignRequestMedInputdata = (request) => {
    // todo: Fjern datofelter fra sammenligning frem til en løsning for tidssoneproblematikk er klar...
    [mockSoeknad, request].forEach(soeknad => {
        soeknad.sistLagretDato = undefined
        soeknad.omDegOgAvdoed.avdoed.datoForDoedsfallet = undefined
        soeknad.omDenAvdoede.boddEllerJobbetUtland.oppholdUtland.forEach(oppholdUtland => {
            oppholdUtland.fraDato = undefined
            oppholdUtland.tilDato = undefined
        })
        soeknad.dinSituasjon.selvstendig.startDato = undefined
        soeknad.dinSituasjon.arbeidsforhold.startDato = undefined

    })
    expect(request).to.deep.equal(mockSoeknad)
}

const gaaTilNesteSide = () => cy.get('.knapp--hoved').click()
const getById = (id) => cy.get(`[id="${id}"]`)
const selectValue = (value) => cy.get(`[value="${value}"]`).check({force: true})
const selectValueForId = (id, value) => getById(id).find(`[value="${value}"]`).check({force: true})
