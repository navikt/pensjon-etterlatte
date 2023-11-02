import { TKey, TNamespace, Translation } from '../context/language/translations'

const app = {
    applicationTitle: 'Søknad om barnepensjon',
    fetchingApplicationDetails: 'Hentar søknadsinformasjon ...',
}

const common = {
    firstName: 'Førenamn',
    lastName: 'Etternamn',
    name: 'Namn',
    fnrDnr: 'Fødselsnummer / d-nummer',
    address: 'Bustadsadresse',
    maritalStatus: 'Sivilstatus',
    citizenship: 'Statsborgarskap',
    phoneNumber: 'Telefonnummer',
    phoneNumberOptional: 'Telefonnummer (valfri)',
    phoneNumberHelpText: 'Telefonnummeret er henta frå Kontakt- og reservasjonsregisteret.',
    whyWeAsk: 'Kvifor spør vi om dette',
    dateFormat: '(dd.mm.yyyy)',
    dateExample: 'eks. 01.11.2020',
    dateSRLabel: 'Oppgi dato',
    chooseCountry: 'Vel land',
    chooseLanguage: 'Vel språk',
    norway: 'Noreg',
    optional: 'valfri',
}

const navigation = {
    cancelApplicationTitle: 'Vil du avbryte søknaden?',
    cancelApplicationBody: 'Du kan halde fram no eller seinare. Søknaden din vert lagra i 72 timer.',
    continueApplicationButton: 'Nei, eg vil halde fram',
    cancelApplicationButton: 'Ja, avbryt og hald fram seinare',
    deleteApplicationButton: 'Ja, avbryt og slett søknaden',
}

const btn = {
    backButton: 'Tilbake',
    nextButton: 'Neste',
    saveButton: 'Lagre',
    cancelButton: 'Avbryt',
    removeButton: 'Fjern',
    deleteButton: 'Slette',
    editButton: 'Endre',
    continueButton: 'Fortsett',
    yesButton: 'Ja, send søknad',
    noButton: 'Nei, gå tilbake',
    yesUnknownParent: '<MANGLER TEKST>',
    noUnknownParent: '<MANGLER TEKST>',
}

const loggedInUserInfo = {
    incorrectInfoMustBeCorrected:
        'Viss opplysingane vi har om deg ikkje stemmer, må du endre desse hos Folkeregisteret',
}

const paymentDetails = {
    title: 'Oppgi bankopplysingar',
    NORSK: 'Norsk',
    UTENLANDSK: 'Utanlandsk',
    bankAccount: 'Oppgi norsk kontonummer for utbetaling av barnepensjon',
    information: 'Du kan legge til eit eige kontonummer for barnet.',
    accountType: 'Ønsker du å motta utbetalinga på norsk eller utanlandsk bankkonto?',
    foreignBankName: 'Bankens namn',
    foreignBankAddress: 'Bankens fulle adresse',
    iban: 'IBAN-nummer',
    ibanHelpText: 'IBAN står for International Bank Account Number og er ein internasjonal standard for kontonummer.',
    swift: 'Bankens S.W.I.F.T (BIC) adresse',
    swiftHelpText:
        'BIC står for Bank Identifier Code, og er den koden som identifiserer banken. BIC kallast også SWIFT, og er påkrevd ved betaling til ei rekke land.',
    doYouWantUsToWithholdTax: 'Ønsker du at vi legg inn eit skattetrekk for barnepensjonen?',
    childPensionIsTaxable:
        'Barnepensjon er skattepliktig, men vi trekk ikkje skatt av beløpet utan at vi får beskjed om det. Viss du har spørsmål om skatt må du ta kontakt med Skatteetaten.',
    desiredTaxPercentage: 'Oppgi ønska skattetrekk',
    desiredTaxPercentagePlaceholder: 'i prosent, eks. 20%',
    taxWithholdMustBeSentYearly: 'Ver merksam på at frivillig skattetrekk må sendast inn på nytt kvart kalenderår.',
}

const radiobuttons = {
    JA: 'Ja',
    NEI: 'Nei',
    VET_IKKE: 'Veit ikkje',
}

