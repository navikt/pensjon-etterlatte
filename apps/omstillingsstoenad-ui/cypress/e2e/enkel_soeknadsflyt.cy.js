import { format } from 'date-fns'
import mockSoeknad from '../../src/assets/dummy-soeknad.json'
import { a11yCheck, basePath, gaaTilNesteSide, getById, selectValue, selectValueForId } from '../util/cy-functions'

describe('Skal gå igjennom hele søknaden uten feil', () => {
    it('Skal åpne startsiden og starte en søknad', () => {
        cy.intercept('POST', `${basePath}/api/feature`, { fixture: 'featureToggles' }).as('hentFeatureToggles')
        cy.intercept('GET', `${basePath}/api/person/innlogget?soeknadType=OMSTILLINGSSTOENAD`, {
            fixture: 'testbruker',
        }).as('hentInnloggetPerson')
        cy.intercept('GET', `${basePath}/api/api/kladd`, {}).as('hentSoeknad') // Ingen kladd eksisterer
        cy.intercept('POST', `${basePath}/api/api/kladd`, {})
        cy.intercept('GET', `${basePath}/api/api/sak/oms/har-loepende-sak`, { harOMSSak: false }).as('hentSoeknad')

        cy.visit('localhost:5173/omstillingsstonad/soknad', {
            onBeforeLoad: (obj) => {
                Object.defineProperty(obj.navigator, 'language', { value: 'nb-NO' })
            },
        })
        cy.injectAxe()
        cy.wait(['@hentFeatureToggles'])
        cy.wait(['@hentInnloggetPerson'])
        cy.wait(['@hentSoeknad'])

        // Bekreft riktige opplysninger
        cy.get('[type="checkbox"]').check({ force: true })

        cy.checkA11y()

        // Start søknaden
        getById('start-soeknad').click()
    })

    it('Skal fylle ut siden "Om Deg" og gå til neste', () => {
        cy.url().should('include', 'steg/om-deg')

        // Verifiser felter og fyll ut skjema.
        const omDeg = mockSoeknad.omDeg
        cy.get('#alternativAdresse').should('not.exist')
        getById('kontaktinfo.telefonnummer').type(omDeg.kontaktinfo.telefonnummer)
        selectValue(omDeg.utbetalingsInformasjon.bankkontoType)
        getById('utbetalingsInformasjon.kontonummer').type(omDeg.utbetalingsInformasjon.kontonummer)

        a11yCheck()

        gaaTilNesteSide()
    })

    it('Skal fylle ut siden "Om den avdøde" og gå til neste', () => {
        cy.url().should('include', 'steg/om-den-avdoede')
        cy.intercept('GET', `${basePath}/api/kodeverk/alleland`, { fixture: 'land.json' }).as('alleland')
        cy.intercept('GET', `${basePath}/api/kodeverk/valutaer`, { fixture: 'valuta.json' }).as('valutaer')

        const foersteDagIAaret = '01.01.' + new Date().getFullYear()

        // Verifiser felter og fyll ut skjema.
        const omDenAvdoede = mockSoeknad.omDenAvdoede
        getById('fornavn').type(omDenAvdoede.fornavn)
        getById('etternavn').type(omDenAvdoede.etternavn)
        getById('datoForDoedsfallet').type(foersteDagIAaret)
        getById('foedselsnummer').type(omDenAvdoede.foedselsnummer)
        getById('statsborgerskap').type(omDenAvdoede.statsborgerskap).type('{downArrow}').type('{enter}')
        selectValueForId('boddEllerJobbetUtland.svar', omDenAvdoede.boddEllerJobbetUtland.svar)

        // Legg til land
        omDenAvdoede.boddEllerJobbetUtland.oppholdUtland.map((oppholdUtland, idx) => {
            const baseId = `boddEllerJobbetUtland\.oppholdUtland\[${idx}\].`

            getById(baseId + 'land')
                .type('{downArrow}')
                .type('{downArrow}')
                .type('{enter}')
            oppholdUtland.beskrivelse.map((utlandType) => selectValue(utlandType)) // Bodd/Arbeidet checkbox
            getById(baseId + 'fraDato').type(format(oppholdUtland.fraDato, 'dd.MM.yyyy'))
            getById(baseId + 'tilDato').type(format(oppholdUtland.tilDato, 'dd.MM.yyyy'))
            selectValueForId(baseId + 'medlemFolketrygd', oppholdUtland.medlemFolketrygd)
            getById(baseId + 'mottokPensjon.beloep').type(oppholdUtland.mottokPensjon.beloep)
            getById(baseId + 'mottokPensjon.valuta')
                .find('select')
                .select(oppholdUtland.mottokPensjon.valuta)
        })

        selectValueForId('doedsfallAarsak', omDenAvdoede.doedsfallAarsak)
        a11yCheck()

        gaaTilNesteSide()
    })

    it('Skal fylle ut siden "Om Deg og avdøde" og gå til neste', () => {
        cy.url().should('include', 'steg/om-deg-og-avdoed')

        // Verifiser felter og fyll ut skjema.
        const omDegOgAvdoed = mockSoeknad.omDegOgAvdoed
        selectValue(omDegOgAvdoed.forholdTilAvdoede.relasjon)
        getById('forholdTilAvdoede.datoForInngaattPartnerskap').type(
            format(omDegOgAvdoed.forholdTilAvdoede.datoForInngaattPartnerskap, 'dd.MM.yyyy')
        )
        selectValueForId('forholdTilAvdoede.fellesBarn', omDegOgAvdoed.forholdTilAvdoede.fellesBarn)

        a11yCheck()

        gaaTilNesteSide()
    })

    it('Skal fylle ut siden "Situasjonen din" og gå til neste', () => {
        cy.url().should('include', 'steg/situasjonen-din')

        // Verifiser felter og fyll ut skjema.
        const situasjonenDin = mockSoeknad.situasjonenDin

        selectValue(situasjonenDin.nySivilstatus.sivilstatus)

        selectValueForId('omsorgMinstFemti', situasjonenDin.omsorgMinstFemti)

        selectValueForId('gravidEllerNyligFoedt', situasjonenDin.gravidEllerNyligFoedt)

        selectValueForId('bosattINorge', situasjonenDin.bosattINorge)
        selectValueForId('oppholderSegIUtlandet.svar', situasjonenDin.oppholderSegIUtlandet.svar)

        a11yCheck()

        gaaTilNesteSide()
    })

    it('Skal fylle ut siden "Mer om situasjonen din" og gå til neste', () => {
        cy.url().should('include', 'steg/mer-om-situasjonen-din')
        cy.intercept('GET', `${basePath}/api/kodeverk/alleland`, { fixture: 'land.json' }).as('alleland')

        // Verifiser felter og fyll ut skjema.
        const merOmSituasjonenDin = mockSoeknad.merOmSituasjonenDin
        selectValue(merOmSituasjonenDin.jobbStatus)

        merOmSituasjonenDin.arbeidsforhold.map((arbeid, idx) => {
            const midlertidigAnsatt = idx === 0

            if (!midlertidigAnsatt) cy.get('[data-testid=legg-til-arbeidsforhold-knapp]').click()

            const baseId = `arbeidsforhold\[${idx}\].`

            getById(baseId + 'arbeidsgiver').type(arbeid.arbeidsgiver)

            selectValueForId(baseId + 'ansettelsesforhold', arbeid.ansettelsesforhold)

            if (midlertidigAnsatt) {
                getById(baseId + 'arbeidsmengde.svar')
                    .last()
                    .type(arbeid.arbeidsmengde.svar)

                getById(baseId + 'arbeidsmengde.type')
                    .find('select')
                    .select(arbeid.arbeidsmengde.type)

                selectValueForId(baseId + 'midlertidig.svar', arbeid.midlertidig.svar)

                getById(baseId + 'midlertidig.sluttdatoVelger').type(
                    format(arbeid.midlertidig.sluttdatoVelger, 'dd.MM.yyyy')
                )
            } else {
                getById(baseId + 'arbeidsmengde.svar')
                    .first()
                    .type(arbeid.arbeidsmengde.svar)
            }

            selectValueForId(
                baseId + 'forventerEndretArbeidssituasjon.svar',
                arbeid.forventerEndretArbeidssituasjon.svar
            )

            if (midlertidigAnsatt)
                getById(baseId + 'forventerEndretArbeidssituasjon.beskrivelse').type(
                    arbeid.forventerEndretArbeidssituasjon.beskrivelse
                )

            // selectValueForId(baseId + 'sagtOppEllerRedusert.svar', arbeid.sagtOppEllerRedusert.svar)
        })

        // --------------------------------------------------------------
        // Sjekk at arbeidsforhold 2 beholdes hvis man sletter den første
        cy.get('[data-testid=fjern-arbeidsforhold-knapp]').first().click()

        getById('arbeidsforhold[0].arbeidsgiver').should(
            'have.value',
            merOmSituasjonenDin.arbeidsforhold[1].arbeidsgiver
        )

        getById('arbeidsforhold[0].ansettelsesforhold')
            .find(`[value="${merOmSituasjonenDin.arbeidsforhold[1].ansettelsesforhold}"]`)
            .should('be.checked')

        getById('arbeidsforhold[0].arbeidsmengde.svar').should(
            'have.value',
            merOmSituasjonenDin.arbeidsforhold[1].arbeidsmengde.svar
        )

        getById('arbeidsforhold[0].forventerEndretArbeidssituasjon.svar')
            .find(`[value="${merOmSituasjonenDin.arbeidsforhold[1].forventerEndretArbeidssituasjon.svar}"]`)
            .should('be.checked')
        // --------------------------------------------------------------

        selectValue(merOmSituasjonenDin.utdanning.hoyesteFullfoerteUtdanning)

        a11yCheck()

        gaaTilNesteSide()
    })

    it('Skal fylle ut siden "Inntekten din" og gå til neste', () => {
        cy.url().should('include', 'steg/inntekten-din')
        cy.intercept('GET', `${basePath}/api/kodeverk/alleland`, { fixture: 'land.json' }).as('alleland')
        cy.intercept('GET', `${basePath}/api/kodeverk/valutaer`, { fixture: 'valuta.json' }).as('valutaer')

        const dagensDato = new Date()
        const oktober = 9

        // Verifiser felter og fyll ut skjema.
        const inntektenDin = mockSoeknad.inntektenDin
        inntektenDin.inntektstyper.map((inntektsType) => selectValue(inntektsType))

        // Inntekt frem til dødsfallet
        getById('inntektFremTilDoedsfallet.arbeidsinntekt').type(inntektenDin.inntektFremTilDoedsfallet.arbeidsinntekt)

        getById('inntektFremTilDoedsfallet.naeringsinntekt.inntekt').type(
            inntektenDin.inntektFremTilDoedsfallet.naeringsinntekt.inntekt
        )
        selectValueForId(
            'inntektFremTilDoedsfallet.naeringsinntekt.erNaeringsinntektOpptjentJevnt.valg',
            inntektenDin.inntektFremTilDoedsfallet.naeringsinntekt.erNaeringsinntektOpptjentJevnt.valg
        )

        getById('inntektFremTilDoedsfallet.inntektFraUtland').type(
            inntektenDin.inntektFremTilDoedsfallet.inntektFraUtland
        )

        selectValueForId(
            'inntektFremTilDoedsfallet.andreInntekter.valg',
            inntektenDin.inntektFremTilDoedsfallet.andreInntekter.valg
        )

        // Forventet inntekt i år
        getById('forventetInntektIAar.arbeidsinntekt').type(inntektenDin.forventetInntektIAar.arbeidsinntekt)

        getById('forventetInntektIAar.naeringsinntekt.inntekt').type(
            inntektenDin.forventetInntektIAar.naeringsinntekt.inntekt
        )
        selectValueForId(
            'forventetInntektIAar.naeringsinntekt.erNaeringsinntektOpptjentJevnt.valg',
            inntektenDin.forventetInntektIAar.naeringsinntekt.erNaeringsinntektOpptjentJevnt.valg
        )

        getById('forventetInntektIAar.inntektFraUtland').type(inntektenDin.forventetInntektIAar.inntektFraUtland)

        selectValueForId(
            'forventetInntektIAar.andreInntekter.valg',
            inntektenDin.forventetInntektIAar.andreInntekter.valg
        )

        selectValueForId(
            'forventetInntektIAar.noeSomKanPaavirkeInntekten.valg',
            inntektenDin.forventetInntektIAar.noeSomKanPaavirkeInntekten.valg
        )

        // Forventet inntekt til neste år
        if (dagensDato.getMonth() >= oktober) {
            getById('forventetInntektTilNesteAar.arbeidsinntekt').type(
                inntektenDin.forventetInntektTilNesteAar.arbeidsinntekt
            )

            getById('forventetInntektTilNesteAar.naeringsinntekt.inntekt').type(
                inntektenDin.forventetInntektTilNesteAar.naeringsinntekt.inntekt
            )
            selectValueForId(
                'forventetInntektTilNesteAar.naeringsinntekt.erNaeringsinntektOpptjentJevnt.valg',
                inntektenDin.forventetInntektTilNesteAar.naeringsinntekt.erNaeringsinntektOpptjentJevnt.valg
            )

            getById('forventetInntektTilNesteAar.inntektFraUtland').type(
                inntektenDin.forventetInntektTilNesteAar.inntektFraUtland
            )

            selectValueForId(
                'forventetInntektTilNesteAar.andreInntekter.valg',
                inntektenDin.forventetInntektTilNesteAar.andreInntekter.valg
            )

            selectValueForId(
                'forventetInntektTilNesteAar.noeSomKanPaavirkeInntekten.valg',
                inntektenDin.forventetInntektTilNesteAar.noeSomKanPaavirkeInntekten.valg
            )
        }

        // // Lønnsinntekt
        // selectValueForId('loennsinntekt.norgeEllerUtland', 'inntekt.norge')
        //
        // getById('loennsinntekt.norge.inntektIAar.tilDoedsfall').type(
        //     inntektenDin.loennsinntekt.norge.inntektIAar.tilDoedsfall
        // )
        //
        // getById('loennsinntekt.norge.inntektIAar.aarsinntekt').type(
        //     inntektenDin.loennsinntekt.norge.inntektIAar.aarsinntekt
        // )
        //
        // if (dagensDato.getMonth() >= oktober)
        //     getById('loennsinntekt.norge.inntektNesteAar.aarsinntekt').type(
        //         inntektenDin.loennsinntekt.norge.inntektNesteAar.aarsinntekt
        //     )
        //
        // selectValueForId(
        //     'loennsinntekt.forventerEndringAvInntekt.svar',
        //     inntektenDin.loennsinntekt.forventerEndringAvInntekt.svar
        // )
        //
        // // Næringsinntekt
        // selectValueForId('naeringsinntekt.norgeEllerUtland', 'inntekt.norge')
        //
        // selectValueForId(
        //     'naeringsinntekt.norge.jevntOpptjentNaeringsinntekt.svar',
        //     inntektenDin.naeringsinntekt.norge.jevntOpptjentNaeringsinntekt.svar
        // )
        // getById('naeringsinntekt.norge.jevntOpptjentNaeringsinntekt.beskrivelse').type(
        //     inntektenDin.naeringsinntekt.norge.jevntOpptjentNaeringsinntekt.beskrivelse
        // )
        //
        // getById('naeringsinntekt.norge.inntektIAar.tilDoedsfall').type(
        //     inntektenDin.naeringsinntekt.norge.inntektIAar.tilDoedsfall
        // )
        // getById('naeringsinntekt.norge.inntektIAar.aarsinntekt').type(
        //     inntektenDin.naeringsinntekt.norge.inntektIAar.aarsinntekt
        // )
        //
        // if (dagensDato.getMonth() >= oktober)
        //     getById('naeringsinntekt.norge.inntektNesteAar.aarsinntekt').type(
        //         inntektenDin.naeringsinntekt.norge.inntektNesteAar.aarsinntekt
        //     )
        //
        // selectValueForId(
        //     'naeringsinntekt.forventerEndringAvInntekt.svar',
        //     inntektenDin.naeringsinntekt.forventerEndringAvInntekt.svar
        // )
        //
        // // Pensjon eller uføre
        // inntektenDin.pensjonEllerUfoere.pensjonstype.forEach((pensjon) => selectValue(pensjon))
        //
        // // Tjenestepensjonsordning
        // inntektenDin.pensjonEllerUfoere.tjenestepensjonsordning.type.forEach((type) => selectValue(type))
        // getById('pensjonEllerUfoere.tjenestepensjonsordning.utbetaler').type(
        //     inntektenDin.pensjonEllerUfoere.tjenestepensjonsordning.utbetaler
        // )
        //
        // // Pensjon fra utlandet
        // getById('pensjonEllerUfoere.utland.land').type('{downArrow}').type('{enter}')
        // getById('pensjonEllerUfoere.utland.type').type(inntektenDin.pensjonEllerUfoere.utland.type)
        // getById('pensjonEllerUfoere.utland.beloep').type(inntektenDin.pensjonEllerUfoere.utland.beloep)
        // getById('pensjonEllerUfoere.utland.valuta').find('select').select(inntektenDin.pensjonEllerUfoere.utland.valuta)

        // Ytelser fra Nav
        selectValue(inntektenDin.inntektViaYtelserFraNAV.ytelser)

        // Ingen eller annen inntekt
        selectValueForId('ingenInntekt.svar', inntektenDin.ingenInntekt.svar)
        getById('ingenInntekt.beloep').type(inntektenDin.ingenInntekt.beloep)
        getById('ingenInntekt.beskrivelse').type(inntektenDin.ingenInntekt.beskrivelse)

        // Andre ytelser
        selectValueForId('ytelserNAV.svar', inntektenDin.ytelserNAV.svar)
        inntektenDin.ytelserNAV.soekteYtelser.map((ytelse) => selectValueForId('ytelserNAV.soekteYtelser', ytelse))

        selectValueForId('ytelserAndre.svar', inntektenDin.ytelserAndre.svar)
        inntektenDin.ytelserAndre.soekteYtelser.map((ytelse) => selectValueForId('ytelserAndre.soekteYtelser', ytelse))

        getById('ytelserAndre.pensjonsordning').type('Statens pensjonskasse')

        a11yCheck()

        gaaTilNesteSide()
    })

    it('Skal fylle ut siden "Om barn" og gå til neste', () => {
        cy.url().should('include', 'steg/om-barn')
        cy.intercept('GET', `${basePath}/api/kodeverk/alleland`, { fixture: 'land.json' }).as('alleland')

        // Legg til barn
        mockSoeknad.opplysningerOmBarn.barn.map((barn) => {
            cy.get('[data-testid=legg-til-barn-knapp]').click()

            getById('fornavn').type(barn.fornavn)
            getById('etternavn').type(barn.etternavn)
            getById('foedselsnummer').type(barn.foedselsnummer)
            getById('statsborgerskap').type(barn.statsborgerskap).type('{downArrow}').type('{enter}')
            selectValueForId('bosattUtland.svar', barn.bosattUtland.svar)
            if (barn.foedselsnummer === '14812290208') {
                // under 18 år
                selectValueForId('harBarnetVerge.svar', barn.harBarnetVerge.svar)
                selectValueForId('barnepensjon.kontonummer.svar', barn.barnepensjon.kontonummer.svar)
            }
            getById('leggTilBarn').click()
        })

        a11yCheck()

        gaaTilNesteSide()
    })

    it('Skal verifisere at oppsummeringen er i henhold til utfyllingen', () => {
        cy.url().should('include', 'steg/oppsummering')

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
    })

    it('Skal bli sendt til kvitteringssiden ved suksessfull søknad', () => {
        cy.intercept('POST', `${basePath}/api/api/soeknad`, '13').as('postSoeknad')

        // Send inn søknad
        cy.get('[type="button"').contains('Send søknad').click()
        cy.get('[type="button"').contains('Ja, send søknad').click()

        // Verifiser søknad mottatt
        // TODO: Vil ikke lenger fungere nå som sendt data er annerledes fra state

        // Verifiser kvitteringsside
        cy.url().should('include', '/skjema/sendt')
        cy.contains('Søknaden din er sendt til oss')
    })
})
