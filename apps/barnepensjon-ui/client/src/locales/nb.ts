// @ts-nocheck
// prettier-ignore
const frontPage = {
    'title': 'Søk om gjenlevendepensjon eller overgangsstønad',
    'hello': `Hei, {fornavn} {etternavn}`,
    'startApplication': 'Start søknad',
    'aboutTheBenefit.content':
        'Hvis ektefellen, partneren eller samboeren din er død, kan du ha rett til gjenlevendepensjon eller overgangsstønad til gjenlevende. Du kan også ha rett til støtte hvis du tidligere har vært gift, partner eller samboer med avdøde. Vi vil vurdere om du har rett på gjenlevendepensjon eller overgangsstønad basert på din situasjon. Inntekten din avgjør hvor mye penger du kan få.',
    'aboutTheBenefit.paperApplication.content':
        'Får du alderspensjon eller uføretrygd fra før? Da kan du søke om gjenlevendetillegg i uføretrygd eller gjenlevenderett i alderspensjon. Du må søke på',
    'aboutTheBenefit.paperApplication.href':
        'https://www.nav.no/soknader/nb/person/stonader-ved-dodsfall/gjenlevende-ektefelle-partner-eller-samboer#NAV170105',
    'aboutTheBenefit.paperApplication.text': 'papir.',
    'aboutTheBenefit.linkSurvivor.href': 'https://www.nav.no/gjenlevendepensjon',
    'aboutTheBenefit.linkSurvivor.text': 'Mer om gjenlevendepensjon',
    'aboutTheBenefit.linkTransitionalBenefit.href': 'https://www.nav.no/overgangsstonad-gjenlevende',
    'aboutTheBenefit.linkTransitionalBenefit.text': 'Mer om overgangsstønad',
    'childrensPension.title': 'Du kan også søke om barnepensjon',
    'childrensPension.content':
        'Har du felles barn under 18 år med avdøde, kan barnet/ barna ha rett til barnepensjon. Du kan både søke om gjenlevendepensjon og barnepensjon i denne søknaden.',
    'childrensPension.href': 'https://www.nav.no/barnepensjon',
    'childrensPension.text': 'Mer om barnepensjon',
    'retrievalOfInformation.title': 'Vi henter informasjonen vi trenger',
    'retrievalOfInformation.content':
        'For å kunne behandle søknaden din trenger vi informasjon om deg, avdøde, eventuelle barn og eventuell samboer.\nVi henter:',
    'retrievalOfInformation.contentList.li1': '<strong>Personinformasjon</strong> fra Folkeregisteret',
    'retrievalOfInformation.contentList.li2': '<strong>Inntektsinformasjon</strong> fra Skatteetaten',
    'retrievalOfInformation.contentList.li3':
        'Opplysninger om <strong>arbeidsforhold</strong> fra Arbeidsgiver- og arbeidstakerregisteret',
    'retrievalOfInformation.contentList.li4': 'Opplysninger om <strong>annen støtte fra NAV</strong>',
    'retrievalOfInformation.contentList.li5': 'Eventuelt informasjon fra <strong>utenlandske trygdemyndigheter</strong>',
    'retrievalOfInformation.infotext':
        'Vi jobber med å forbedre denne søknaden. Inntil videre må du legge inn de fleste opplysningene manuelt.',
    'retrievalOfInformation.link1.href':
        'https://www.nav.no/no/nav-og-samfunn/om-nav/personvern-i-arbeids-og-velferdsetaten/personvernerklaering-for-arbeids-og-velferdsetaten',
    'retrievalOfInformation.link1.text': 'Slik behandler vi personopplysningene dine',
    'retrievalOfInformation.link2.href':
        'https://www.nav.no/no/nav-og-samfunn/om-nav/personvern-i-arbeids-og-velferdsetaten/personvern-og-sikkerhet-pa-nav.no#chapter-3',
    'retrievalOfInformation.link2.text': 'Om personvern og sikkerhet på nav.no',
    'consent.title': 'Vi stoler på deg',
    'consent.content':
        'Du må gi oss riktige opplysninger for at vi skal kunne behandle søknaden din. \nHvis du får penger du ikke har rett til fordi du har latt være å informere eller gitt feil opplysninger, må du vanligvis betale tilbake.\n\n',
    'consent.link.text': 'mine plikter på nav.no',
    'consent.link.href':
        'https://www.nav.no/no/nav-og-samfunn/om-nav/relatert-informasjon/du-har-plikt-til-a-gi-nav-riktige-opplysninger',
    'consent.approval': 'Jeg, {fornavn} {etternavn}, bekrefter at jeg vil gi riktige og fullstendige opplysninger.',
}