const frontPage = {
    frontPageTitle: 'Søk om barnepensjon',
    helloUser: `Hei, {fornavn} {etternavn}`,
    startApplication: 'Start søknad',
    childMayBeApplicableForPension:
        'Barn under 18 år som har mista ein eller begge foreldra sine, kan få økonomisk støtte. Det er foreldra eller verjen til barnet som må søke om barnepensjon for barnet viss det er under 18 år. \n\nBarn som er under utdanning, eller er lærling eller praktikant, kan ha rett til barnepensjon sjølv om det er over 18 år:\n',
    childMayBeApplicableForPension_li1:
        'Viss dødsfallet skuldast yrkesskade eller yrkessjukdom, kan barnet ha rett til barnepensjon inntil fylte 21 år.',
    childMayBeApplicableForPension_li2:
        'Viss barnet har mista begge foreldra sine, kan barnet ha rett til barnepensjon inntil fylte 20 år.',
    childOver18HasToApplyByThemself:
        'Barn over 18 år må søke sjølv.\n\n<a href="https://www.nav.no/barnepensjon">Mer om barnepensjon</a>',
    tax: 'Skatt',
    aboutChildrensPensionTax:
        'Barnepensjon er skattepliktig, men det vert ikkje trukke forskuddsskatt. Viss du har spørsmål om skatt må du ta kontakt med Skatteetaten.',
    weWillRetrieveInfo: 'Vi hentar informasjonen vi treng',
    infoWeRetrieve:
        'For å kunne behandle søknaden din treng vi informasjon om barnet/barna, foreldra til barna og eventuelle søsken.\n\nVi hentar:',
    infoWeRetrieve_li1: '<strong>Personinformasjon</strong> frå Folkeregisteret',
    infoWeRetrieve_li2: '<strong>Inntektsinformasjon</strong> frå Skatteetaten',
    infoWeRetrieve_li3: 'Opplysingar om <strong>arbeidsforhold</strong> frå Arbeidsgiver- og arbeidstakerregisteret',
    infoWeRetrieve_li4: 'Opplysingar om <strong>anna støtte frå NAV</strong>',
    infoWeRetrieve_li5: 'Eventuelt informasjon frå <strong>utanlandske trygdemyndigheiter</strong>',
    howWeHandleData:
        '<a href="https://www.nav.no/no/nav-og-samfunn/om-nav/personvern-i-arbeids-og-velferdsetaten/personvernerklaering-for-arbeids-og-velferdsetaten">Slik behandlar vi personopplysingane dine</a>',
    aboutPrivacy:
        '<a href="https://www.nav.no/no/nav-og-samfunn/om-nav/personvern-i-arbeids-og-velferdsetaten/personvern-og-sikkerhet-pa-nav.no#chapter-3">Om personvern og sikkerheit på nav.no</a>',
    aboutTheApplicationTitle: 'Utfylling av søknaden',
    aboutTheApplicationDescription:
        'Vi lagrar søknaden i 72 timer så du kan ta pauser undervegs. Du kan når som helst avbryte søknaden.',
    consentTitle: 'Vi stoler på deg',
    consentDescription: 'Du må gi oss riktige opplysingar for at vi skal kunne behandle søknaden.\n\n',
    consentToNav: 'Eg, {fornavn} {etternavn}, bekreftar at eg vil gi riktige og fullstendige opplysingar.',
}

