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
    fnrIsUnknown: 'Eg veit ikkje fødselsnummeret (valfritt)',
    fnrIsUnknownHelpText: 'Når du ikkje oppgir fødselsnummeret, tek det lengre tid å behandle søknaden.',
    dateOfBirth: 'Fødselsdato',
    address: 'Bustadsadresse',
    maritalStatus: 'Sivilstatus',
    citizenship: 'Statsborgarskap',
    phoneNumber: 'Telefonnummer',
    phoneNumberOptional: 'Telefonnummer (valfri)',
    phoneNumberHelpText: 'Telefonnummeret er henta frå Kontakt- og reservasjonsregisteret.',
    dateFormat: '(dd.mm.åååå)',
    dateExample: 'eks. 01.11.2020',
    dateSRLabel: 'Oppgi dato',
    chooseCountry: 'Vel land',
    chooseLanguage: 'Vel språk',
    chooseCurrency: 'Vel valuta',
    norway: 'Noreg',
    optional: 'valfri',
    noSensitiveData: 'Ikkje oppgi sensitive personopplysningar.',
    counterLeft: 'teikn att',
    counterTooMuch: 'teikn for mykje',
    whyWeAsk: 'Kvifor spør vi om dette?',
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
    saveChangesButton: 'Lagre endring',
    addButton: 'Legg til',
    cancelButton: 'Avbryt',
    removeButton: 'Fjern',
    deleteButton: 'Slette',
    editButton: 'Endre',
    continueButton: 'Fortsett',
    yesButton: 'Ja, send søknad',
    noButton: 'Nei, gå tilbake',
    yesUnknownParent: 'Ja, forelderen min er ukjend',
    yesUnknownParentGuardian: 'Ja, forelderen er ukjend',
    noUnknownParent: 'Nei, eg veit kven foreldra mine er',
    noUnknownParentGuardian: 'Nei, eg kjenner identiteten til begge foreldra',
}

const loggedInUserInfo = {
    incorrectInfoMustBeCorrected:
        'Viss opplysingane vi har om deg ikkje stemmer, må du endre desse hos Folkeregisteret. \n',
    incorrectInfoMustBeCorrectedHref: 'https://www.skatteetaten.no/nn/skjema/opplysninger-i-folkeregisteret/',
    incorrectInfoMustBeCorrectedHrefText: 'Endre opplysningane dine',
}

const paymentDetails = {
    title: 'Oppgi bankopplysingar',
    NORSK: 'Norsk',
    UTENLANDSK: 'Utanlandsk',
    KRONER: 'Kroner',
    PROSENT: 'Prosent',
    bankAccount: 'Oppgi norsk kontonummer for utbetaling av barnepensjon',
    bankAccountDescription: 'Du kan leggje til eit eige kontonummer for barnet',
    information: 'Du kan legge til eit eige kontonummer for barnet.',
    accountType: 'Ønsker du å motta utbetalinga på norsk eller utanlandsk bankkonto?',
    foreignBankName: 'Bankens namn',
    foreignBankAddress: 'Bankens fulle adresse',
    iban: 'IBAN-nummer',
    ibanHelpText: 'IBAN står for International Bank Account Number og er ein internasjonal standard for kontonummer.',
    swift: 'Bankens S.W.I.F.T (BIC) adresse',
    swiftHelpText:
        'BIC står for Bank Identifier Code, og er den koden som identifiserer banken. BIC kallast også SWIFT, og er påkrevd ved betaling til ei rekke land.',
}

const radiobuttons = {
    JA: 'Ja',
    NEI: 'Nei',
    VET_IKKE: 'Veit ikkje',
}

