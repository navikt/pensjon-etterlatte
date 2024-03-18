import { TKey, TNamespace, Translation } from '../context/language/translations'

const app = {
    applicationTitle: 'Søknad om barnepensjon',
    fetchingApplicationDetails: 'Henter søknadsinformasjon ...',
}

const common = {
    firstName: 'Fornavn',
    lastName: 'Etternavn',
    name: 'Navn',
    fnrDnr: 'Fødselsnummer / d-nummer',
    address: 'Bostedsadresse',
    maritalStatus: 'Sivilstatus',
    citizenship: 'Statsborgerskap',
    phoneNumber: 'Telefonnummer',
    phoneNumberOptional: 'Telefonnummer (valgfri)',
    phoneNumberHelpText: 'Telefonnummeret er hentet fra Kontakt- og reservasjonsregisteret.',
    dateFormat: '(dd.mm.åååå)',
    dateExample: 'eks. 01.11.2020',
    dateSRLabel: 'Oppgi dato',
    chooseCountry: 'Velg land',
    chooseLanguage: 'Velg språk',
    chooseCurrency: 'Velg valuta',
    norway: 'Norge',
    optional: 'valgfri',
}

const navigation = {
    cancelApplicationTitle: 'Vil du avbryte søknaden?',
    cancelApplicationBody: 'Du kan fortsette nå eller senere. Søknaden din lagres i 72 timer.',
    continueApplicationButton: 'Nei, jeg vil fortsette',
    cancelApplicationButton: 'Ja, avbryt og fortsett senere',
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
    yesButton: 'Ja, send søknad',
    noButton: 'Nei, gå tilbake',
    continueButton: 'Fortsett',
    yesUnknownParent: 'Ja, min forelder er ukjent',
    yesUnknownParentGuardian: 'Ja, forelderen er ukjent',
    noUnknownParent: 'Nei, jeg kjenner til mine foreldre',
    noUnknownParentGuardian: 'Nei, jeg kjenner identiteten til begge foreldrene',
}

const loggedInUserInfo = {
    incorrectInfoMustBeCorrected:
        'Hvis opplysningene vi har om deg ikke stemmer, må du endre disse hos Folkeregisteret. \n',
    incorrectInfoMustBeCorrectedHref: 'https://www.skatteetaten.no/skjema/opplysninger-i-folkeregisteret/',
    incorrectInfoMustBeCorrectedHrefText: 'Endre opplysningene dine',
}

const paymentDetails = {
    title: 'Oppgi bankopplysninger',
    NORSK: 'Norsk',
    UTENLANDSK: 'Utenlandsk',
    bankAccount: 'Oppgi norsk kontonummer for utbetaling av barnepensjon',
    bankAccountDescription: 'Du kan legge til et eget kontonummer for barnet.',
    information: 'Du kan legge til et eget kontonummer for barnet.',
    accountType: 'Ønsker du å motta utbetalingen på norsk eller utenlandsk bankkonto?',
    foreignBankName: 'Bankens navn',
    foreignBankAddress: 'Bankens fulle adresse',
    iban: 'IBAN-nummer',
    ibanHelpText: 'IBAN står for International Bank Account Number og er en internasjonal standard for kontonummer.',
    swift: 'Bankens S.W.I.F.T (BIC) adresse',
    swiftHelpText:
        'BIC står for Bank Identifier Code, og er den koden som identifiserer banken. BIC kalles også SWIFT, og er påkrevd ved betaling til en rekke land.',
    doYouWantUsToWithholdTax: 'Ønsker du at vi legger inn et skattetrekk for barnepensjonen?',
    childPensionIsTaxable:
        'Barnepensjon er skattepliktig, men vi trekker ikke skatt av beløpet uten at vi får beskjed om det. Hvis du har spørsmål om størrelsen på skattetrekket må du ta kontakt med Skatteetaten.',
    desiredTaxPercentage: 'Oppgi ønsket skattetrekk',
    desiredTaxPercentagePlaceholder: 'i prosent, eks. 20%',
    taxWithholdMustBeSentYearly: 'Vær oppmerksom på at frivillig skattetrekk må sendes inn på nytt hvert kalenderår.',
}

const radiobuttons = {
    JA: 'Ja',
    NEI: 'Nei',
    VET_IKKE: 'Vet ikke',
}