const selectScenario = {
    whoIsApplying: 'Kven søker du barnepensjon for?',
    additionalSituationDetails: 'Barnet/barna har mista',
    additionalSituationDetailsOver18: '<Mangler tekst>',
    PARENT: 'Eg søker for mitt/mine barn under 18 år',
    GUARDIAN: 'Eg søker for eitt eller fleire barn eg er verje for',
    CHILD: 'Eg har fylt 18 år og søker på vegne av meg sjølv',
    parentApplicantInformation:
        'I søknaden må du oppgi alle barn og/eller adoptivbarn under 18 år som du har saman med avdøde. Søsken kan få betydning for berekninga av barnepensjon.',
    guardianApplicantInformation:
        'I søknaden må du oppgi alle avdøde sine barn og/eller adoptivbarn som er under 18 år. Søsken kan få betydning for berekninga av barnepensjon.',
    guardiansMustSendDocumentation:
        'Viss barna ikkje er heilsøsken, må ein søke for kvart barnekull. \n\nFor at vi skal kunne behandle søknaden om barnepensjon må du ettersende dokumentasjon på at du er verje for barnet/barna.',
    childApplicantInformation1:
        '<b>Viss du har mista ein forelder</b>\nNår dødsfallet skuldast ein yrkesskade eller yrkessjukdom kan du få barnepensjon inntil du blir 21 år hvis du er under utdanning, eller er lærling eller praktikant.',
    childApplicantInformation2:
        '<b>Viss du har mista begge foreldra dine eller farskapet ikkje er fastsatt må du bruke</b>\nDu kan få barnepensjon inntil du blir 20 år viss du er under utdanning, eller er lærling eller praktikant. Du kan få barnepensjon inntil du blir 21 år viss dødsfallet i tillegg skuldast ein yrkesskade eller yrkessjukdom.',
    childApplicantInformationOver18:
        'Har du mista ein eller begge foreldra dine må du bruke <a href="https://www.nav.no/fyllut/nav180405?lang=nn-NO">denne søknaden</a>.',
    youNeedFnrForEveryoneInThisApplicationOneParentDeceased:
        'Du må oppgi heile fødselsnummeret til barnet/barna og foreldra. Viss ikkje du har det, må du bruke <a href="https://www.nav.no/soknader/nb/person/stonader-ved-dodsfall/barn-som-har-mistet-en-eller-begge-foreldrene/NAV%2018-04.01/brev">denne søknaden</a>.',
    youNeedFnrForEveryoneInThisApplicationSurvivingParent:
        'Du må oppgi heile fødselsnummeret til barnet/barna og avdøde. Viss ikkje du har det, må du bruke <a href="https://www.nav.no/start/soknad-barnepensjon?stegvalg=1">denne søknaden</a>.',
    youNeedFnrForEveryoneInThisApplicationBothParentsDeceased:
        'Du må oppgi heile fødselsnummeret til barnet/barna og foreldra. Viss ikkje du har det, må du bruke <a href="https://www.nav.no/soknader/nb/person/stonader-ved-dodsfall/barn-som-har-mistet-en-eller-begge-foreldrene/NAV%2018-01.05/brev">denne søknaden</a>.',
    guardianApplicantInformationFatherNotConfirmed:
        'Viss barnet har mista mora si og farskapet ikkje er fastsatt må du bruke <a href="https://www.nav.no/soknader/nb/person/stonader-ved-dodsfall/barn-som-har-mistet-en-eller-begge-foreldrene/NAV%2018-01.05/brev">denne søknaden</a>.',
    aboutSurvivorsPensionDescription:
        '<b>Har du mista ektefellen, sambuaren eller partnaren din?</b>\nDå kan du søke om attlevandepensjon eller overgangsstønad. Viss du ønsker å søke om barnepensjon samtidig kan du bruke <a href="https://www.nav.no/soknader#gjenlevendepensjon">denne søknaden.</a>',
    BOTH_PARENTS_DECEASED: 'Begge foreldra',
    BOTH_PARENTS_DECEASED_CHILD_APPLICANT: 'Eg er foreldrelaus',
    ONE_PARENT_DECEASED: 'Ein forelder',
}

const aboutYou = {
    title: 'Om deg',
    stayWhy:
        'Viss du oppheld deg i eit anna land enn Noreg kan det avgjere om du får attlevandepensjon og kor mykje du kan få.',
    addressOfResidenceConfirmed: 'Bur du på denne adressa?',
    alternativeAddress: 'Oppgi noverande bustadsadresse',
    residesInNorway: '<MANGLER TEKST>',
    residesInNorwayDescription: '<MANGLER TEKST>',
    countryOfResidence: 'Oppgi land',
    memberFolketrygdenAbroad: 'Er du medlem i folketrygda under opphald i eit anna land enn Noreg?',
    'subtitle.personalia': 'Personalia',
}