const frontPage = {
    frontPageTitle: 'Søk om barnepensjon',
    ingress:
        'Hei, eg er her for å rettleie deg gjennom søknaden. Svar så godt du kan ut frå korleis situasjonen din ser ut per i dag, så kan du melde frå om eventuelle endringar seinare.\n\n Vi lagrar svara i søknaden undervegs, så du kan trygt ta pausar og kome tilbake for å endre dei. Ver merksam på at svara dine berre blir lagra i 72 timar.',
    startApplication: 'Start søknad',
    childMayBeApplicableForPension:
        'Barn under 20 år som har mista ein eller begge foreldra sine, kan få barnepensjon.',
    childMayBeApplicableForPension_li1:
        'Det er foreldra eller verjen til barnet som må søke om barnepensjon for barnet viss det er under 18 år.',
    childMayBeApplicableForPension_li2:
        'Som verje kan du berre sende søknad for barn du er verje for. Du kan også søkje for personar over 18 år.',
    childMayBeApplicableForPension_li3: 'Barn over 18 år må søkje sjølve.',
    readMoreAboutChildrensPension:
        'Dersom du har spørsmål om pensjonen, til dømes kor mykje du kan få, eller kva reglar som gjeld for skatt, kan du du <a href="https://www.nav.no/barnepensjon">lese meir om barnepensjon</a>.',
    weWillRetrieveInfoTitle: 'Behandling av personopplysningar i søknaden',
    howWeProcessDataTitle: 'Korleis vi behandlar personopplysningar',
    howWeProcessDataContentParent:
        'Når du sender inn ein søknad om yting, vil Nav hente inn og behandle personopplysningar om den som søkjer om ytinga. Når du sender inn ein søknad om yting på vegner av barnet ditt, vil vi hente inn og behandle opplysningar om barnet. Dette er nødvendig for at den du søkjer på vegner av, skal få gode tenester og ytingane som vedkomande har rett på, og for at Nav skal kunne innfri plikta etter folketrygdlova kapittel 18 til å bidra til økonomisk tryggleik ved dødsfall.',
    howWeProcessDataContentGuardian:
        'Når du sender inn ein søknad om yting, vil Nav hente inn og behandle personopplysningar om den som søkjer om ytinga. Når du sender inn ein søknad om yting på vegner av eit barn du er verje for, vil vi hente inn og behandle opplysningar om barnet. Dette er nødvendig for at den du søkjer på vegner av, skal få gode tenester og ytingane som vedkomande har rett på, og for at Nav skal kunne innfri plikta etter folketrygdlova kapittel 18 til å bidra til økonomisk tryggleik ved dødsfall.',
    howWeProcessDataContentChild:
        'Når du sender inn ein søknad om yting, vil Nav hente inn og behandle personopplysningar om deg. Dette er nødvendig både for at du skal få gode tenester og ytingane du har rett på, og for at Nav skal kunne innfri plikta etter folketrygdlova kapittel 18 til å bidra til økonomisk tryggleik ved dødsfall.',
    collectAndProcessTitle: 'Vi samlar inn og behandlar personopplysningar for å',
    collectAndProcess_li1_parent: 'identifisere og kommunisere med deg som søkjer på vegner av barnet',
    collectAndProcess_li1_guardian: 'identifisere og kommunisere med deg som er representant for søkjar',
    collectAndProcess_li1_child: 'identifisere og kommunisere med deg som søkjer',
    collectAndProcess_li2: 'behandle søknaden',
    collectAndProcess_li2_child: 'behandle søknaden din',
    collectAndProcess_li3: 'betale ut ytinga',
    weWillRetrieveInfo: 'Vi hentar inn informasjonen vi treng',
    infoWeRetrieve_parent:
        'For å behandle søknaden om barnepensjon hentar vi inn opplysningar om deg som søkjer på vegner av barnet/barna, og tredjepersonar som er relevante for søknaden. Relevante tredjepersonar kan vere ei verje som har rett til å representere barnet/barna overfor Nav. \n\nI tillegg til informasjonen du gir oss om barnet/barna via søknadsdialogen, kan vi hente inn',
    infoWeRetrieve_guardian:
        'For å behandle søknaden din hentar vi inn opplysningar om deg som søkjer, og tredjepersonar som er relevante for søknaden din. Relevante tredjepersonar kan vere attlevande forelder. \n\nI tillegg til informasjonen du gir oss om barnet/barna via søknadsdialogen, kan vi hente inn',
    infoWeRetrieve_child:
        'For å behandle søknaden din hentar vi inn opplysningar om deg som søkjer, og om tredjepersonar som er relevante for søknaden din. Relevante tredjepersonar kan vere ein attlevande forelder eller verje som har rett til å representere deg overfor Nav. \n\nI tillegg til informasjonen du gir oss gjennom søknadsdialogen, kan vi hente inn følgjande',
    infoWeRetrieve_li1: 'personopplysningar frå Folkeregisteret (personnummer, adresse og statsborgarskap)',
    infoWeRetrieve_li2: 'opplysningar om anna fortløpande støtte frå Nav (periodar med mottak av uføretrygd)',
    infoWeRetrieve_li3: 'informasjon frå utanlandske trygdemakter (der dette er aktuelt)',
    infoWeRetrieve_li4: 'opplysningar om straffegjennomføring og opphald på institusjon',
    survivingParentInfo_parent:
        'Når du sender inn ein søknad om yting på vegner av barnet ditt, hentar vi inn følgjande informasjon om deg',
    survivingParentInfo_guardian:
        'Når du sender inn ein søknad om yting på vegner av eit barn du er verje for, hentar vi inn følgjande informasjon om attlevande forelder',
    survivingParentInfo_child:
        'Når du søkjer om barnepensjon, hentar Nav inn informasjon om eventuell attlevande forelder. Vi hentar då inn',
    survivingParentInfo_li1: 'namn',
    survivingParentInfo_li2: 'fødselsnummer',
    survivingParentInfo_li3: 'adresse',
    survivingParentInfo_li4: 'medlemskap i Folketrygda (der dette er nødvendig)',
    survivingParentInfo_li5: 'informasjon frå utanlandske trygdemakter (der dette er aktuelt)',
    disclosureOfInformationTitle: 'Utlevering av opplysningar',
    disclosureOfInformationTitle_child: 'Utlevering av opplysningane dine',
    disclosureOfInformationContent:
        'I samband med behandlinga av søknaden om omstillingsstønad utleverer vi enkelte personopplysningar til andre mottakarar. Utleveringa skjer som oftast i tilknyting til innhenting av opplysningar for å dokumentere at Nav har lov til å samle inn informasjon om identifiserte enkeltpersonar. For søkjarar med utanlandsk tilknyting kan det i tillegg bli utlevert informasjon til trygdemakter i andre land.',
    durationDataIsStoredTitle: 'Kor lenge opplysningane dine blir lagra',
    durationDataIsStoredContent:
        'Personopplysningane blir i tråd med føresegnene i økonomiregelverket lagra i 10 år etter siste utbetaling.',
    automaticProcessingTitle: 'Automatisk saksbehandling',
    automaticProcessingContent1:
        'Stort sett all behandling av personopplysningar i samband med omstillingsstønad blir gjort manuelt. Det vil seie at det er ein saksbehandlar som ser på og behandlar saka.',
    automaticProcessingContent1_child:
        'Stort sett all behandling av personopplysningar i samband med barnepensjon blir gjort manuelt. Det vil seie at det er ein saksbehandlar som ser på og behandlar saka di.',
    automaticProcessingContent2:
        'I visse tilfelle vil saka bli behandla automatisk. Ved ei fortløpande yting der <a href="https://www.nav.no/grunnbelopet">grunnbeløpet i folketrygda</a> blir nytta som utrekningsgrunnlag (t.d. barnepensjon), vil systemet automatisk endre utbetalinga ut frå endringar i grunnbeløpet. Dette for å sikre at utbetalinga av ytingar går effektivt.',
    automaticProcessingContent2_child:
        'I visse tilfelle vil saka bli behandla automatisk. Ved ei fortløpande yting der <a href="https://www.nav.no/grunnbelopet">grunnbeløpet i folketrygda</a> blir nytta som utrekningsgrunnlag (t.d. barnepensjon), vil systemet automatisk endre utbetalinga di ut frå endringar i grunnbeløpet. Dette for å sikre at utbetalinga av ytingar går effektivt.',
    automaticProcessingContent3:
        'Dette inneber at stønaden blir endra automatisk i tråd med den årlege justeringa av grunnbeløpet. Når stønaden blir justert automatisk, er det ikkje ein saksbehandlar som har behandla endringa.',
    automaticProcessingContent3_child:
        'For deg inneber dette at stønaden din blir endra automatisk i tråd med den årlege justeringa av grunnbeløpet. Når stønaden din blir justert automatisk, er det ikkje ein saksbehandlar som har behandla endringa.',
    automaticProcessingContent4: 'For å gjennomføre grunnbeløpsregulering blir det nytta følgjande opplysningar',
    automaticProcessingContent_li1: 'personnummer',
    automaticProcessingContent_li2: 'saks-ID',
    automaticProcessingContent_li3: 'type yting',
    automaticProcessingContent_li4: 'gjeldande vedtak',
    automaticProcessingContent5: 'Endringane blir gjort i saksbehandlingssystemet.',
    aboutPrivacyTitle: 'Personvernerklæringa i Nav',
    aboutPrivacy:
        'Du kan lese meir om korleis Nav behandlar personopplysningar i <a target="_blank" href="https://www.nav.no/personvern">Arbeids- og velferdsetatens personvernerklæring</a> (blir opna i ny fane).',
    consentTitle: 'Vi stoler på deg',
    consentDescription: 'Du må gi oss riktige opplysingar for at vi skal kunne behandle søknaden.\n\n',
    consentToNav: 'Eg bekreftar at eg vil gi riktige og fullstendige opplysingar.',
    whoIsApplying: 'Kven søker du barnepensjon for?',
    additionalSituationDetails: 'Barnet har mista',
    additionalSituationDetailsDescription:
        'Dersom barnet har mista éin forelder og den andre forelderen er ukjend, vel du "Begge foreldra".',
    additionalSituationDetailsOver18: 'Eg har mista',
    additionalSituationDetailsOver18Description: 'Viss den eine forelderen din er ukjend, vel du "Begge foreldra".',
    PARENT: 'Eg søker for mitt eller mine barn under 18 år',
    GUARDIAN: 'Eg søker for eitt eller fleire barn eg er verje for',
    CHILD: 'Eg har fylt 18 år og søker på vegne av meg sjølv',
    parentApplicantInformationLabel: 'Eg søker for mitt eller mine barn under 18 år',
    parentApplicantInformation:
        'I søknaden må du oppgi alle barn og/eller adoptivbarn under 18 år som du har saman med avdøde.',
    guardianApplicantInformationLabel: 'Eg søker for eitt eller fleire barn eg er verje for',
    guardianApplicantInformation: 'I søknaden må du oppgi alle barn og/eller adoptivbarn som avdøde hadde under 20 år.',
    guardiansMustSendDocumentation:
        'For at vi skal kunne behandle søknaden om barnepensjon, må du ettersende dokumentasjon på barn du er verje for.',
    childApplicantInformation1:
        '<b>Viss du har mista ein forelder</b>\nNår dødsfallet skuldast ein yrkesskade eller yrkessjukdom kan du få barnepensjon inntil du blir 21 år hvis du er under utdanning, eller er lærling eller praktikant.',
    childApplicantInformation2:
        '<b>Viss du har mista begge foreldra dine eller farskapet ikkje er fastsatt må du bruke</b>\nDu kan få barnepensjon inntil du blir 20 år viss du er under utdanning, eller er lærling eller praktikant. Du kan få barnepensjon inntil du blir 21 år viss dødsfallet i tillegg skuldast ein yrkesskade eller yrkessjukdom.',
    childApplicantInformationOver18:
        'Har du mista ein eller begge foreldra dine må du bruke <a href="https://www.nav.no/fyllut/nav180405?lang=nn-NO">denne søknaden</a>.',
    fnrOrBirthdateRequired:
        'Du må leggje inn fødselsnummer eller fødselsdato for alle i søknaden. Behandlinga av søknaden går raskare viss du legg inn fødselsnummer.',
    aboutSurvivorsPensionTitle: 'Har du mista ektefellen, sambuaren eller partnaren din?',
    aboutSurvivorsPensionDescription:
        'Då kan du søkje om omstillingsstønad. Dersom du ønskjer å samstundes søkje om barnepensjon, kan du gjere begge delar i <a href="https://www.nav.no/omstillingsstonad/soknad/">søknad om omstillingsstønad.</a>',
    BOTH_PARENTS_DECEASED: 'Begge foreldra',
    BOTH_PARENTS_DECEASED_CHILD_APPLICANT: 'Eg er foreldrelaus',
    ONE_PARENT_DECEASED: 'Ein forelder',
}