const frontPage = {
    frontPageTitle: 'Søk om barnepensjon',
    ingress:
        'Hei, jeg er her for å veilede deg gjennom søknaden. Svar så godt du kan ut fra hvordan situasjonen er nå og så kan du melde fra om eventuelle endringer senere.\n\n Vi lagrer svarene i søknaden underveis, så du kan trygt ta pauser og gå tilbake å endre dem. Vær oppmerksom på at vi kun lagrer svarene dine i 72 timer.',
    startApplication: 'Start søknad',
    childMayBeApplicableForPension:
        'Barn under 20 år som har mistet en eller begge foreldrene sine, kan få barnepensjon.',
    childMayBeApplicableForPension_li1:
        'Det er forelderen eller vergen til barnet som må søke om barnepensjon for barnet hvis det er under 18 år.',
    childMayBeApplicableForPension_li2:
        'Som verge kan du kun sende søknad for barn du er verge for. Du kan også søke for de over 18 år.',
    childMayBeApplicableForPension_li3: 'Barn over 18 år må søke selv.',
    readMoreAboutChildrensPension:
        'Lurer du på hvor mye man kan få, skatt eller annet om pensjonen, kan du <a href="https://www.nav.no/barnepensjon">lese mer om barnepensjon</a>.',
    weWillRetrieveInfoTitle: 'Behandling av personopplysninger i søknaden',
    howWeProcessDataTitle: 'Slik behandler NAV personopplysningene dine',
    howWeProcessDataContent:
        'Når du sender inn en søknad om ytelse, innhenter og behandler NAV personopplysninger om den som søker ytelsen. Dersom du sender inn en søknad om ytelse på vegne av noen andre, herunder ditt barn eller et barn du er verge for, innhenter og behandler vi opplysninger om barnet. Dette er nødvendig for at du, eller den du søker for, skal få gode tjenester og riktige ytelser og for å oppfylle NAVs plikt til å bidra til økonomisk trygghet ved dødsfall etter Folketrygdloven kapittel 18.',
    collectAndProcessTitle: 'Vi samler inn og behandler personopplysninger for å',
    collectAndProcess_li1: 'identifisere og kommunisere med deg som søker eller er representant for søker',
    collectAndProcess_li2: 'behandle søknaden din',
    collectAndProcess_li3: 'betale ut ytelsen',
    weWillRetrieveInfo: 'Vi henter informasjonen vi trenger',
    infoWeRetrieve:
        'For å behandle søknaden din, henter vi inn opplysninger om deg som søker og tredjepersoner som er relevant for søknaden din. Relevante tredjepersoner kan være gjenlevende forelder eller verge som har rett til å representere deg overfor NAV. \n\nI tillegg til informasjonen du gir oss gjennom søknadsdialogen kan vi hente:',
    infoWeRetrieve_li1: 'personopplysninger fra Folkeregisteret (personnummer, adresse, statsborgerskap, sivilstand)',
    infoWeRetrieve_li2: 'opplysninger om annen løpende støtte fra NAV (perioder med mottak av uføretrygd)',
    infoWeRetrieve_li3: 'informasjon fra utenlandske trygdemyndigheter der dette er aktuelt',
    infoWeRetrieve_li4: 'opplysninger om straffegjennomføring og opphold på institusjon',
    survivingParentInfo:
        'Dersom bruker søker på vegne av seg selv, eller en verge søker for bruker, innhenter NAV informasjon om eventuell gjenlevende forelder. Da har vi behov for å hente inn:',
    survivingParentInfo_li1: 'navn',
    survivingParentInfo_li2: 'fødselsnummer',
    survivingParentInfo_li3: 'adresse',
    survivingParentInfo_li4: 'medlemskap i folketrygden (der dette er nødvendig)',
    survivingParentInfo_li5: 'informasjon fra utenlandske trygdemyndigheter (der dette er aktuelt)',
    disclosureOfInformationTitle: 'Utlevering av dine opplysninger',
    disclosureOfInformationContent:
        'I forbindelse med behandling av søknad om barnepensjon utleverer vi enkelte personopplysninger til andre mottakere. Utlevering skjer som oftest i forbindelse med innhenting av opplysninger for å bevise at NAV har lov til å samle inn informasjon om identifiserte enkeltpersoner. For søkere med tilknytning til utland kan det også utleveres informasjon til andre lands trygdemyndigheter.',
    durationDataIsStoredTitle: 'Hvor lenge lagres dine opplysninger',
    durationDataIsStoredContent:
        'Personopplysningene lagres i 10 år etter siste utbetaling etter økonomiregelverkets bestemmelser.',
    automaticProcessingTitle: 'Automatisk behandling',
    automaticProcessingContent1:
        'Stort sett all behandling av personopplysninger i forbindelse med barnepensjon blir gjort manuelt. Det vil si at det er en saksbehandler som ser på og behandler saken din.',
    automaticProcessingContent2:
        'Ved noen anledninger vil det gjøres en automatisk behandling i saken. Ved en løpende ytelse som bruker <a href="https://www.nav.no/grunnbelopet">grunnbeløpet i folketrygden</a> som beregningsgrunnlag, slik som i barnepensjon, vil systemet automatisk endre din utbetaling basert på endringer i grunnbeløpet. Dette er for å sikre at utbetaling av ytelser foregår effektivt.',
    automaticProcessingContent3:
        'For deg vil dette innebære at din stønad automatisk endres i tråd med den årlige justeringen av grunnbeløpet. Når din stønad justeres automatisk, er det ikke en saksbehandler som har behandlet endringen.',
    automaticProcessingContent4: 'Følgende opplysninger benyttes for å gjennomføre grunnbeløpsregulering:',
    automaticProcessingContent_li1: 'personnummer',
    automaticProcessingContent_li2: 'saks-ID',
    automaticProcessingContent_li3: 'type ytelse',
    automaticProcessingContent_li4: 'gjeldende vedtak',
    automaticProcessingContent5:
        'Endringene gjøres i saksbehandlingssystemet og innebærer ikke flytting av opplysninger.',
    aboutPrivacyTitle: 'Personvernerklæringen i NAV',
    aboutPrivacy:
        'Her kan du lese mer om <a href="https://www.nav.no/no/nav-og-samfunn/om-nav/personvern-i-arbeids-og-velferdsetaten">hvordan NAV behandler personopplysningene dine.</a>',
    consentTitle: 'Vi stoler på deg',
    consentDescription: 'Du må gi oss riktige opplysninger for at vi skal kunne behandle søknaden.\n\n',
    consentToNav: 'Jeg bekrefter at jeg vil gi riktige og fullstendige opplysninger.',
    whoIsApplying: 'Hvem søker du barnepensjon for?',
    additionalSituationDetails: 'Barnet har mistet',
    additionalSituationDetailsDescription:
        'Hvis barnet har mistet en forelder og den andre forelderen er ukjent, må du velge "Begge foreldrene".',
    additionalSituationDetailsOver18: 'Jeg har mistet',
    additionalSituationDetailsOver18Description: 'Hvis en av foreldrene dine er ukjent, velger du "Begge foreldrene".',
    PARENT: 'Jeg søker for mitt eller mine barn under 18 år',
    GUARDIAN: 'Jeg søker for ett eller flere barn jeg er verge for',
    CHILD: 'Jeg har fylt 18 år og søker på vegne av meg selv',
    parentApplicantInformationLabel: 'Jeg søker for mitt eller mine barn under 18 år',
    parentApplicantInformation:
        'I søknaden må du oppgi alle barn og/eller adoptivbarn under 18 år som du har sammen med avdøde.',
    guardianApplicantInformationLabel: 'Jeg søker for ett eller flere barn jeg er verge for',
    guardianApplicantInformation: 'I søknaden må du oppgi alle avdødes barn og/eller adoptivbarn under 20 år.',
    guardiansMustSendDocumentation:
        'For at vi skal kunne behandle søknaden om barnepensjon må du ettersende dokumentasjon på barn du er verge for.\n\n Du må oppgi fødselsnummer på alle i søknaden. Hvis du ikke har det, må du bruke en av våre <a href="https://www.nav.no/start/soknad-barnepensjon">andre søknader om barnepensjon</a>.',
    childApplicantInformation1:
        '<b>Hvis du har mistet en forelder</b>\nNår dødsfallet skyldes en yrkesskade eller yrkessykdom kan du få barnepensjon inntil du blir 21 år hvis du er under utdanning, eller er lærling eller praktikant.',
    childApplicantInformation2:
        '<b>Hvis du har mistet begge foreldrene dine eller farskapet ikke er fastsatt</b>\nDu kan få barnepensjon inntil du blir 20 år hvis du er under utdanning, eller er lærling eller praktikant. Du kan få barnepensjon inntil du blir 21 år hvis dødsfallet i tillegg skyldes en yrkesskade eller yrkessykdom.',
    childApplicantInformationOver18:
        'Har du mistet en eller begge foreldrene dine må du bruke <a href="https://www.nav.no/fyllut/nav180405">denne søknaden</a>.',
    youNeedFnrForEveryoneInThisApplicationSurvivingParent:
        'Du må oppgi hele fødselsnummeret til barnet/barna og avdøde. Hvis ikke du har det, må du bruke en av våre <a href="https://www.nav.no/start/soknad-barnepensjon?stegvalg=1">andre søknader om barnepensjon</a>.',
    aboutSurvivorsPensionTitle: 'Har du mistet ektefellen, samboeren eller partneren din?',
    aboutSurvivorsPensionDescription:
        'Da kan du søke om omstillingsstønad. Hvis du ønsker å søke om barnepensjon samtidig kan du gjøre begge deler i <a href="https://www.nav.no/omstillingsstonad/soknad/">søknad om omstillingsstønad.</a>',
    over18WithoutFnr:
        'Du må oppgi fødselsnummer på alle i søknaden. Hvis du ikke har det, må du bruke en av våre <a href="https://www.nav.no/start/soknad-barnepensjon">andre søknader om barnepensjon.</a>',
    BOTH_PARENTS_DECEASED: 'Begge foreldrene',
    BOTH_PARENTS_DECEASED_CHILD_APPLICANT: 'Jeg er foreldreløs',
    ONE_PARENT_DECEASED: 'En forelder',
}