const aboutParents = {
    aboutParentsTitle: 'Om foreldra',
    unknownParentTitle: '<MANGLER TEKST>',
    firstParent: 'Forelder 1',
    secondParent: 'Forelder 2',
    survivingParent: 'Attlevende forelder',
    deceasedParent: 'Avdød forelder',
    addParentBtn: 'Legg til',
    addSurvivingParentBtn: 'Legg til attlevande forelder',
    addDeceasedParentBtn: 'Legg til avdød forelder',
    addFirstParentBtn: 'Legg til forelder 1',
    addSecondParentBtn: 'Legg til forelder 2',
    bothParentsRequired:
        'Du må legge til opplysingar om begge foreldra for å halde fram med søknaden. \n\n Viss barnet har mista mora si og farskapet ikkje er fastsatt må du bruke',
    missingOneParentLink:
        '<a href="https://www.nav.no/soknader/nb/person/stonader-ved-dodsfall/barn-som-har-mistet-en-eller-begge-foreldrene/NAV%2018-01.05/brev"> denne søknaden</a>.',
    childAndOneParentDeceased: '<MANGLER TEKST>',
    unknownParent: '<MANGLER TEKST>',
    unknownParentQuestion: '<MANGLER TEKST>',
    childAndOneParentDeceasedGuidepanel: '<MANGLER TEKST>',
    childAndBothParentsDeceasedGuidepanel: '<MANGLER TEKST>',
}

const livingParent = {
    title: 'Om den attlevande',
    address: 'Adresse (valgfri)',
}

const aboutTheDeceased = {
    firstParentTitle: 'Om den første forelderen',
    secondParentTitle: 'Om den andre forelderen',
    singleParentTitle: 'Om den avdøde',
    dateOfDeath: 'Når skjedde dødsfallet?',
    phoneNumber: 'Telefonnummer (valfri)',
    abroadStaysTitle: 'Opphald utanfor Norge',
    workOrLivingAbroadCanAffectPension:
        'Vi treng å vite om avdøde har budd eller arbeidd utanfor Norge. Dette kan påvirke berekninga av barnepensjon og i tillegg gi barnet/barna pensjonsrettar frå andre land.',
    workOrLivingAbroadCanAffectPensionOver18: '<MANGLER TEKST>',
    didTheDeceasedLiveAbroad: 'Har han eller ho budd og/eller arbeidd i eit anna land enn Noreg etter fylte 16 år?',
    abroadInWhichCountry: 'Land',
    livedOrWorkedAbroad: 'Budd og/eller arbeidd?',
    stayedAbroadFromDate: 'Frå dato',
    stayedAbroadToDate: 'Til dato',
    deceasedWasMemberOfFolketrygdenAbroad: 'Var han eller ho medlem av folketrygda under opphaldet?',
    whyWeAskAboutFolketrygden: 'Vi må vite om avdøde var medlem av folketrygda for å avgjere retten til barnepensjon.',
    pensionReceivedFromAbroad: 'Oppgi eventuell pensjon han eller ho mottok frå dette landet (valfri)',
    selfEmploymentTitle: 'Næringsinntekt',
    weNeedToKnowIfDeceasedWasSelfEmployed:
        'Vi treng å vite om avdøde hadde inntekt som sjølvstendig næringsdrivende. Dette kan påvirke berekninga av barnepensjon. Vi hentar informasjon om andre inntekter.',
    wasTheDeceasedSelfEmployed: 'Var han eller ho sjølvstendig næringsdrivande?',
    incomeFromSelfEmployymentYearBeforeDeath: 'Oppgi næringsinntekt frå kalenderåret før dødsfallet (valfri)',
    incomeFromSelfEmploymentBeforeTaxes: 'Samla årsinntekt før skatt',
    hadIncomeFromSelfEmployment: 'Hadde han eller ho næringsinntekt når dødsfallet skjedde?',
    otherTitle: 'Anna',
    occupationalInjury: 'Skuldast dødsfallet yrkesskade eller yrkessjukdom?',
    whyWeAskAboutOccupationalInjury:
        'Viss dødsfallet skuldast yrkesskade eller yrkessjukdom godkjent av NAV, kan det avgjere om barnet/barna får barnepensjon og kor mykje det/dei kan få.',
    whyWeAskAboutOccupationalInjuryOver18: '<MANGLER TEKST>',
    deceasedHasServedInTheMilitary:
        'Har han eller ho gjennomført militær eller sivil førstegongsteneste for Noreg som varte minst 30 dager?',
    whyWeAskAboutMilitaryService: 'Dette kan gi opptening som vert tatt med i berekninga av barnepensjonen.',
    militaryServiceYears: 'Kva for år? (valfri)',
    BODD: 'Budd',
    ARBEIDET: 'Arbeidd',
    addCountryButton: '+ Legg til fleire land',
}