const selectScenario = {
    title: 'Velg situasjon for å gå videre med søknaden',
    whoIsApplying: 'Hvem søker om barnepensjon?',
    PARENT: 'Jeg søker på vegne av mitt/mine barn',
    GUARDIAN: 'Jeg søker for ett eller flere barn jeg er verge for',
    CHILD: 'Jeg er fylt 18 år og søker på vegne av meg selv',
    parentApplicantInformation:
        'Du kan søke om barnepensjon til flere barn i denne søknaden. Du må oppgi alle søsken, uansett alder, fordi det kan ha betydning for beregningen av barnepensjon. \n\nDersom barna ikke er helsøsken, skal det benyttes en ny søknadsblankett for hvert barnekull.',
    childApplicantInformation1:
        'Hvis du er under 20 år og er under utdanning, er lærling eller praktikant, kan du søke om barnepensjon.',
    childApplicantInformation2:
        'Dersom du er under 21 år og er under utdanning, er lærling eller praktikant, kan du søke om barnepensjon dersom dødsfallet til en av foreldrene dine skyldes yrkesskade eller yrkessykdom.',
    aboutSurvivorsPensionTitle: 'Søke om gjenlevendepensjon til deg selv?',
    aboutSurvivorsPensionDescription:
        'Du kan ha rettigheter som gjenlevende hvis den andre forelderen til barnet ditt dør. Da kan du',
    aboutSurvivorsPensionLink: 'velge å søke om gjenlevendepensjon og barnepensjon i samme søknad.',
    aboutSurvivorsPensionHref: 'https://www.nav.no/gjenlevendepensjon',
    BOTH_PARENTS_DECEASED: 'Foreldreløs',
    BOTH_PARENTS_DECEASED_CHILD_APPLICANT: 'Jeg er foreldreløs',
    ONE_PARENT_DECEASED: 'En forelder er død',
}

const aboutYou = {
    title: 'Om deg',
    stayWhy:
        'Hvis du oppholder deg i et annet land enn Norge kan det avgjøre om du får gjenlevendepensjon og hvor mye du kan få.',
    addressOfResidenceConfirmed: 'Bor du på denne adressen?',
    alternativeAddress: 'Oppgi nåværende bostedsadresse',
    residesInNorway: 'Oppholder du deg for tiden i Norge?',
    countryOfResidence: 'Oppgi land',
    memberFolketrygdenAbroad: 'Er du medlem i folketrygden under opphold i et annet land enn Norge?',
    yes: 'Ja',
    no: 'Nei',
    phoneNumber: 'Telefonnummer',
}

const livingParent = {
    title: 'Om den gjenlevende',
    who: 'Oppgi informasjon om den gjenlevende forelderen.',
    address: 'Adresse',
    phoneNumber: 'Telefonnummer (valgfri)',
}