const selectScenario = {
    whoIsApplying: 'Hvem søker du barnepensjon for?',
    additionalSituationDetails: 'Barnet har mistet',
    additionalSituationDetailsDescription:
        'Hvis barnet har mistet en forelder og den andre forelderen er ukjent, må du velge "Begge foreldrene".',
    additionalSituationDetailsOver18: 'Jeg har mistet',
    additionalSituationDetailsOver18Description: 'Hvis en av foreldrene dine er ukjent, velger du "Begge foreldrene".',
    PARENT: 'Jeg søker for mitt eller mine barn under 18 år',
    GUARDIAN: 'Jeg søker for ett eller flere barn jeg er verge for',
    CHILD: 'Jeg har fylt 18 år og søker på vegne av meg selv',
    parentApplicantInformationLabel: 'Jeg søker for mitt eller mine barn under 18 år',
    parentApplicantInformation:
        'I søknaden må du oppgi alle barn og/eller adoptivbarn under 18 år som du har sammen med avdøde.',
    guardianApplicantInformationLabel: 'Jeg søker for ett eller flere barn jeg er verge for',
    guardianApplicantInformation: 'I søknaden må du oppgi alle avdødes barn og/eller adoptivbarn under 20 år.',
    guardiansMustSendDocumentation:
        'For at vi skal kunne behandle søknaden om barnepensjon må du ettersende dokumentasjon på barn du er verge for.\n\n Du må oppgi fødselsnummer på alle i søknaden. Hvis du ikke har det, må du bruke en av våre <a href="https://www.nav.no/start/soknad-barnepensjon">andre søknader om barnepensjon</a>.',
    childApplicantInformation1:
        '<b>Hvis du har mistet en forelder</b>\nNår dødsfallet skyldes en yrkesskade eller yrkessykdom kan du få barnepensjon inntil du blir 21 år hvis du er under utdanning, eller er lærling eller praktikant.',
    childApplicantInformation2:
        '<b>Hvis du har mistet begge foreldrene dine eller farskapet ikke er fastsatt</b>\nDu kan få barnepensjon inntil du blir 20 år hvis du er under utdanning, eller er lærling eller praktikant. Du kan få barnepensjon inntil du blir 21 år hvis dødsfallet i tillegg skyldes en yrkesskade eller yrkessykdom.',
    childApplicantInformationOver18:
        'Har du mistet en eller begge foreldrene dine må du bruke <a href="https://www.nav.no/fyllut/nav180405">denne søknaden</a>.',
    youNeedFnrForEveryoneInThisApplicationSurvivingParent:
        'Du må oppgi hele fødselsnummeret til barnet/barna og avdøde. Hvis ikke du har det, må du bruke en av våre <a href="https://www.nav.no/start/soknad-barnepensjon?stegvalg=1">andre søknader om barnepensjon</a>.',
    aboutSurvivorsPensionTitle: 'Har du mistet ektefellen, samboeren eller partneren din?',
    aboutSurvivorsPensionDescription:
        'Da kan du søke om omstillingsstønad. Hvis du ønsker å søke om barnepensjon samtidig kan du gjøre begge deler i <a href="https://www.nav.no/omstillingsstonad/soknad/">søknad om omstillingsstønad.</a>',
    over18WithoutFnr:
        'Du må oppgi fødselsnummer på alle i søknaden. Hvis du ikke har det, må du bruke en av våre <a href="https://www.nav.no/start/soknad-barnepensjon">andre søknader om barnepensjon.</a>',
    BOTH_PARENTS_DECEASED: 'Begge foreldrene',
    BOTH_PARENTS_DECEASED_CHILD_APPLICANT: 'Jeg er foreldreløs',
    ONE_PARENT_DECEASED: 'En forelder',
}