const aboutYou = {
    title: 'Om deg',
    titleGuardian: 'Om deg som verje',
    stayWhy:
        'Dersom du oppheld deg i eit anna land enn Noreg, kan det avgjere om og eventuelt kor mykje du kan få i barnepensjon.',
    addressOfResidenceConfirmed: 'Bur du på denne adressa?',
    alternativeAddress: 'Oppgi noverande bustadsadresse',
    staysAbroadTitle: 'Opphald utanfor Noreg',
    residesInNorway: 'Er du busett i Noreg?',
    residesInNorwaySummaryQuestion: 'Er du busett i eit anna land enn Noreg?',
    stayedAbroad: 'Har du budd eller opphalde deg i utlandet dei siste 12 månadene?',
    stayedAbroadCountry: 'Oppgi hvilket land du oppheldt deg i',
    stayedAbroadFromDate: 'Frå dato',
    stayedAbroadToDate: 'Til dato',
    countryOfResidence: 'Oppgi kva land du er busett i',
    memberFolketrygdenAbroad: 'Er du medlem i folketrygda under opphald i eit anna land enn Noreg?',
    'subtitle.personalia': 'Personalia',
    disabilityBenefits: 'Får du uføretrygd?',
    disabilityBenefitsInfo:
        'Dersom du får både uføretrygd og barnepensjon, vil barnepensjonen bli trekt krone for krone for uføretrygda.',
    workAssessmentAllowance: 'Får du arbeidsavklaringspengar (AAP)?',
    workAssessmentAllowanceInfo:
        'Dersom du får både arbeidsavklaringspengar (AAP) og barnepensjon, vil arbeidsavklaringspengane bli trekte krone for krone for barnepensjonen.',
    paymentsFromNav: 'Utbetalingar frå Nav',
    bankAccountNumberAndPayment: 'Kontonummer og utbetaling',
}