const aboutChildren = {
    childAppliedForPension: 'Søkt om barnepensjon',
    applyForThisChild: 'Søk om barnepensjon',
    userAppliesForChildrensPension: 'Ja, eg søker om barnepensjon for barnet',
    onlyChildrenOfDeceasedHaveRights: 'Det er berre avdødes barn og adoptivbarn som kan ha rett til barnepensjon.',
    onlyParentOrGuardianCanApply:
        'Har barnet mista ein forelder så må forelder eller oppnemnt verje sende eigen søknad.',
    onlyParentOrGuardianCanApplyOnLivingParent:
        'Det er berre barnets foreldre eller oppnemnt verje som kan søke om barnepensjon for dette barnet. Det må søkast om barnepensjon i eigen søknad.',
    onlyChildrenUnder18Necessary: 'Du skal kun oppgi barn under 18 år.',
    livesIn: 'Bur i',
    doesTheChildLiveAbroad: 'Bur barnet i eit anna land enn Norge?',
    doesTheSiblingLiveAbroad: 'Bur søskenet i eit anna land enn Noreg?',
    stayAbroadCountry: 'Land',
    addressAbroad: 'Adresse i utlandet',
    guardianLastName: 'Etternamn (valfri)',
    guardianFirstName: 'Fornamn (valfri)',
    guardianName: 'Namn på verje',
    childHasGuardian: 'Er det oppnemnt en verje for barnet?',
    guardianFnr: 'Fødselsnummer til verje (valgfri)',
    guardianFnrPlaceholder: '11 siffer',
    information:
        'Oppgi avdøde sine biologiske barn og/eller adoptivbarn under 18 år. \n\nDersom barna ikkje er heilsøsken, må forelder eller oppnemnt verje sende inn eigen søknad for desse barna.\n\nFosterbarn skal ikkje førasts opp, fordi dei ikkje har rett til barnepensjon etter fosterforeldra.\n\nBarn over 18 år må søke sjølv om barnepensjon. ',
    infoRegardingSiblings: 'Her er info viss det er søsken',
    infoCard_residence: 'BUSTAD',
    infoCard_fnr: 'FØDSELSNUMMER',
    infoCard_citizenship: 'STATSBORGARSKAP',
    removeChildButton: 'Fjern fra søknad',
    addChildButton: '+ Legg til barn',
    addSiblingButton: '+ Legg til søsken',
    whoAreTheParents: 'Kven er foreldre til barnet?',
    whoAreTheParentsHelpText:
        'Vi må vite om dette er eit barn du har felles med avdøde, avdøde sitt eige barn, eller ditt eiget barn.',
    bothOfTheAbove: '{person1} og {person2}',
    remainingParentsChild: 'Eg',
    jointChild: 'Eg og {person1}',
    relationHelpText:
        'Vi må vite om dette er eit barn du har felles med avdøde, avdøde sitt eige barn, eller ditt eige barn.',
    aboutChildrenTitle: 'Om barn',
    titleModal: 'Om barnet',
    aboutTheSiblingTitle: 'Om søskenet',
    aboutSiblingsTitle: 'Om søsken',
    thisIsOptional: 'Dette er valfritt',
    youAndDeceasedAreTheParents: 'Er du og den avdøde foreldra til barnet?',
    loggedInUserIsGuardian: 'Er du verje for dette barnet?',
    onlyGuardiansCanApply:
        'Du kan berre søke om barnepensjon for barn du er verje for. \nAlle avdøde sine barn under 18 år kan leggjast til.',
}

const summary = {
    summaryTitle: 'Oppsummering',
    readTheSummaryBeforeSending:
        'Les gjennom oppsummeringa av søknaden før du sender.\nViss du treng å gjere endringar, kan du gå tilbake og gjere det.',
    sendApplicationButton: 'Send søknad',
    AboutYou: 'Endre svar om deg',
    AboutTheParents: 'Endre svar om foreldre',
    AboutTheDeceased: 'Endre svar om den avdøde',
    AboutChildren: 'Endre svar om barn',
    YourSituation: 'Endre svar om din situasjon',
    errorWhenSending: 'Ein feil oppstod ved sending. Vent litt og prøv på nytt. Dersom feilen varer kan du melde feil ',
    errorWhenSendingLink: 'her.',
    errorWhenSendingHref: 'https://www.nav.no/person/kontakt-oss/nb/tilbakemeldinger/feil-og-mangler',
    sendApplicationTitle: 'Ønsker du å sende inn søknaden no?',
    sendingApplicationTitle: 'Sender inn søknad',
    sendApplicationBody: 'Når du har sendt inn søknaden kan du ikkje endre på opplysingane som du har lagt inn.',
}