const aboutYou = {
    title: 'Om deg',
    titleGuardian: 'Om deg som verge',
    stayWhy:
        'Hvis du oppholder deg i et annet land enn Norge kan det avgjøre om du får gjenlevendepensjon og hvor mye du kan få.',
    addressOfResidenceConfirmed: 'Bor du på denne adressen?',
    alternativeAddress: 'Oppgi nåværende bostedsadresse',
    staysAbroadTitle: 'Opphold utenfor Norge',
    residesInNorway: 'Er du bosatt i Norge?',
    residesInNorwaySummaryQuestion: 'Er du bosatt i et annet land enn Norge?',
    countryOfResidence: 'Oppgi hvilket land du er bosatt i',
    stayedAbroad: 'Har du bodd eller oppholdt deg i utlandet de siste 12 månedene?',
    stayedAbroadCountry: 'Oppgi hvilket land du oppholdt deg i',
    stayedAbroadFromDate: 'Fra dato',
    stayedAbroadToDate: 'Til dato',
    memberFolketrygdenAbroad: 'Er du medlem i folketrygden under opphold i et annet land enn Norge?',
    'subtitle.personalia': 'Personalia',
}

const aboutParents = {
    aboutParentsTitle: 'Om foreldrene',
    unknownParentTitle: 'Ukjent forelder',
    firstParent: 'Forelder 1',
    secondParent: 'Forelder 2',
    survivingParent: 'Gjenlevende forelder',
    deceasedParent: 'Avdød forelder',
    addParentBtn: 'Legg til',
    addSurvivingParentBtn: 'Legg til gjenlevende forelder',
    addDeceasedParentBtn: 'Legg til avdød forelder',
    addFirstParentBtn: 'Legg til forelder 1',
    addSecondParentBtn: 'Legg til forelder 2',
    guardianAndOneParentDeceased:
        'Du trenger ikke fylle ut informasjon om gjenlevende forelder. Vi innhenter denne informasjonen når vi behandler søknaden. \n\n Hvis barnet har mistet én forelder og du ikke vet identiteten til den andre forelderen, må du starte søknadsprosessen på nytt. Velg alternativet "Begge foreldrene".',
    bothParentsRequired:
        'Du må legge til opplysninger om begge foreldrene for å fortsette søknaden. \n\n Hvis barnet har mistet én forelder og du ikke vet identiteten til den andre forelderen, må du starte søknadsprosessen på nytt. Velg alternativet "Begge foreldrene".',
    chooseUnknowParent:
        'Du må legge til opplysninger om begge foreldrene for å fortsette søknaden. \n\n Hvis du ikke kjenner identiteten til den ene forelderen, velger du "Ukjent forelder".',
    childAndOneParentDeceased: 'Du trenger ikke fylle ut informasjon om gjenlevende forelder',
    unknownParent: 'Ukjent forelder',
    unknownParentQuestion: 'Kan du bekrefte at du ikke kjenner identiteten til din forelder?',
    unknownParentQuestionGuardian: 'Kan du bekrefte at du ikke kjenner til identiteten til den avdøde forelderen?',
    childAndOneParentDeceasedGuidepanel:
        'Du trenger ikke fylle ut informasjon om gjenlevende forelder. Vi innhenter denne informasjonen når vi behandler søknaden din. \n\n' +
        'Hvis du har mistet én forelder og den andre er ukjent, må du starte søknadsprosessen på nytt. Velg "Jeg har mistet begge foreldrene".',
    childAndBothParentsDeceasedGuidepanel:
        'Du må legge til opplysninger om begge foreldrene dine for å fortsette søknaden. \n\n Hvis du ikke kjenner identiteten til forelderen din, velger du "Ukjent forelder."',
}