const aboutParents = {
    aboutParentsTitle: 'Om foreldra',
    unknownParentTitle: 'Ukjend forelder',
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
        'Du må leggje til opplysningar om begge foreldra dine for å gå vidare med søknaden. \n\n Dersom barnet har mista mor si og farskapet ikkje er avklart, vel du alternativet «Eg har mista begge foreldra».',
    chooseUnknowParent:
        'Du må leggje til opplysningar om begge foreldra for å gå vidare med søknaden. \n\n Dersom du ikkje kjenner identiteten til den eine forelderen, vel du "Ukjend forelder".',
    childAndOneParentDeceased: 'Du treng ikkje fylle ut informasjon om attlevande forelder',
    unknownParent: 'Ukjend forelder',
    unknownParentQuestion: 'Kan du stadfeste at du ikkje kjenner identiteten til forelderen din?',
    unknownParentQuestionGuardian: 'Kan du stadfeste at du ikkje kjenner identiteten til den avdøde forelderen?',
    childAndOneParentDeceasedGuidepanel:
        'Du treng ikkje fylle ut informasjon om attlevande forelder. Vi innhentar denne informasjonen når vi behandlar søknaden din. \n\n Dersom du har mista éin forelder og den andre er ukjend, må du starte søknadsprosessen på nytt. Vel "Eg har mista begge foreldra".',
    childAndBothParentsDeceasedGuidepanel:
        'Du må leggje til opplysningar om begge foreldra dine for å gå vidare med søknaden. \n\n Dersom du ikkje kjenner identiteten til forelderen din, vel du «Ukjend forelder».',
    guardianAndOneParentDeceased:
        'Du treng ikkje fylle ut informasjon om attlevande forelder. Vi innhentar denne informasjonen når vi behandlar søknaden. \n\n Dersom barnet har mista éin forelder og du ikkje veit identiteten til den andre forelderen, må du starte søknadsprosessen på nytt. Vel alternativet "Begge foreldra".',
    missingInformation: 'Mangler informasjon',
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
    abroadStaysTitle: 'Opphald utanfor Noreg',
    workOrLivingAbroadCanAffectPension:
        'Vi treng å vite dette for å berekne riktig barnepensjon og for å vurdere om barnet/barna har rettar frå andre land.',
    workOrLivingAbroadCanAffectPensionOver18:
        'Vi treng å vite dette for å berekne riktig barnepensjon og for å vurdere om du har rettar frå andre land.',
    didTheDeceasedLiveAbroad: 'Har han eller ho budd og/eller arbeidd i utlandet etter fylte 16 år?',
    abroadInWhichCountry: 'Land',
    livedOrWorkedAbroad: 'Budd og/eller arbeidd?',
    stayedAbroadFromDate: 'Frå dato',
    stayedAbroadToDate: 'Til dato',
    deceasedWasMemberOfFolketrygdenAbroad: 'Var han eller ho medlem av folketrygda under opphaldet?',
    whyWeAskAboutFolketrygden: 'Vi må vite om avdøde var medlem av folketrygda for å avgjere retten til barnepensjon.',
    pensionReceivedFromAbroadTitle: 'Pensjon frå utlandet (valfri)',
    pensionReceivedFromAbroadDescription: 'Oppgi eventuell pensjon han eller ho fekk frå dette landet.',
    pensionWithCurrency: 'Årleg pensjon i valutaen til landet',
    occupationalInjuryTitle: 'Yrkesskade eller yrkessjukdom',
    occupationalInjury: 'Skuldast dødsfallet yrkesskade eller yrkessjukdom?',
    whyWeAskAboutOccupationalInjury:
        'Viss dødsfallet skuldast yrkesskade eller yrkessjukdom godkjent av Nav, kan det avgjere om barnet/barna får barnepensjon og kor mykje det/dei kan få.',
    whyWeAskAboutOccupationalInjuryOver18:
        'Dersom dødsfallet skuldast yrkesskade eller yrkessjukdom som Nav har godkjent, kan det avgjere om og eventuelt kor mykje du kan få i barnepensjon.',
    BODD: 'Budd',
    ARBEIDET: 'Arbeidd',
    amountAbroad: 'Årleg beløp',
    addCountryButton: '+ Legg til fleire land',
}