const error = {
    fixTheseErrorsToContinue: 'For å gå vidare må du rette opp i dette:',
    'applicantRole.required': 'Oppgi kven som søkjer om barnepensjon',
    'applicantSituation.required': 'Oppgi kven barnet/barna har mista',
    'abroadStays.hasStaysAbroad.required': 'Oppgi om den avdøde har budd eller jobba i eit anna land enn Noreg',
    'addressOfResidenceConfirmed.required': 'Bustadadresse må bekreftast/avkreftast',
    'alternativeAddress.required': 'Du må oppgi noverande bustadsadresse',
    'citizenship.required': 'Oppgi statsborgarskap',
    'countryOfResidence.required': 'Oppgi noverande opphaldsland',
    'dateOfDeath.required': 'Oppgi når dødsfallet skjedde',
    'firstName.required': 'Oppgi førenamn',
    'firstName.pattern': 'Ugyldig førenamn',
    'fnr.required': 'Oppgi fødselsnummer',
    'fnrDnr.duplicate': 'Duplikat fødselsnummer / d-nummer',
    'fnr.validate': 'Ikkje eit gyldig fødselsnummer',
    'fnrDnr.required': 'Oppgi fødselsnummer / d-nummer',
    'fnrDnr.validate': 'Ikkje eit gyldig fødselsnummer',
    'lastName.required': 'Oppgi etternamn',
    'lastName.pattern': 'Ugyldig etternamn',
    'address.required': 'Oppgi adresse',
    'phoneNumber.minLength': 'Telefonnummer er for kort',
    'phoneNumber.pattern': 'Telefonnummer har ugyldig format',
    'children.required': 'Du må søke om barnepensjon for minst eit barn.',
    'children.validate': 'Du må søke om barnepensjon for minst eit barn.',
    'memberFolketrygdenAbroad.required': 'Oppgi om du er medlem i folketrygda under opphald i eit anna land enn Noreg',
    'militaryService.completed.required': 'Oppgi om avdøde har gjennomført sivil eller militær førstegongsteneste',
    'occupationalInjury.required': 'Oppgi om dødsfallet skuldast yrkesskade eller yrkessjukdom',
    'paymentDetails.taxWithhold.answer.required': 'Oppgi om det blir ønskt å leggja til skattetrekk',
    'paymentDetails.taxWithhold.taxPercentage.required': 'Oppgi ønskt skattetrekk',
    'paymentDetails.bankAccount.required': 'Norsk kontonummer må fyllast ut (11 siffer)',
    'paymentDetails.bankAccount.pattern': 'Kontonummer ikkje gyldig. Må bestå av 11 siffer',
    'paymentDetails.accountType.required': 'Du må velja mellom norsk eller utanlandsk bankkonto for utbetaling',
    'paymentDetails.foreignBankName.required': 'Namnet på den utanlandske banken må fyllast ut',
    'paymentDetails.foreignBankAddress.required': 'Adressa til den utanlandske banken må fyllast ut',
    'paymentDetails.iban.required': 'IBAN-nummer må fyllast ut',
    'paymentDetails.iban.validate': 'Ugyldig IBAN-nummer',
    'paymentDetails.swift.required': 'Bankens S.W.I.F.T (BIC) adresse må fyllast ut',
    'paymentDetails.swift.validate': 'Ugyldig SWIFT-kode',
    'residesInNorway.required': 'Opphald må svarast på',
    'selfEmplyment.wasSelfEmployed.required': 'Oppgi om avdøde var sjølvstendig næringsdrivande',
    'selfEmplyment.selfEmplymentDetails.income.pattern': 'Oppgi gyldig næringsinntekt (kun siffer)',
    'selfEmplyment.selfEmplymentDetails.incomeAtDeath.required': 'Oppgi om avdøde hadde næringsinntekt',
    'staysAbroad.answer.required': 'Oppgi om barnet er busatt i eit anna land enn Noreg',
    'staysAbroad.hasStaysAbroad.required': 'Oppgi om avdøde har hatt opphald utanfor Noreg',
    'staysAbroad.abroadStays.type.required': 'Huk av for type opphald',
    'staysAbroad.abroadStays.country.required': 'Oppgi land for opphald',
    'staysAbroad.abroadStays.medlemFolketrygd.required': 'Oppgi om avdøde var medlem av folketrygda under opphaldet',
    'parents.required': 'Oppgi kven som er barnets foreldre',
    'loggedInUserIsGuardian.required': 'Oppgi om du er verje for barnet',
    'staysAbroad.country.required': 'Oppgi kva land barnet bur i',
    'staysAbroad.address.required': 'Oppgi barnets bustadsadresse',
    'childHasGuardianship.answer.required': 'Oppgi om det er oppnevnt verje for barnet',
    'childHasGuardianship.firstName.pattern': 'Ugyldig førenamn',
    'childHasGuardianship.lastName.pattern': 'Ugyldig etternamn',
    'childHasGuardianship.fnr.validate': 'Ikkje eit gyldig fødselsnummer',
    'whyDoYouApply.required': 'Oppgi grunnen til at du søker barnepensjon',
    'timeUsedForEducation.required': 'Oppgi kor mykje tid du bruker på utdanning',
    'doYouHaveIncome.required': 'Oppgi om du har lønnsinntekt',
}