const aboutTheDeceased = {
    title: 'Om den avdøde',
    firstParentTitle: 'Om den første forelderen',
    secondParentTitle: 'Om den andre forelderen',
    singleParentTitle: 'Om den avdøde',
    who: 'Hvem er det som er død?',
    firstName: 'Fornavn',
    lastName: 'Etternavn',
    dateOfDeath: 'Når skjedde dødsfallet?',
    'abroadStays.title': 'Opphold utenfor Norge',
    'abroadStays.ingress':
        'Vi trenger å vite om avdøde har bodd eller arbeidet utenfor Norge. Dette kan både påvirke hvor mye du kan få i gjenlevendepensjon og gi deg pensjonsrettigheter fra andre land.',
    'abroadStays.hasStaysAbroad': 'Bodde eller arbeidet han eller hun i et annet land enn Norge etter fylte 16 år?',
    'staysAbroad.abroadStays.country': 'Land',
    'staysAbroad.abroadStays.type': 'Bodd og/eller arbeidet?',
    'staysAbroad.abroadStays.fromDate': 'Fra dato (valgfri)',
    'staysAbroad.abroadStays.toDate': 'Til dato (valgfri)',
    'staysAbroad.abroadStays.medlemFolketrygd': 'Var han eller hun medlem av folketrygden under oppholdet?',
    'staysAbroad.abroadStays.medlemFolketrygd.why':
        'Vi må vite om avdøde var medlem av folketrygden for å avgjøre rettigheten til barnepensjon.',
    'staysAbroad.abroadStays.pensionAmount': 'Oppgi eventuell pensjon han eller hun mottok fra dette landet (valgfri)',
    fnrDnr: 'Fødselsnummer / d-nummer',
    'fnrDnr.placeholder': '11 siffer',
    citizenship: 'Statsborgerskap',
    'selfEmplyment.title': 'Næringsinntekt',
    'selfEmplyment.ingress':
        'Vi trenger å vite om avdøde hadde inntekt som selvstendig næringsdrivende. Dette er viktig når vi skal beregne hvor mye du kan få i gjenlevendepensjon. Vi henter informasjon om andre inntekter.',
    'selfEmplyment.wasSelfEmployed': 'Var han eller hun selvstendig næringsdrivende?',
    'selfEmplyment.selfEmplymentDetails.income': 'Oppgi næringsinntekt fra kalenderåret før dødsfallet (valgfri)',
    'selfEmplyment.selfEmplymentDetails.income.placeholder': 'Samlet årsinntekt før skatt',
    'selfEmplyment.selfEmplymentDetails.incomeAtDeath': 'Hadde han eller hun næringsinntekt når dødsfallet skjedde?',
    'other.title': 'Annet',
    occupationalInjury: 'Skyldes dødsfallet yrkesskade eller yrkessykdom?',
    'occupationalInjury.why':
        'Hvis dødsfallet skyldes godkjent yrkesskade eller yrkessykdom kan det avgjøre hvor mye du kan få.',
    'militaryService.completed':
        'Har han eller hun gjennomført militær eller sivil førstegangstjeneste som varte minst 30 dager?',
    'militaryService.why': 'Dette kan gi opptjening som tas med i beregningen av barnepensjonen.',
    'militaryService.period': 'Hvilke(-t) år? (valgfri)',
    'oppholdUtlandType.BODD': 'Bodd',
    'oppholdUtlandType.ARBEIDET': 'Arbeidet',
    'btn.addCountry': '+ Legg til flere land',
    'btn.delete': 'Fjern',
}