const livingParent = {
    title: 'Om den gjenlevende',
    address: 'Adresse (valgfri)',
}

const aboutTheDeceased = {
    firstParentTitle: 'Om den første forelderen',
    secondParentTitle: 'Om den andre forelderen',
    singleParentTitle: 'Om den avdøde',
    dateOfDeath: 'Når skjedde dødsfallet?',
    phoneNumber: 'Telefonnummer (valgfri)',
    abroadStaysTitle: 'Opphold utenfor Norge',
    workOrLivingAbroadCanAffectPension:
        'Vi trenger å vite om avdøde har bodd eller arbeidet utenfor Norge. Dette kan påvirke beregningen av barnepensjon og i tillegg gi barnet eller barna pensjonsrettigheter fra andre land.',
    workOrLivingAbroadCanAffectPensionOver18:
        'Vi trenger å vite om avdøde har bodd eller arbeidet utenfor Norge. Dette kan påvirke beregningen av barnepensjon og i tillegg gi deg pensjonsrettigheter fra andre land.',
    didTheDeceasedLiveAbroad: 'Har han eller hun bodd og/eller arbeidet i et annet land enn Norge etter fylte 16 år?',
    abroadInWhichCountry: 'Land',
    livedOrWorkedAbroad: 'Bodd og/eller arbeidet?',
    stayedAbroadFromDate: 'Fra dato',
    stayedAbroadToDate: 'Til dato',
    deceasedWasMemberOfFolketrygdenAbroad: 'Var han eller hun medlem av folketrygden under oppholdet?',
    whyWeAskAboutFolketrygden:
        'Vi må vite om avdøde var medlem av folketrygden for å avgjøre rettigheten til barnepensjon.',
    pensionReceivedFromAbroadTitle: 'Pensjon fra utlandet (valgfri)',
    pensionReceivedFromAbroadDescription: 'Oppgi eventuell pensjon han eller hun mottok fra dette landet.',
    pensionWithCurrency: 'Årlig pensjon i landets valuta',
    selfEmploymentTitle: 'Næringsinntekt',
    weNeedToKnowIfDeceasedWasSelfEmployed:
        'Vi henter inn nødvendige opplysninger om avdødes inntekt i Skatteetatens register. Vi har ikke tilgang til opplysninger om næringsinntekt samme år og året før dødsfallet.',
    wasTheDeceasedSelfEmployed: 'Var han eller hun selvstendig næringsdrivende?',
    incomeFromSelfEmployymentYearBeforeDeath: 'Oppgi næringsinntekt fra kalenderåret før dødsfallet (valgfri)',
    incomeFromSelfEmploymentBeforeTaxes: 'Samlet årsinntekt før skatt',
    hadIncomeFromSelfEmployment: 'Hadde han eller hun næringsinntekt når dødsfallet skjedde?',
    occupationalInjury: 'Skyldes dødsfallet yrkesskade eller yrkessykdom?',
    whyWeAskAboutOccupationalInjury:
        'Hvis dødsfallet skyldes yrkesskade eller yrkessykdom godkjent av NAV, kan det avgjøre om barnet/barna får barnepensjon og hvor mye det/de kan få.',
    whyWeAskAboutOccupationalInjuryOver18:
        'Hvis dødsfallet skyldes yrkesskade eller yrkessykdom godkjent av NAV, kan det avgjøre om du får barnepensjon og hvor mye du kan få.',
    BODD: 'Bodd',
    ARBEIDET: 'Arbeidet',
    amountAbroad: 'Årlig beløp',
    addCountryButton: '+ Legg til flere land',
}