const pageNotFound = {
    notFoundTitle: 'Oi, har du gått deg vill?',
    pageDoesNotExist: 'Denne sida finst ikkje.',
    pageDoesNotExistInfo:
        'Dersom du har klikka på ei lenke på sidene våre og enda opp her, kan du rapportera feilen her:',
    reportErrorLink:
        '<a href="https://www.nav.no/tilbakemelding-feilogmangler">www.nav.no/tilbakemelding-feilogmangler</a>',
    backButton: 'Klikk her for å gå tilbake',
}

const systemUnavailable = {
    applicationNotWorking: 'Ã… nei, søknaden fungerer ikkje...',
    somethingIsWrongWithTheApplication:
        'Det er ein feil i søknaden som gjer at den dessverre ikkje fungerer som den skal.',
    weAreWorkingOnTheError:
        'Vi beklager dette og jobbar med å finna ut av det så raskt som mogleg. I mellomtida er det nok lurt å ta ein pause og prøve igjen seinare.',
    reportError: 'Er det fortsatt feil, kan du melde frå om det på ',
    reportErrorLink:
        '<a href="https://www.nav.no/person/kontakt-oss/nb/tilbakemeldinger/feil-og-mangler">www.nav.no/person/kontakt-oss/nb/tilbakemeldinger/feil-og-mangler</a>',
    moreAboutBenefits: 'Du kan lesa meir om ytingar til attlevande på',
    moreAboutBenefitsLink: '<a href="https://www.nav.no/mistet-noen">www.nav.no/mistet-noen</a>',
    retryButton: 'Prøv igjen',
}

const invalidApplicant = {
    applicantIsTooYoung: 'For å søke om barnepensjon må du vere over 18 år.',
    childMayBeApplicableForPension:
        'Barn som har mista ein eller begge foreldra sine, kan få økonomisk støtte. Barnepensjon skal sikra inntekt til å leve og bu. \n\nFor barn under 18 år er det forelder eller verje som søker om barnepensjon.',
    moreAboutChildrensPension: '<a href="https://www.nav.no/barnepensjon">Mer om barnepensjon</a>',
}

const logOutUser = {
    btn: 'X-ikon for å lukke meldinga',
    time: 'minutt',
    youWillBeLoggedOutIn: 'Du vil bli logga ut om',
    sendNowOrContinueLater: 'Du kan sende søknaden no eller halde fram seinare. \n Søknaden din blir lagra i 72 timar.',
    wereLoggingYouOut: 'Du vil no bli logga ut!',
}

