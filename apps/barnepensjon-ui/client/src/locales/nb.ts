// @ts-nocheck
// prettier-ignore
const forside = {
    'tittel': 'Søk om gjenlevendepensjon eller overgangsstønad',
    'hei': `Hei, {{navn}}`,
    'startSoeknad': 'Start søknad',
    'omYtelsene.innhold':
        'Hvis ektefellen, partneren eller samboeren din er død, kan du ha rett til gjenlevendepensjon eller overgangsstønad til gjenlevende. Du kan også ha rett til støtte hvis du tidligere har vært gift, partner eller samboer med avdøde. Vi vil vurdere om du har rett på gjenlevendepensjon eller overgangsstønad basert på din situasjon. Inntekten din avgjør hvor mye penger du kan få.',
    'omYtelsene.papirsoeknad.innhold':
        'Får du alderspensjon eller uføretrygd fra før? Da kan du søke om gjenlevendetillegg i uføretrygd eller gjenlevenderett i alderspensjon. Du må søke på',
    'omYtelsene.papirsoeknad.href':
        'https://www.nav.no/soknader/nb/person/stonader-ved-dodsfall/gjenlevende-ektefelle-partner-eller-samboer#NAV170105',
    'omYtelsene.papirsoeknad.tekst': 'papir.',
    'omYtelsene.lenkeGjenlevende.href': 'https://www.nav.no/gjenlevendepensjon',
    'omYtelsene.lenkeGjenlevende.tekst': 'Mer om gjenlevendepensjon',
    'omYtelsene.lenkeOvergangsstoenad.href': 'https://www.nav.no/overgangsstonad-gjenlevende',
    'omYtelsene.lenkeOvergangsstoenad.tekst': 'Mer om overgangsstønad',
    'barnepensjon.tittel': 'Du kan også søke om barnepensjon',
    'barnepensjon.innhold':
        'Har du felles barn under 18 år med avdøde, kan barnet/ barna ha rett til barnepensjon. Du kan både søke om gjenlevendepensjon og barnepensjon i denne søknaden.',
    'barnepensjon.href': 'https://www.nav.no/barnepensjon',
    'barnepensjon.tekst': 'Mer om barnepensjon',
    'uthentingAvInfo.tittel': 'Vi henter informasjonen vi trenger',
    'uthentingAvInfo.innhold':
        'For å kunne behandle søknaden din trenger vi informasjon om deg, avdøde, eventuelle barn og eventuell samboer.\nVi henter:',
    'uthentingAvInfo.innholdListe.li1': '<strong>Personinformasjon</strong> fra Folkeregisteret',
    'uthentingAvInfo.innholdListe.li2': '<strong>Inntektsinformasjon</strong> fra Skatteetaten',
    'uthentingAvInfo.innholdListe.li3':
        'Opplysninger om <strong>arbeidsforhold</strong> fra Arbeidsgiver- og arbeidstakerregisteret',
    'uthentingAvInfo.innholdListe.li4': 'Opplysninger om <strong>annen støtte fra NAV</strong>',
    'uthentingAvInfo.innholdListe.li5': 'Eventuelt informasjon fra <strong>utenlandske trygdemyndigheter</strong>',
    'uthentingAvInfo.infotekst':
        'Vi jobber med å forbedre denne søknaden. Inntil videre må du legge inn de fleste opplysningene manuelt.',
    'uthentingAvInfo.lenke1.href':
        'https://www.nav.no/no/nav-og-samfunn/om-nav/personvern-i-arbeids-og-velferdsetaten/personvernerklaering-for-arbeids-og-velferdsetaten',
    'uthentingAvInfo.lenke1.tekst': 'Slik behandler vi personopplysningene dine',
    'uthentingAvInfo.lenke2.href':
        'https://www.nav.no/no/nav-og-samfunn/om-nav/personvern-i-arbeids-og-velferdsetaten/personvern-og-sikkerhet-pa-nav.no#chapter-3',
    'uthentingAvInfo.lenke2.tekst': 'Om personvern og sikkerhet på nav.no',
    'samtykke.tittel': 'Vi stoler på deg',
    'samtykke.innhold':
        'Du må gi oss riktige opplysninger for at vi skal kunne behandle søknaden din. \nHvis du får penger du ikke har rett til fordi du har latt være å informere eller gitt feil opplysninger, må du vanligvis betale tilbake.\n\n',
    'samtykke.lenke.tekst': 'mine plikter på nav.no',
    'samtykke.lenke.href':
        'https://www.nav.no/no/nav-og-samfunn/om-nav/relatert-informasjon/du-har-plikt-til-a-gi-nav-riktige-opplysninger',
    'samtykke.bekreftelse': 'Jeg, {{navn}}, bekrefter at jeg vil gi riktige og fullstendige opplysninger.',
}

const velgScenarie = {
    tittel: 'Søk barnepensjon',
    ingress: 'Velg din situasjon for å gå videre med søknaden',
    'knapp.mineBarn': 'Jeg skal søke om barnepensjon for mitt/mine barn',
    'knapp.verge': 'Jeg skal søke om barnepensjon for ett eller flere barn jeg er verge til',
    'knapp.megSelv': 'Jeg er over 18 år og søker på vegne av meg selv',
    'alert.tittel': 'Søke gjenlevendepensjon og barnepensjon?',
    'alert.beskrivelse':
        'Du kan ha rettigheter som gjenlevende hvis den andre forelderen til barnet ditt dør. Da kan du søke om gjenlevendepensjon og barnepensjon i en og samme søknad.',
    'alert.beskrivelse2': 'Gå til',
    'alert.lenke.href': 'https://www.nav.no/gjenlevendepensjon/soknad/',
    'alert.lenke.tekst': 'søknad om gjenlevendepensjon og barnepensjon',
}

const omDeg = {
    tittel: 'Om deg',
}

const loggedInUserInfo = {
    advarsel: 'Hvis opplysningene vi har om deg ikke stemmer, må du endre disse hos Folkeregisteret.',
    valgfritt: 'Alle felt må fylles ut, bortsett fra de som er markert som valgfrie.',
}

const felles = {
    navn: 'Navn',
    fnrDnr: 'Fødselsnummer / d-nummer',
    adresse: 'Bostedsadresse',
    sivilstatus: 'Sivilstatus',
    statsborgerskap: 'Statsborgerskap',
    telefonnummer: 'Telefonnummer',
    telefonnummerHjelpetekst: 'Telefonnummeret er hentet fra Kontakt- og reservasjonsregisteret.',
}

const tekster = {
    forside,
    velgScenarie,
    omDeg,
    loggedInUserInfo,
    felles,
}

export default tekster