const aboutChildren = {
    childAppliedForPension: 'Søker om barnepensjon',
    applyForThisChild: 'Søk om barnepensjon',
    userAppliesForChildrensPension: 'Ja, jeg søker om barnepensjon for barnet',
    onlyChildrenOfDeceasedHaveRights: 'Det er kun avdødes barn og adoptivbarn som kan ha rett til barnepensjon.',
    onlyParentOrGuardianCanApply:
        'Har barnet mistet en forelder så må forelder eller oppnevnt verge sende egen søknad.',
    onlyParentOrGuardianCanApplyOnLivingParent:
        'Det er kun barnets forelder eller oppnevnt verge som kan søke om barnepensjon for dette barnet. Det må søkes om barnepensjon i egen søknad.',
    onlyChildrenUnder18Necessary: 'Du skal kun oppgi barn under 18 år.',
    livesIn: 'Bor i',
    doesTheChildLiveAbroad: 'Bor barnet i et annet land enn Norge?',
    doesTheSiblingLiveAbroad: 'Bor søskenet i et annet land enn Norge?',
    stayAbroadCountry: 'Land',
    addressAbroad: 'Adresse i utlandet',
    guardianLastName: 'Etternavn (valgfri)',
    guardianFirstName: 'Fornavn (valgfri)',
    guardianName: 'Navn på verge',
    childHasGuardian: 'Er det oppnevnt en verge for barnet?',
    guardianFnr: 'Fødselsnummer til verge (valgfri)',
    guardianFnrPlaceholder: '11 siffer',
    information: 'Legg til alle barn under 18 år som du har felles med avdøde.\n\n Barn over 18 år må søke selv.',
    informationGuardian: 'Legg til alle barn du er verge for.',
    infoRegardingSiblings: 'Her er info hvis det er søsken',
    infoCard_residence: 'BOSTED',
    infoCard_fnr: 'FØDSELSNUMMER',
    infoCard_citizenship: 'STATSBORGERSKAP',
    removeChildButton: 'Fjern fra søknad',
    addChildButton: '+ Legg til barn',
    addSiblingButton: '+ Legg til søsken',
    whoAreTheParents: 'Hvem er foreldre til barnet?',
    whoAreTheParentsHelpText:
        'Vi må vite om dette er et barn du har felles med avdøde, avdødes eget barn, eller ditt eget barn.',
    bothOfTheAbove: '{person1} og {person2}',
    remainingParent: 'Gjenlevende forelder',
    remainingParentsChild: 'Jeg',
    jointChild: 'Jeg og {person1}',
    guardianChild: 'Gjenlevende forelder og {person1}',
    relationHelpText:
        'Vi må vite om dette er et barn du har felles med avdøde, avdødes eget barn, eller ditt eget barn.',
    aboutChildrenTitle: 'Om barn',
    titleModal: 'Om barnet',
    aboutTheSiblingTitle: 'Om søskenet',
    aboutSiblingsTitle: 'Om søsken',
    thisIsOptional: 'Dette er valgfritt',
    youAndDeceasedAreTheParents: 'Er du og den avdøde foreldrene til barnet?',
    loggedInUserIsGuardian: 'Er du verge for dette barnet?',
    needToSendInDocumentation:
        'Du må sende inn dokumentasjon på at du er verge for barnet når du har sendt inn søknaden.',
    onlyGuardiansCanApply:
        'Du kan kun søke om barnepensjon for barn du er verge for. \nAlle avdødes barn kan legges til.',
}

const summary = {
    summaryTitle: 'Oppsummering',
    readTheSummaryBeforeSending:
        'Les gjennom oppsummeringen av søknaden før du sender.\nHvis du trenger å gjøre endringer, kan du gå tilbake og gjøre det.',
    sendApplicationButton: 'Send søknad',
    AboutYou: 'Endre svar om deg',
    AboutTheParents: 'Endre svar om foreldre',
    AboutTheDeceased: 'Endre svar om den avdøde',
    AboutChildren: 'Endre svar om barn',
    YourSituation: 'Endre svar om din situasjon',
    errorFromConflict:
        'Vi har allerede mottatt en søknad på et eller flere av barna det søkes for.\n\n' +
        'Dersom du ønsker å endre informasjon på en innsendt søknad må du benytte skjema ' +
        '<a href="https://www.nav.no/soknader/nb/person/diverse/div-dokumentasjon">Diverse dokumentasjon</a>. ' +
        'Det kreves også egne skjema for endring av ' +
        '<a href="https://www.nav.no/start/soknad-endring-bankkontonummer">kontonummer</a> eller ' +
        '<a href="https://www.nav.no/skattetrekk#trekke-mer-skatt">frivillig skattetrekk</a>. ' +
        'Felles for disse er at de må sendes inn pr post.\n\n' +
        'Sender du inn endringer må du gi oss beskjed ved å kontakte oss på telefon <a href="tel:+47 55 55 33 34">55 55 33 34</a>, slik at vi venter med saksbehandlingen av søknaden.',
    errorWhenSending:
        'En feil oppsto ved sending. Vent litt og prøv på nytt. Dersom feilen vedvarer kan du melde feil <a href="https://www.nav.no/person/kontakt-oss/nb/tilbakemeldinger/feil-og-mangler">her.</a>',
    sendApplicationTitle: 'Ønsker du å sende inn søknaden nå?',
    sendingApplicationTitle: 'Sender inn søknad',
    sendApplicationBody: 'Når du har sendt inn søknaden kan du ikke endre på opplysningene som du har lagt inn.',
}