const receipt = {
    thankYou: 'Takk for søknaden!',
    pageTitle: 'Søknaden er sendt til oss',
    contact: 'Viss vi manglar informasjon for å behandle søknaden, kontaktar vi deg.',
    youMustNotifyRegardingChanges: 'Du må melde frå om endringar',
    importantChangesCanAffectYourRights:
        'Du må melde frå med ein gong det skjer viktige endringar i livet til barnet eller barna. Det kan til dømes vera ved:',
    changeInLivingSituation: 'endring i bu/familiesituasjon',
    changeAddressOrMoveAbroad: 'flytting eller opphald i eit anna land over tid',
    childrenOver18MustNotify:
        'Barn over 18 år som mottek barnepensjon må i tillegg gi beskjed om endring i utdanningssituasjon og/eller arbeidsinntekt.',
    changeInEduation: 'utdanningssituasjon og/eller arbeidsinntekt',
    moreAboutRightsAndDuties: 'Du kan lese meir om rettar og plikter på',
    moreAboutRightsAndDutiesLinkHref: 'https://nav.no/rettogplikt',
    moreAboutRightsAndDutiesLinkText: 'nav.no/rettogplikt',
    benefitsChangingTitle: 'Regelendringar',
    benefitsChangingDescription1: 'Barnepensjon skal styrkast. Les meir om endringane her: ',
    benefitsChangingDescription1_link: 'www.nav.no/barnepensjon',
    benefitsChangingDescription1_href: 'https://www.nav.no/barnepensjon#regel',
    submissionOfGuardianshipInfo: 'Verje',
    guardianshipMustBeConfirmed:
        'Dersom du har sendt inn søknad som verje må du sende bekreftelse på utnevning av verje frå tingretten eller Statsforvalteren på ',
    guardianshipMustBeConfirmedLink: 'skjema NAV 00-03.00.',
    guardianshipMustBeConfirmedHref: 'https://www.nav.no/soknader/nb/person/diverse/div-dokumentasjon',
    viewCaseTitle: 'Sjekke status i saken?',
    viewCaseInfoContentPart1:
        'Forelder eller verje kan ikkje følge saken til barnet digitalt. Viss du har spørsmål om søknaden, må du kontakte oss på telefon 55 55 33 34.',
    viewCaseInfoContent2: 'Barn over 18 år kan sjølv sjekke status i saka si ved å logge inn i ',
    viewCaseInfoLinkHref2: 'https://tjenester.nav.no/saksoversikt',
    viewCaseInfoLinkText2: 'Ditt NAV',
    processingTimeText_part1: 'Barnepensjon følger same ',
    processingTimeLink4: 'saksbehandlingstid',
    processingTimeHref4: 'https://www.nav.no/saksbehandlingstider',
    processingTimeText_part2: ' som søknad om attlevandepensjon.',
    closeApplicationButton: 'Avslutt',
}

const yourSituation = {
    title: 'Din situasjon',
    whatsYourSituation: 'Kva er din situasjon?',
    timeUsedForEducation: 'Kor mykje tid brukar du på utdanninga?',
    whyDoYouApply: 'Kvifor søker du barnepensjon etter fyllte 18 år',
    doYouHaveIncome: 'Har du lønnsinntekt?',
    BELOW50: 'Under 50%',
    OVER50: '50% eller mer',
    ORPHAN: 'Eg er foreldrelaus',
    OCCUPATIONAL_INJURY: 'Den avdøde mora eller faren min døde som følge av ei godkjent yrkesskade',
    EDUCATION: 'Eg tar utdanning',
    APPRENTICE: 'Eg er lærling',
    INTERNSHIP: 'Eg har praksisplass eller er praktikant',
}

const continueApplicationModal = {
    doYouWantToContinueWithTheApplication: 'Ønsker du å halde fram med utfyllinga av påbegynt søknad?',
    yesContinueWithApplication: 'Ja, eg vil halde fram der eg slapp',
    noRestartApplication: 'Nei, start på nytt',
}

const steps = {
    AboutYou: 'Om deg',
    AboutTheParents: 'Om foreldra',
    AboutTheDeceased: 'Om den avdøde',
    YourSituation: 'Din situasjon',
    AboutChildren: 'Opplysningar om barna',
    Summary: 'Oppsummering',
}

const texts: Record<TNamespace, Record<TKey, Translation>> = {
    app,
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
    btn,
    steps,
    radiobuttons,
    selectScenario,
    pageNotFound,
    systemUnavailable,
    invalidApplicant,
    summary,
    receipt,
    yourSituation,
    continueApplicationModal,
}

export default texts