const aboutChildren = {
    childAppliedForPension: 'Søker om barnepensjon',
    childNotApplyingForPension: 'Søker ikkje om barnepensjon',
    applyForThisChild: 'Søk om barnepensjon',
    userAppliesForChildrensPension: 'Ja, eg søker om barnepensjon for barnet',
    onlyChildrenOfDeceasedHaveRights: 'Det er berre avdødes barn og adoptivbarn som kan ha rett til barnepensjon.',
    onlyParentOrGuardianCanApply:
        'Har barnet mista ein forelder så må forelder eller oppnemnt verje sende eigen søknad.',
    onlyParentOrGuardianCanApplyOnLivingParent:
        'Det er berre barnets forelder eller oppnemnt verje som kan søke om barnepensjon for dette barnet. Det må søkast om barnepensjon i eigen søknad.',
    onlyChildrenUnder18Necessary: 'Du skal kun oppgi barn under 18 år. Barn over 18 år må søkje sjølve.',
    livesIn: 'Bur i',
    doesTheChildLiveAbroad: 'Bur barnet i eit anna land enn Noreg?',
    doesTheSiblingLiveAbroad: 'Bur søskenet i eit anna land enn Noreg?',
    stayAbroadCountry: 'Land',
    addressAbroad: 'Adresse i utlandet',
    guardianLastName: 'Etternamn (valfri)',
    guardianFirstName: 'Fornamn (valfri)',
    guardianName: 'Namn på verje',
    childHasGuardian: 'Er det oppnemnt en verje for barnet?',
    guardianFnr: 'Fødselsnummer til verje (valgfri)',
    guardianFnrPlaceholder: '11 siffer',
    information: 'Legg til alle barn under 18 år som du har felles med avdøde.\n\n Barn over 18 år må søkje sjølve.',
    informationGuardian: 'Legg til alle barn du er verje for.',
    infoRegardingSiblings: 'Her er info viss det er søsken',
    infoCard_residence: 'BUSTAD',
    infoCard_fnr: 'FØDSELSNUMMER',
    infoCard_dob: 'FØDSELSDATO',
    infoCard_citizenship: 'STATSBORGARSKAP',
    removeChildButton: 'Fjern fra søknad',
    addChildButton: '+ Legg til barn',
    addSiblingButton: '+ Legg til søsken',
    whoAreTheParents: 'Kven er foreldre til barnet?',
    whoAreTheParentsHelpText:
        'Vi må vite om dette er eit barn du har felles med avdøde, avdøde sitt eige barn, eller ditt eiget barn.',
    bothOfTheAbove: '{person1} og {person2}',
    remainingParent: 'Attlevande forelder',
    remainingParentsChild: 'Eg',
    jointChild: 'Eg og {person1}',
    guardianChild: 'Attlevande forelder og {person1}',
    relationHelpText:
        'Vi må vite om dette er eit barn du har felles med avdøde, avdøde sitt eige barn, eller ditt eige barn.',
    aboutChildrenTitle: 'Om barn',
    titleModal: 'Om barnet',
    aboutTheSiblingTitle: 'Om søskenet',
    aboutSiblingsTitle: 'Om søsken',
    thisIsOptional: 'Dette er valfritt',
    youAndDeceasedAreTheParents: 'Er du og den avdøde foreldra til barnet?',
    loggedInUserIsGuardian: 'Er du verje for dette barnet?',
    needToSendInDocumentation:
        'Når du har sendt inn søknaden, må du sende inn dokumentasjon på at du er verje for barnet.',
    onlyGuardiansCanApply:
        'Du kan berre søke om barnepensjon for barn du er verje for. \nAlle avdøde sine barn kan leggjast til.',
    disabilityBenefitsIsGuardian: 'Får barnet uføretrygd?',
    disabilityBenefitsInfo:
        'Dersom barnet får både uføretrygd og barnepensjon, vil barnepensjonen bli trekt krone for krone for uføretrygda.',
    workAssessmentAllowanceIsGuardian: 'Får barnet arbeidsavklaringspengar (AAP)?',
    workAssessmentAllowanceInfo:
        'Dersom barnet får både arbeidsavklaringspengar (AAP) og barnepensjon, vil arbeidsavklaringspengane bli trekte krone for krone for barnepensjonen.',
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
    errorFromConflict:
        'Vi har allereie fått ein søknad på eitt eller fleire av barna det blir søkt for.\n\n' +
        'Dersom du ønskjer å endre informasjon på ein innsend søknad, nyttar du skjemaet ' +
        '<a href="https://www.nav.no/soknader/nb/person/diverse/div-dokumentasjon">Diverse dokumentasjon</a>. ' +
        'Eige skjema må også fyllast ut ved endring av <a href="https://www.nav.no/start/soknad-endring-bankkontonummer/nn">kontonummer</a>. ' +
        'Dette må sendast inn per post.\n\n Viss du sender inn endringar, må du gi oss beskjed ' +
        'ved å ringje oss på telefon <a href="tel:+47 55 55 33 34">55 55 33 34</a>, slik at vi ventar med å behandle søknaden.',
    errorWhenSending:
        'Ein feil oppstod ved sending. Vent litt og prøv på nytt. Dersom feilen varer kan du melde feil <a href="https://www.nav.no/person/kontakt-oss/nn/tilbakemeldinger/feil-og-mangler">her.</a>',
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
    'consent.required': 'Du må bekrefta at du vil gi riktige og fullstendige opplysingar.',
    'dateOfBirth.required': 'Oppgi fødselsdatoen',
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
    'children.required': 'For å sende inn søknaden må du søkje om barnepensjon for minst eitt barn.',
    'children.validate':
        'For å sende inn søknaden må du søkje om barnepensjon for minst eitt barn. Du kan endre utfyllinga ved å klikke på «endre» ved sida av barnet du ønskjer å søkje for.',
    'memberFolketrygdenAbroad.required': 'Oppgi om du er medlem i folketrygda under opphald i eit anna land enn Noreg',
    'occupationalInjury.required': 'Oppgi om dødsfallet skuldast yrkesskade eller yrkessjukdom',
    'paymentDetails.bankAccount.required': 'Norsk kontonummer må fyllast ut (11 siffer)',
    'paymentDetails.bankAccount.pattern': 'Kontonummer ikkje gyldig. Må bestå av 11 siffer',
    'paymentDetails.accountType.required': 'Du må velja mellom norsk eller utanlandsk bankkonto for utbetaling',
    'paymentDetails.foreignBankName.required': 'Namnet på den utanlandske banken må fyllast ut',
    'paymentDetails.foreignBankAddress.required': 'Adressa til den utanlandske banken må fyllast ut',
    'paymentDetails.iban.required': 'IBAN-nummer må fyllast ut',
    'paymentDetails.iban.validate': 'Ugyldig IBAN-nummer',
    'paymentDetails.swift.required': 'Bankens S.W.I.F.T (BIC) adresse må fyllast ut',
    'paymentDetails.swift.validate': 'Ugyldig SWIFT-kode',
    'staysAbroad.answer.required': 'Oppgi om barnet er busatt i eit anna land enn Noreg',
    'staysAbroad.hasStaysAbroad.required': 'Oppgi om avdøde har hatt opphald utanfor Noreg',
    'staysAbroad.abroadStays.type.required': 'Huk av for type opphald',
    'staysAbroad.abroadStays.country.required': 'Oppgi land for opphald',
    'staysAbroad.abroadStays.medlemFolketrygd.required': 'Oppgi om avdøde var medlem av folketrygda under opphaldet',
    'staysAbroad.abroadStays.pension.amount.required': 'Oppgi årleg beløp',
    'staysAbroad.abroadStays.pension.currency.required': 'Vel valuta',
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
    'residesInNorway.required': 'Opphald må svarast på',
    'countryOfResidence.required': 'Oppgi land',
    'stayedAbroad.required': 'Opphald i utland må svarast på',
    'stayedAbroadCountry.required': 'Oppgi noverande opphaldsland',
    'disabilityBenefits.required': 'Oppgi om du får uføretrygd',
    'disabilityBenefitsIsGuardian.required': 'Oppgi om barnet får uføretrygd',
    'workAssessmentAllowance.required': 'Oppgi om du får arbeidsavklaringspengar (AAP)',
    'workAssessmentAllowanceIsGuardian.required': 'Oppgi om barnet får arbeidsavklaringspengar (AAP)',
    'deceasedParentOne.required': 'Du må fylle ut informasjon om den første forelderen',
    'deceasedParentTwo.required': 'Du må fylle ut informasjon om den andre forelderen',
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
    applicantIsTooYoung: 'For å søke om barnepensjon må du vere over 18 år.',
    childMayBeApplicableForPension: 'Det er forelder eller verje som søkjer om barnepensjon på vegner av deg.',
    moreAboutChildrensPensionHref: 'https://www.nav.no/barnepensjon',
    moreAboutChildrensPension: 'Les meir om barnepensjon',
}