const error = {
    fixTheseErrorsToContinue: 'For å gå videre må du rette opp i dette:',
    'applicantRole.required': 'Oppgi hvem som søker om barnepensjon',
    'applicantSituation.required': 'Du må velge en eller begge foreldrene',
    'abroadStays.hasStaysAbroad.required': 'Oppgi om den avdøde har bodd eller jobbet i et annet land enn Norge',
    'addressOfResidenceConfirmed.required': 'Bostedsadresse må bekreftes/avkreftes',
    'alternativeAddress.required': 'Du må oppgi nåværende bostedsadresse',
    'consent.required': 'Du må bekrefte at du vil gi riktige og fullstendige opplysninger.',
    'citizenship.required': 'Oppgi statsborgerskap',
    'dateOfDeath.required': 'Oppgi når dødsfallet skjedde',
    'firstName.required': 'Oppgi fornavn',
    'firstName.pattern': 'Ugyldig fornavn',
    'fnr.required': 'Oppgi fødselsnummer',
    'fnrDnr.duplicate': 'Duplikat fødselsnummer / d-nummer',
    'fnr.validate': 'Ikke et gyldig fødselsnummer',
    'fnrDnr.required': 'Oppgi fødselsnummer / d-nummer',
    'fnrDnr.validate': 'Ikke et gyldig fødselsnummer',
    'lastName.required': 'Oppgi etternavn',
    'lastName.pattern': 'Ugyldig etternavn',
    'address.required': 'Oppgi adresse',
    'phoneNumber.minLength': 'Telefonnummer er for kort',
    'phoneNumber.pattern': 'Telefonnummer har ugyldig format',
    'children.required': 'Du må søke om barnepensjon for minst ett barn.',
    'children.validate': 'Du må søke om barnepensjon for minst ett barn.',
    'memberFolketrygdenAbroad.required': 'Oppgi om du er medlem i folketrygden under opphold i et annet land enn Norge',
    'occupationalInjury.required': 'Oppgi om dødsfallet skyldes yrkesskade eller yrkessykdom',
    'paymentDetails.taxWithhold.answer.required': 'Oppgi om det ønskes å legge til skattetrekk ',
    'paymentDetails.taxWithhold.taxPercentage.required': 'Oppgi ønsket skattetrekk',
    'paymentDetails.bankAccount.required': 'Norsk kontonummer må fylles ut (11 siffer)',
    'paymentDetails.bankAccount.pattern': 'Kontonummer ikke gyldig. Må bestå av 11 siffer',
    'paymentDetails.accountType.required': 'Du må velge mellom norsk eller utenlandsk bankkonto for utbetaling',
    'paymentDetails.foreignBankName.required': 'Navnet på den utenlandske banken må fylles ut',
    'paymentDetails.foreignBankAddress.required': 'Adressen til den utenlandske banken må fylles ut',
    'paymentDetails.iban.required': 'IBAN-nummer må fylles ut',
    'paymentDetails.iban.validate': 'Ugyldig IBAN-nummer',
    'paymentDetails.swift.required': 'Bankens S.W.I.F.T (BIC) adresse må fylles ut',
    'paymentDetails.swift.validate': 'Ugyldig SWIFT-kode',
    'residesInNorway.required': 'Opphold må besvares',
    'selfEmplyment.wasSelfEmployed.required': 'Oppgi om avdøde var selvstendig næringsdrivende',
    'selfEmplyment.selfEmplymentDetails.income.pattern': 'Oppgi gyldig næringsinntekt (kun siffer)',
    'selfEmplyment.selfEmplymentDetails.incomeAtDeath.required': 'Oppgi om avdøde hadde næringsinntekt',
    'staysAbroad.answer.required': 'Oppgi om barnet er bosatt i et annet land enn Norge',
    'staysAbroad.hasStaysAbroad.required': 'Oppgi om avdøde har hatt opphold utenfor Norge',
    'staysAbroad.abroadStays.type.required': 'Huk av for type opphold',
    'staysAbroad.abroadStays.country.required': 'Oppgi land for opphold',
    'staysAbroad.abroadStays.medlemFolketrygd.required': 'Oppgi om avdøde var medlem av folketryden under oppholdet',
    'staysAbroad.abroadStays.pension.amount.required': 'Oppgi årlig beløp',
    'staysAbroad.abroadStays.pension.currency.required': 'Velg valuta',
    'parents.required': 'Oppgi hvem som er barnets foreldre',
    'loggedInUserIsGuardian.required': 'Oppgi om du er verge for barnet',
    'staysAbroad.country.required': 'Oppgi hvilket land barnet bor i',
    'staysAbroad.address.required': 'Oppgi barnets bostedsadresse',
    'childHasGuardianship.answer.required': 'Oppgi om det er oppnevnt verge for barnet',
    'childHasGuardianship.firstName.pattern': 'Ugyldig fornavn',
    'childHasGuardianship.lastName.pattern': 'Ugyldig etternavn',
    'childHasGuardianship.fnr.validate': 'Ikke et gyldig fødselsnummer',
    'whyDoYouApply.required': 'Oppgi grunnen til at du søker barnepensjon',
    'timeUsedForEducation.required': 'Oppgi hvor mye tid du bruker på utdanning',
    'doYouHaveIncome.required': 'Oppgi om du har lønnsinntekt',
    'countryOfResidence.required': 'Oppgi hvilket land du er bosatt i',
    'stayedAbroad.required': 'Opphold må besvares',
    'stayedAbroadCountry.required': 'Oppgi land',
}