const aboutChildren = {
    'childrensPension.applied': 'Søkt om barnepensjon',
    'childrensPension.applies': 'Søk om barnepensjon',
    'childrensPension.appliesInfo': 'Du kan søke om barnepensjon for barn under 18 år som du har felles med avdøde.',
    'childrensPension.appliesCheckbox': 'Ja, jeg søker om barnepensjon for barnet',
    'childrensPension.bankAccount.answer':
        'Skal barnepensjonen utbetales til samme kontonummer som du har oppgitt tidligere?',
    'childrensPension.bankAccount.information': 'Du kan legge til et eget kontonummer for barnet.',
    'childrensPension.bankAccount.bankAccount': 'Oppgi norsk kontonummer for utbetaling av barnepensjon',
    'childrensPension.bankAccount.placeholder': '11 siffer',
    'childrensPension.taxWithhold.answer': 'Ønsker du at vi legger inn et skattetrekk for barnepensjonen?',
    'childrensPension.taxWithhold.helpText':
        'Barnepensjon er skattepliktig, men vi trekker ikke skatt av beløpet uten at vi får beskjed om det. Hvis du har spørsmål om skatt må du ta kontakt med Skatteetaten.',
    'childrensPension.taxWithhold.trekkprosent': 'Oppgi ønsket skattetrekk',
    'childrensPension.taxWithhold.placeholder': 'i prosent, eks. 20%',
    'childrensPension.taxWithhold.info':
        'Vær oppmerksom på at frivillig skattetrekk må sendes inn på nytt hvert kalenderår.',
    'childrenRelation.fellesbarnMedAvdoede': 'Jeg og avdøde',
    'childrenRelation.avdoedesSaerkullsbarn': 'Avdøde',
    'childrenRelation.egneSaerkullsbarn': 'Jeg',
    livesIn: 'Bor i',
    'staysAbroad.answer': 'Bor barnet i et annet land enn Norge?',
    'staysAbroad.sibling.answer': 'Bor søskenet i et annet land enn Norge?',
    'staysAbroad.country': 'Land',
    'staysAbroad.address': 'Adresse i utlandet',
    dailyCare: 'Har du daglig omsorg for dette barnet?',
    lastName: 'Etternavn',
    'common.fnrPlaceholder': '11 siffer',
    'common.norway': 'Norge',
    fnr: 'Fødselsnummer / d-nummer',
    'fnr.sibling': 'Søskenets fødselsnummer / d-nummer',
    firstName: 'Fornavn',
    pregnantOrNewlyBorn: 'Venter du barn eller har du barn som ikke er registrert i folkeregisteret?',
    'childHasGuardianship.lastName': 'Etternavn (valgfri)',
    'childHasGuardianship.firstName': 'Fornavn (valgfri)',
    'childHasGuardianship.name': 'Navn på verge',
    'childHasGuardianship.answer': 'Er det oppnevnt en verge for barnet?',
    'childHasGuardianship.fnr': 'Fødselsnummer til verge (valgfri)',
    'childHasGuardianship.fnrPlaceholder': '11 siffer',
    information:
        'Dersom du har eller har hatt barn kan det påvirke retten din til gjenlevendepensjon. Derfor må du oppgi alle barn, uavhengig av hvor gamle de er. Dette gjelder barn du har felles med avdøde, avdødes egne barn, og dine egne barn. \n\n Hvis du har felles barn under 18 år med avdøde kan du også søke om barnepensjon her. Barn over 18 år må søke selv.',
    'information.sibling': 'Her er info hvis det er søsken',
    'infoCard.residence': 'BOSTED',
    'infoCard.fnr': 'FØDSELSNUMMER',
    'infoCard.parents': 'FORELDRE TIL BARNET',
    'infoCard.citizenship': 'STATSBORGERSKAP',
    yes: 'Ja',
    'btn.removeFromApplication': 'Fjern fra søknad',
    'btn.addChild': '+ Legg til barn',
    'btn.addSibling': '+ Legg til søsken',
    'btn.cancel': 'Avbryt',
    'btn.change': 'Endre',
    'btn.save': 'Lagre',
    no: 'Nei',
    relation: 'Hvem er foreldre til barnet?',
    relationHelpText:
        'Vi må vite om dette er et barn du har felles med avdøde, avdødes eget barn, eller ditt eget barn.',
    citizenship: 'Statsborgerskap',
    title: 'Om barn',
    titleModal: 'Om barnet',
    'titleModal.sibling': 'Om søskenet',
    'title.sibling': 'Om søsken',
    voluntary: 'Dette er valgfritt',
}