const receipt = {
    pageTitle: 'Søknaden er sendt til oss',
    contact:
        'Vi har fått søknaden din om barnepensjon. Saka di er no til behandling hos Nav. Vi vil kontakte deg dersom vi treng meir informasjon eller dokumentasjon frå deg.',
    youMustNotifyRegardingChanges: 'Du må melde frå om endringar',
    importantChangesCanAffectYourRights:
        'Du må melde frå med ein gong det skjer viktige endringar. Det kan til dømes vera ved:',
    changeInLivingSituation: 'Endring i bu/familiesituasjon',
    changeAddressOrMoveAbroad: 'Flytting eller opphald i eit anna land over tid',
    changeInEduation: 'utdanningssituasjon og/eller arbeidsinntekt',
    moreAboutChanges: 'Du kan lese meir om å ',
    moreAboutChangesLinkHref: 'https://www.nav.no/endringer/nn',
    moreAboutChangesLinkText: 'melde frå om endringar.',
    submissionOfGuardianshipInfo: 'Verje',
    guardianshipMustBeConfirmed:
        'Dersom du har sendt inn søknad som verje må du sende bekreftelse på utnevning av verje frå tingretten eller Statsforvalteren.',
    guardianshipMustBeConfirmedLink: 'Du finn skjemaet for ettersending her.',
    guardianshipMustBeConfirmedHref: 'https://www.nav.no/ettersende/nn',
    viewCaseTitle: 'Sjekke status i saken',
    viewCaseInfoContentPart1:
        'Forelder eller verje kan ikkje følgje saka til barnet digitalt. Dersom du har spørsmål om søknaden, kontaktar du oss på telefon 55 55 33 34. Lurer du på kor lang tid behandlinga vil ta? Her kan du sjå ',
    viewCaseInfoContent2: 'Barn over 18 år kan sjølv sjekke status i saka si ved å logge inn i ',
    viewCaseInfoLinkHref2: 'https://www.nav.no/min-side',
    viewCaseInfoLinkText2: 'mitt Nav',
    processingTimeLink: 'forventa saksbehandlingstid.',
    processingTimeHref: 'https://www.nav.no/saksbehandlingstider/nn',
    closeApplicationButton: 'Les meir om barnepensjon',
    closeApplicationButtonHref: 'https://www.nav.no/barnepensjon',
    taxDeductionTitle: 'Skattetrekk',
    taxDeductionDescription1: 'Vi trekkjer 17 prosent av barnepensjonen din.',
    taxDeductionDescription2:
        'Dersom du bur i utlandet og har avgrensa skatteplikt til Noreg, kan du søkje Skatteetaten om skattefritak. For at vi ikkje skal trekkje skatt, må du sende oss vedtak om fritak.',
    taxDeductionLinkText: 'Du kan lese meir om skatt på barnepensjon på nav.no',
    taxDeductionLinkHref: 'https://www.nav.no/barnepensjon#skattetrekk',
    taxDeductionDescription3: 'Dersom du har spørsmål om skatt og skattetrekk, kan du kontakte Skatteetaten.',
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
    AboutYouGuardian: 'Om deg som verje',
    AboutTheParents: 'Om foreldra',
    AboutTheDeceased: 'Om den avdøde',
    YourSituation: 'Din situasjon',
    AboutChildren: 'Opplysningar om barna',
    Summary: 'Oppsummering',
    Step: 'Steg {activePage} av {totalPages}',
    showAllSteps: 'Vis alle steig',
    hideAllSteps: 'Skjul alle steig',
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
    pageNotFound,
    systemUnavailable,
    invalidApplicant,
    summary,
    receipt,
    yourSituation,
    continueApplicationModal,
}

export default texts
