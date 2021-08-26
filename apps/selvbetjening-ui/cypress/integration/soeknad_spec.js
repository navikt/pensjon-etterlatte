import 'cypress-wait-until'

describe('Skal gå igjennom hele søknaden uten feil', () => {

    it('Skal åpne startsiden og starte en søknad', () => {
        cy.intercept('GET', '/api/person/innlogget', {fixture: 'testbruker'}).as('hentInnloggetPerson')
        cy.visit('localhost:3000')
        cy.wait(['@hentInnloggetPerson'])

        // Bekreft riktige opplysninger
        cy.get('[type="checkbox"]').check({force: true})

        // Start søknaden
        cy.get('[type="submit"]').click()
    })

    it('Skal fylle ut siden "Om Deg" og gå til neste', () => {
        cy.url().should('include', 'steg/om-deg')

        // Verifiser felter og fyll ut skjema.
        cy.get('#bostedsadresseBekreftet').find('[type="radio"]').first().check({force: true})
        cy.get('input[id="kontaktinfo.telefonnummer"]').type("123 45 678")
        cy.get('input[id="kontaktinfo.epost"]').type("test.epost@nav.no")
        cy.get('#oppholderSegINorge').find('[type="radio"]').first().check({force: true})
        cy.get('input[id="utbetalingsInformasjon.kontonummer"]').type("1231.23.12312")

        gaaTilNesteSide()
    })

    it('Skal fylle ut siden "Om Deg og avdøde" og gå til neste', () => {
        cy.url().should('include', 'steg/om-deg-og-avdoed')

        // Verifiser felter og fyll ut skjema.
        cy.get('input[id="avdoed.fornavn"]').type("Ola")
        cy.get('input[id="avdoed.etternavn"]').type("Nordmann")
        cy.get('input[id="avdoed.datoForDoedsfallet"]').type("111 22 333")
        cy.get('[id="avdoed.doedsfallAarsak"]').find('[type="radio"]').first().check({force: true})
        cy.get('[value="avdoede.relasjon.gift"]').check({force: true})
        cy.get('[value="nySivilstatus.ingen"]').check({force: true})
        cy.get('input[id="forholdTilAvdoede.datoForInngaattPartnerskap"]').type("01.01.2010")

        gaaTilNesteSide()
    })

    it('Skal fylle ut siden "Om den avdøde" og gå til neste', () => {
        cy.url().should('include', 'steg/om-den-avdoede')

        // Verifiser felter og fyll ut skjema.
        cy.get('input[id="foedselsnummer"]').type("11057523044")
        cy.get('input[id="statsborgerskap"]').type("Norsk")
        cy.get('[id="boddEllerJobbetUtland.svar"]').find('[value="Nei"]').check({force: true})
        cy.get('[id="selvstendigNaeringsdrivende.svar"]').find('[value="Ja"]').check({force: true})
        cy.get('input[id="selvstendigNaeringsdrivende.beskrivelse"]').type("120000")
        cy.get('[value="avdoedInntekt.arbeidstaker"]').check({force: true})
        cy.get('[id="harAvtjentMilitaerTjeneste.svar"]').find('[value="Ja"]').check({force: true})
        cy.get('input[id="harAvtjentMilitaerTjeneste.beskrivelse"]').type("1980")

        gaaTilNesteSide()
    })

    it('Skal fylle ut siden "Din situasjon" og gå til neste', () => {
        cy.url().should('include', 'steg/din-situasjon')

        // Verifiser felter og fyll ut skjema.
        cy.get('[value="jobbStatus.arbeidsledig"]').check({force: true})
        cy.get('[value="utdanning.bachelorgrad"]').check({force: true})
        cy.get('[id="andreYtelser.kravOmAnnenStonad.svar"]').find('[value="Ja"]').check({force: true})
        cy.get('input[id="andreYtelser.kravOmAnnenStonad.beskrivelse"]').type("Uføretrygd")
        cy.get('[id="andreYtelser.mottarPensjonUtland.svar"]').find('[value="Nei"]').check({force: true})

        gaaTilNesteSide()
    })

    it('Skal fylle ut siden "Om barn" og gå til neste', () => {
        cy.url().should('include', 'steg/om-barn')

        // Legg til barn
        cy.get('.infokort-wrapper').find('[type="button"]').click()
        cy.get('input[id="fornavn"]').type("Per")
        cy.get('input[id="etternavn"]').type("Nordmann")
        cy.get('input[id="foedselsnummer"]').type("11057523044")
        cy.get('input[id="statsborgerskap"]').type("Norsk")
        cy.get('[id="bosattUtland.svar"]').find('[value="Nei"]').check({force: true})
        cy.get('[value="barnRelasjon.fellesbarnMedAvdoede"]').check({force: true})
        cy.get('[id="leggTilBarn"]').click()

        cy.get('[value="gravidEllerNyligFoedt.ingen"]').check({force: true})

        gaaTilNesteSide()
    })

    it('Skal verifisere at oppsummeringen er i henhold til utfyllingen', () => {
        cy.url().should('include', 'steg/oppsummering')

        // Verifiser Om deg
        cy.get('[id="omDeg.bostedsadresseBekreftet"]').contains("Ja")
        cy.get('[id="omDeg.kontaktinfo.telefonnummer"]').contains("123 45 678")
        cy.get('[id="omDeg.kontaktinfo.epost"]').contains("test.epost@nav.no")
        cy.get('[id="omDeg.oppholderSegINorge"]').contains("Ja")
        cy.get('[id="omDeg.utbetalingsInformasjon.kontonummer"]').contains("1231.23.12312")

        // Verifiser Om deg og avdøde
        cy.get('[id="omDegOgAvdoed.avdoed.fornavn"]').contains("Ola")
        cy.get('[id="omDegOgAvdoed.avdoed.etternavn"]').contains("Nordmann")
        cy.get('[id="omDegOgAvdoed.avdoed.datoForDoedsfallet"]').contains("11.08.2021")
        cy.get('[id="omDegOgAvdoed.avdoed.doedsfallAarsak"]').contains("Ja")
        cy.get('[id="omDegOgAvdoed.forholdTilAvdoede.relasjon"]').contains("Gift")
        cy.get('[id="omDegOgAvdoed.forholdTilAvdoede.datoForInngaattPartnerskap"]').contains("01.01.2010")
        cy.get('[id="omDegOgAvdoed.nySivilstatus.sivilstatus"]').contains("Nei, ingen av delene")

        // Verifiser Om den avdøde
        cy.get('[id="omDenAvdoede.foedselsnummer"]').contains("11057523044")
        cy.get('[id="omDenAvdoede.statsborgerskap"]').contains("Norsk")
        cy.get('[id="omDenAvdoede.boddEllerJobbetUtland.svar"]').contains("Nei")
        cy.get('[id="omDenAvdoede.selvstendigNaeringsdrivende.svar"]').contains("Ja")
        cy.get('[id="omDenAvdoede.selvstendigNaeringsdrivende.beskrivelse"]').contains("120000")
        cy.get('[id="omDenAvdoede.haddePensjonsgivendeInntekt.svar"]').contains("Ja, inntekt som arbeidstaker")
        cy.get('[id="omDenAvdoede.harAvtjentMilitaerTjeneste.svar"]').contains("Ja")
        cy.get('[id="omDenAvdoede.harAvtjentMilitaerTjeneste.beskrivelse"]').contains("1980")

        // Verifiser Din situasjon
        cy.get('[id="dinSituasjon.jobbStatus"]').contains("Nei, er arbeidsledig")
        cy.get('[id="dinSituasjon.utdanning.hoyesteFullfoerteUtdanning"]').contains("Bachelorgrad")
        cy.get('[id="dinSituasjon.andreYtelser.kravOmAnnenStonad.svar"]').contains("Ja")
        cy.get('[id="dinSituasjon.andreYtelser.kravOmAnnenStonad.beskrivelse"]').contains("Uføretrygd")
        cy.get('[id="dinSituasjon.andreYtelser.mottarPensjonUtland.svar"]').contains("Nei")

        // Verifiser Om barn
        cy.get('[id="omBarn.fornavn"]').contains("Per")
        cy.get('[id="omBarn.etternavn"]').contains("Nordmann")
        cy.get('[id="omBarn.foedselsnummer"]').contains("11057523044")
        cy.get('[id="omBarn.statsborgerskap"]').contains("Norsk")
        cy.get('[id="omBarn.bosattUtland.svar"]').contains("Nei")
        cy.get('[id="omBarn.relasjon"]').contains("Fellesbarn med avdøde")
        cy.get('[id="omBarn.gravidEllerNyligFoedt"]').contains("Nei, ingen av delene / ikke relevant")


    })

    it('Skal bli sendt til kvitteringssiden ved suksessfull søknad', () => {
        cy.intercept('POST', '/api/api/soeknad', "13").as('postSoeknad')

        // Send inn søknad
        cy.get('[type="button"]').contains("Send søknad").click()

        // Verifiser søknad mottatt
        cy.wait(['@postSoeknad'])
        cy.url().should('include', '/soknad/sendt/13')
        cy.get('.alertstripe').should('be.visible')
        cy.contains('Takk for søknaden')
        cy.contains('Saksnummer: 13')
    })
})

let gaaTilNesteSide = () => cy.get('.knapp--hoved').click()