const loggedInUserInfo = {
    advarsel: 'Hvis opplysningene vi har om deg ikke stemmer, må du endre disse hos Folkeregisteret.',
    valgfritt: 'Alle felt må fylles ut, bortsett fra de som er markert som valgfrie.',
}

const common = {
    firstName: 'Fornavn',
    lastName: 'Etternavn',
    name: 'Navn',
    fnrDnr: 'Fødselsnummer / d-nummer',
    'fnrDnr.placeholder': '11 siffer',
    address: 'Bostedsadresse',
    maritalStatus: 'Sivilstatus',
    citizenship: 'Statsborgerskap',
    phoneNumber: 'Telefonnummer',
    phoneNumberHelpText: 'Telefonnummeret er hentet fra Kontakt- og reservasjonsregisteret.',
    whyWeAsk: 'Hvorfor spør vi om dette',
    dateFormat: '(dd.mm.yyyy)',
    dateExample: 'eks. 01.11.2020',
    chooseCountry: 'Velg land',
    chooseLanguage: 'Velg språk',
    remove: 'Fjern',
    edit: 'Endre',
}

const paymentDetails = {
    title: 'Oppgi bankopplysninger',
    NORSK: 'Norsk',
    UTENLANDSK: 'Utenlandsk',
    bankAccount: 'Oppgi norsk kontonummer for utbetaling',
    information: 'Du kan bare ha ett kontonummer registrert hos NAV.',
    accountType: 'Ønsker du å motta utbetalingen på norsk eller utenlandsk bankkonto?',
    foreignBankName: 'Bankens navn',
    foreignBankAddress: 'Bankens fulle adresse',
    iban: 'IBAN-nummer',
    ibanHelpText: 'IBAN står for International Bank Account Number og er en internasjonal standard for kontonummer.',
    swift: 'Bankens S.W.I.F.T (BIC) adresse',
    swiftHelpText:
        'BIC står for Bank Identifier Code, og er den koden som identifiserer banken. BIC kalles også SWIFT, og er påkrevd ved betaling til en rekke land.',
}

const summary = {
    title: 'Oppsummering',
    description:
        'Les gjennom oppsummeringen av din søknad før du sender. \nHvis du trenger å gjøre endringer, kan du gå tilbake og gjøre det.',
}

const navigation = {
    sendApplication: 'Send søknad',
    backButton: 'Tilbake',
    nextButton: 'Neste',
    saveButton: 'Lagre',
    cancelButton: 'Avbryt',
    cancelApplicationTitle: 'Vil du avbryte søknaden?',
    cancelApplicationBody: 'Du kan fortsette nå eller senere. Søknaden din lagres i 72 timer.',
    continueApplicationButton: 'Nei, jeg vil fortsette',
    cancelApplicationButton: 'Ja, avbryt og fortsett senere',
    deleteApplicationButton: 'Ja, avbryt og slett søknaden',
}

const radiobuttons = {
    JA: 'Ja',
    NEI: 'Nei',
    VET_IKKE: 'Vet ikke',
}