const pageNotFound = {
    title: 'Beklager vi fant ikke siden',
    description: 'Denne siden kan være slettet eller flyttet, eller det er en feil i lenken.',
    'title.english': 'Page not found',
    'description.english.part1': 'The page you requested cannot be found. \n Go to the ',
    'description.english.part2': ', or use one of the links in the menu.',
    'backToFrontpage.english': 'front page',
    backToFrontpage: 'Gå til forsiden',
    'backToFrontpage.href': 'https://nav.no',
    errorInLink: 'Meld gjerne i fra om at lenken ikke virker',
    'errorInLink.href': 'https://www.nav.no/person/kontakt-oss/nb/tilbakemeldinger/feil-og-mangler',
}

const systemUnavailable = {
    title: 'Å nei, søknaden fungerer ikke...',
    description:
        'Vi beklager dette og jobber med å finne ut av feilen så fort som mulig. Ta en liten pause og prøv igjen senere.',
    'feedback.title': 'Opplever du fortsatt feil?',
    'feedback.report': 'Meld fra om feil og mangler',
    'feedback.href': 'https://www.nav.no/person/kontakt-oss/nb/tilbakemeldinger/feil-og-mangler',
    moreAboutBenefits: 'Les mer om rettighetene dine',
    moreAboutBenefitsLink: 'Har mistet noen i nær familie',
    moreAboutBenefitsHref: 'https://www.nav.no/mistet-noen',
    tryAgainButton: 'Prøv igjen',
    'title.english': 'The application form is not currently working',
    'description.english.del1':
        'We are investigating and hope to resolve the issue as quickly as possible. We kindly ask you to take a short break and ',
    'description.english.tryAgain': 'try again',
    'description.english.del2': ' later.',
}

const invalidApplicant = {
    applicantIsTooYoung: 'For å søke om barnepensjon må du være over 18 år.',
    childMayBeApplicableForPension:
        'Barn som har mistet en eller begge foreldrene sine, kan få økonomisk støtte. Barnepensjon skal sikre inntekt til å leve og bo. \n\nFor barn under 18 år er det forelder eller verge som søker om barnepensjon.',
    moreAboutChildrensPension: '<a href="https://www.nav.no/barnepensjon">Mer om barnepensjon</a>',
}

const receipt = {
    pageTitle: 'Søknaden er sendt til oss',
    contact:
        'Vi har mottatt søknaden din om barnepensjon. Saken din er nå til behandling hos NAV. Vi vil ta kontakt med deg hvis vi trenger mer informasjon eller dokumentasjon fra deg.',
    youMustNotifyRegardingChanges: 'Du må melde fra om endringer',
    importantChangesCanAffectYourRights:
        'Du må melde fra med en gang det skjer viktige endringer. Det kan for eksempel være hvis:',
    changeInLivingSituation: 'Endring i bo/familiesituasjon',
    changeAddressOrMoveAbroad: 'Flytting eller opphold i et annet land over tid',
    changeInEduation: 'utdanningssituasjon og/eller arbeidsinntekt',
    moreAboutChanges: 'Du kan lese mer om å ',
    moreAboutChangesLinkHref: 'https://www.nav.no/endringer',
    moreAboutChangesLinkText: 'melde fra om endringer.',
    submissionOfGuardianshipInfo: 'Verge',
    guardianshipMustBeConfirmed:
        'Dersom du har sendt inn søknad som verge må du sende bekreftelse på oppnevnelse av verge fra tingretten eller Statsforvalteren.\n',
    guardianshipMustBeConfirmedLink: 'Skjema for ettersendelse finner du her.',
    guardianshipMustBeConfirmedHref: 'https://www.nav.no/ettersende#barnepensjon',
    viewCaseTitle: 'Sjekke status i saken',
    viewCaseInfoContentPart1:
        'Forelder eller verge kan ikke følge saken til barnet digitalt. Hvis du har spørsmål om søknaden, må du kontakte oss på telefon 55 55 33 34. Lurer du på hvor lang tid behandlingen vil ta? Her kan du se ',
    viewCaseInfoContent2: 'Barn over 18 år kan selv sjekke status i saken sin ved å logge inn i ',
    viewCaseInfoLinkHref2: 'https://www.nav.no/min-side',
    viewCaseInfoLinkText2: 'mitt NAV',
    processingTimeLink: 'forventet saksbehandlingstid.',
    processingTimeHref: 'https://www.nav.no/saksbehandlingstider',
    closeApplicationButton: 'Les mer om barnepensjon',
    closeApplicationButtonHref: 'https://www.nav.no/barnepensjon',
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

const continueApplicationModal = {
    doYouWantToContinueWithTheApplication: 'Ønsker du å fortsette utfyllingen av påbegynt søknad?',
    yesContinueWithApplication: 'Ja, jeg vil fortsette der jeg slapp',
    noRestartApplication: 'Nei, start på nytt',
}

const steps = {
    AboutYou: 'Om deg',
    AboutYouGuardian: 'Om deg som verge',
    AboutTheParents: 'Om foreldrene',
    AboutTheDeceased: 'Om den avdøde',
    YourSituation: 'Din situasjon',
    AboutChildren: 'Opplysninger om barna',
    Summary: 'Oppsummering',
}

const texts: Record<TNamespace, Record<TKey, Translation>> = {
    app,
    aboutChildren,
    aboutTheDeceased,
    aboutYou,
    livingParent,
    aboutParents,
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