const error = {
    title: 'For å gå videre må du rette opp i dette:',
    'abroadStays.hasStaysAbroad.required': 'Oppgi om den avdøde har bodd eller jobbet i et annet land enn Norge',
    'addressOfResidenceConfirmed.required': 'Bostedsadresse må bekreftes/avkreftes',
    'alternativeAddress.required': 'Du må oppgi nåværende bostedsadresse',
    'citizenship.required': 'Oppgi statsborgerskap',
    'countryOfResidence.required': 'Oppgi nåværende oppholdsland',
    'dateOfDeath.required': 'Oppgi når dødsfallet skjedde',
    'firstName.required': 'Oppgi fornavn',
    'fnr.required': 'Oppgi fødselsnummer',
    'fnrDnr.required': 'Oppgi fødselsnummer',
    'lastName.required': 'Oppgi etternavn',
    'memberFolketrygdenAbroad.required': 'Oppgi om du er medlem i folketrygden under opphold i et annet land enn Norge',
    'militaryService.completed.required': 'Oppgi om avdøde har gjennomført verneplikt',
    'occupationalInjury.required': 'Oppgi om dødsfallet skyldes yrkesskade eller yrkessykdom',
    'paymentDetails.bankAccount.required': 'Norsk kontonummer må fylles ut (11 siffer)',
    'paymentDetails.accountType.required': 'Du må velge mellom norsk eller utenlandsk bankkonto for utbetaling',
    'paymentDetails.foreignBankName.required': 'Navnet på den utenlandske banken må fylles ut',
    'paymentDetails.foreignBankAddress.required': 'Adressen til den utenlandske banken må fylles ut',
    'paymentDetails.iban.required': 'IBAN-nummer må fylles ut',
    'paymentDetails.swift.required': 'Bankens S.W.I.F.T (BIC) adresse må fylles ut',
    'residesInNorway.required': 'Opphold må besvares',
    'selfEmplyment.wasSelfEmployed.required': 'Oppgi om avdøde var selvstendig næringsdrivende',
    'staysAbroad.answer.required': 'Oppgi om personen er bosatt i et annet land enn Norge',
}

const pageNotFound = {
    title: 'Oi, har du gått deg vill?',
    intro: 'Denne siden finnes ikke.',
    body: 'Dersom du har klikket på en lenke på våre sider og endt opp her, kan du rapportere feilen her:',
    linkText: 'www.nav.no/tilbakemelding-feilogmangler',
    linkHref: 'http://www.nav.no/tilbakemelding-feilogmangler',
    backButton: 'Klikk her for å gå tilbake',
}

const systemUnavailable = {
    guide: 'Å nei, søknaden fungerer ikke...',
    intro: 'Det er en feil i søknaden som gjør at den dessverre ikke fungerer som den skal.',
    description:
        'Vi beklager dette og jobber med å finne ut av det så raskt som mulig. I mellomtiden er det nok lurt å ta en pause og prøve igjen senere.',
    feedback: 'Er det fortsatt feil, kan du melde fra om det på ',
    feedbackLenke: 'www.nav.no/person/kontakt-oss/nb/tilbakemeldinger/feil-og-mangler',
    feedbackHref: 'https://www.nav.no/person/kontakt-oss/nb/tilbakemeldinger/feil-og-mangler',
    moreAboutBenefits: 'Du kan lese mer om ytelser til etterlatte på',
    moreAboutBenefitsLenke: 'www.nav.no/mistet-noen',
    moreAboutBenefitsHref: 'https://www.nav.no/mistet-noen',
    retryButton: 'Prøv igjen',
}

const logOutUser = {
    btn: 'X-ikon for å lukke meldingen',
    time: 'minutter',
    info1: 'Du vil bli logget ut om',
    info2: 'Du kan sende søknad nå eller fortsette senere. \n Søknaden din lagres i 72 timer.',
}

const receipt = {
    thankYou: 'Takk for din søknad!',
    pageTitle: 'Søknaden din er sendt til oss',
    contact: 'Hvis vi mangler informasjon for å behandle søknaden din, kontakter vi deg.',
    lifeChangeTitle: 'Du må melde fra om endringer',
    lifeChangeInfo:
        'Du må melde fra med en gang det skjer viktige endringer som kan påvirke retten til og/eller utbetaling av barnepensjon. Det kan for eksempel være ved:',
    'lifeChangeList.family': 'endring i bo/familiesituasjon',
    'lifeChangeList.moving': 'flytting eller opphold i et annet land over tid',
    lifeChangeInfo2: 'Om man mottar barnepensjon etter fylte 18 år må man også gi beskjed ved:',
    'lifeChangeList2.education': 'endring i utdanningssituasjon',
    'lifeChangeList2.income': 'endring av arbeidsinntekt',
    'lifeChange.rightsInfo': 'Du kan lese mer om dine rettigheter og plikter på',
    'lifeChange.rightsInfoLinkHref': 'https://nav.no/rettogplikt',
    'lifeChange.rightsInfoLinkText': 'nav.no/rettogplikt',
    benefitsChangingTitle: 'Regelendringer på barnepensjon',
    benefitsChangingDescription1: 'Barnepensjon skal styrkes. Du kan lese mer om ',
    'benefitsChangingDescription1.link': 'de nye endringene',
    'benefitsChangingDescription1.href': 'https://www.nav.no/barnepensjon#regel',
    benefitsChangingDescription2: 'som gjelder fra tidligst 1. januar 2023.',
    viewCaseTitle: 'Sjekke status i saken?',
    viewCaseInfoContentPart1: 'Som forelder eller verge kan du ikke følge saken digitalt i Dine saker i',
    viewCaseInfoLinkHref1: 'https://www.nav.no/no/ditt-nav',
    viewCaseInfoLinkText1: 'Ditt NAV',
    viewCaseInfoContentPart2:
        'på barnet det er søkt barnepensjon for. Hvis du har spørsmål om søknaden, må du kontakt oss på telefon 55 55 33 34.',
    viewCaseInfoContentPart3: '',
    viewCaseInfoLinkHref2: 'https://tjenester.nav.no/saksoversikt',
    viewCaseInfoContent3: 'Barn som søker selv kan følge saken i ',
    viewCaseInfoLinkHref3: 'https://tjenester.nav.no/saksoversikt',
    viewCaseInfoLinkText3: 'Dine saker på Ditt NAV',
    viewCaseInfoLinkHref4: 'https://www.nav.no/saksbehandlingstider',
    viewCaseInfoLinkText4: 'Her kan du sjekke forventet saksbehandlingstid.',
    closeApplicationButton: 'Avslutt',
}

const aboutParents = {
    title: 'Om foreldrene',
    firstParent: 'Forelder 1',
    secondParent: 'Forelder 2',
    survivingParent: 'Gjenlevende forelder',
    deceasedParent: 'Avdød forelder',
    addParentBtn: 'Legg til',
    addSurvivingParentBtn: 'Legg til gjenlevende forelder',
    addDeceasedParentBtn: 'Legg til avdød forelder',
    addFirstParentBtn: 'Legg til forelder 1',
    addSecondParentBtn: 'Legg til forelder 2',
    bothParentsRequired: 'Du må legge til opplysninger om begge foreldre for å fortsette søknaden.',
}

const yourSituation = {
    title: 'Din situasjon',
    whatsYourSituation: 'Hva er din situasjon?',
    timeUsedForEducation: 'Hvor mye tid bruker du på utdanningen?',
    whyDoYouApply: 'Hvorfor søker du barnepensjon etter fyllte 18 år',
    doYouHaveIncome: 'Har du lønnsinntekt?',
    BELOW50: 'Under 50%',
    OVER50: '50% eller mer',
    ORPHAN: 'Jeg er foreldreløs',
    OCCUPATIONAL_INJURY: 'Den avdøde moren eller faren min døde som følge av en godkjent yrkesskade',
    EDUCATION: 'Jeg tar utdanning',
    APPRENTICE: 'Jeg er lærling',
    INTERNSHIP: 'Jeg har praksisplass eller er praktikant',
}

const texts = {
    aboutChildren,
    aboutTheDeceased,
    aboutYou,
    livingParent,
    aboutParents,
    logOutUser,
    error,
    common,
    frontPage,
    loggedInUserInfo,
    navigation,
    paymentDetails,
    radiobuttons,
    selectScenario,
    pageNotFound,
    systemUnavailable,
    summary,
    receipt,
    yourSituation,
}

export default texts
