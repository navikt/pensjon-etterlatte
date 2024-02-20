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
    dateFormat: '(dd.mm.åååå)',
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
    doYouWantUsToWithholdTax: 'Ønsker du at vi legg inn eit skattetrekk for barnepensjonen?',
    childPensionIsTaxable:
        'Barnepensjon er skattepliktig, men vi trekkjer ikkje skatt av beløpet utan at vi får beskjed om det. Dersom du har spørsmål om kor stort skattetrekket vil vere, må du kontakte Skatteetaten.',
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
    howWeProcessDataTitle: 'Slik behandlar NAV personopplysningane dine',
    howWeProcessDataContent:
        'Når du sender inn ein søknad om yting, vil NAV hente inn og behandle personopplysningar om den som søkjer om ytinga. Dersom du sender inn ein søknad om yting på vegner av andre, derimellom eigne barn eller barn du er verje for, vil vi hente inn og behandle opplysningar om vedkomande. Dette er nødvendig for at du, eller den du søkjer på vegner for, skal få gode tenester og ytingane du/vedkomande har rett på, og for at NAV skal kunne innfri plikta etter folketrygdlova kapittel 18 til å bidra til økonomisk tryggleik ved dødsfall.',
    collectAndProcessTitle: 'Vi samlar inn og behandlar personopplysningar for å',
    collectAndProcess_li1: 'identifisere og kommunisere med deg som er søkjar eller representant for søkjar',
    collectAndProcess_li2: 'behandle søknaden din',
    collectAndProcess_li3: 'betale ut ytinga',
    weWillRetrieveInfo: 'Vi hentar inn informasjonen vi treng',
    infoWeRetrieve:
        'For å behandle søknaden din hentar vi inn opplysningar om deg som søkjer, og om tredjepersonar som er relevante for søknaden din. Relevante tredjepersonar kan vere ein attlevande forelder eller verje som har rett til å representere deg overfor NAV. \n\nI tillegg til informasjonen du gir oss gjennom søknadsdialogen, kan vi hente inn følgjande: ',
    infoWeRetrieve_li1: 'personopplysningar frå Folkeregisteret (personnummer, adresse, statsborgarskap, sivilstand)',
    infoWeRetrieve_li2: 'opplysningar om anna fortløpande støtte frå NAV (periodar med mottak av uføretrygd)',
    infoWeRetrieve_li3: 'informasjon frå utanlandske trygdemakter (der dette er aktuelt)',
    infoWeRetrieve_li4: 'opplysningar om straffegjennomføring og opphald på institusjon',
    survivingParentInfo:
        'Dersom brukaren søkjer på eiga hand, eller ein verje søkjer på vegner av brukaren, vil NAV hente inn informasjon om ein eventuell attlevande forelder. Vi hentar då inn følgjande:',
    survivingParentInfo_li1: 'namn',
    survivingParentInfo_li2: 'fødselsnummer',
    survivingParentInfo_li3: 'adresse',
    survivingParentInfo_li4: 'medlemskap i Folketrygda (der dette er nødvendig)',
    survivingParentInfo_li5: 'informasjon frå utanlandske trygdemakter (der dette er aktuelt)',
    disclosureOfInformationTitle: 'Utlevering av opplysningane dine',
    disclosureOfInformationContent:
        'I samband med behandlinga av søknaden om omstillingsstønad utleverer vi enkelte personopplysningar til andre mottakarar. Utleveringa skjer som oftast i tilknyting til innhenting av opplysningar for å dokumentere at NAV har lov til å samle inn informasjon om identifiserte enkeltpersonar. For søkjarar med utanlandsk tilknyting kan det i tillegg bli utlevert informasjon til trygdemakter i andre land.',
    durationDataIsStoredTitle: 'Kor lenge opplysningane dine blir lagra',
    durationDataIsStoredContent:
        'Personopplysningane blir i tråd med føresegnene i økonomiregelverket lagra i 10 år etter siste utbetaling.',
    automaticProcessingTitle: 'Automatisk behandling',
    automaticProcessingContent1:
        'Stort sett all behandling av personopplysningar i samband med omstillingsstønad blir gjort manuelt. Det vil seie at det er ein saksbehandlar som ser på og behandlar saka di.',
    automaticProcessingContent2:
        'I visse tilfelle vil saka bli behandla automatisk. Ved ei fortløpande yting der <a href="https://www.nav.no/grunnbelopet">grunnbeløpet i folketrygda</a> blir nytta som utrekningsgrunnlag (t.d. barnepensjon), vil systemet automatisk endre utbetalinga di ut frå endringar i grunnbeløpet. Dette for å sikre at utbetalinga av ytingar går effektivt.',
    automaticProcessingContent3:
        'For deg inneber dette at stønaden din blir endra automatisk i tråd med den årlege justeringa av grunnbeløpet. Når stønaden din blir justert automatisk, er det ikkje ein saksbehandlar som har behandla endringa.',
    automaticProcessingContent4: 'For å gjennomføre grunnbeløpsregulering blir det nytta følgjande opplysningar:',
    automaticProcessingContent_li1: 'personnummer',
    automaticProcessingContent_li2: 'saks-ID',
    automaticProcessingContent_li3: 'type yting',
    automaticProcessingContent_li4: 'gjeldande vedtak',
    automaticProcessingContent5:
        'Endringane blir gjort i saksbehandlingssystemet og inneber ikkje flytting av opplysningar.',
    aboutPrivacyTitle: 'Personvernerklæringa i NAV',
    aboutPrivacy:
        'Her kan du lese meir om <a href="https://www.nav.no/no/nav-og-samfunn/om-nav/personvern-i-arbeids-og-velferdsetaten">korleis NAV behandlar personopplysningar.</a>',
    consentTitle: 'Vi stoler på deg',
    consentDescription: 'Du må gi oss riktige opplysingar for at vi skal kunne behandle søknaden.\n\n',
    consentToNav: 'Eg bekreftar at eg vil gi riktige og fullstendige opplysingar.',
}

const selectScenario = {
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
        'For at vi skal kunne behandle søknaden om barnepensjon, må du ettersende dokumentasjon på barn du er verje for.\n\n Du må oppgi fødselsnummer på alle i søknaden. Dersom du ikkje har denne informasjonen, fyller du ut ein av våre <a href="https://www.nav.no/start/soknad-barnepensjon/nn">andre søknader om barnepensjon</a>.',
    childApplicantInformation1:
        '<b>Viss du har mista ein forelder</b>\nNår dødsfallet skuldast ein yrkesskade eller yrkessjukdom kan du få barnepensjon inntil du blir 21 år hvis du er under utdanning, eller er lærling eller praktikant.',
    childApplicantInformation2:
        '<b>Viss du har mista begge foreldra dine eller farskapet ikkje er fastsatt må du bruke</b>\nDu kan få barnepensjon inntil du blir 20 år viss du er under utdanning, eller er lærling eller praktikant. Du kan få barnepensjon inntil du blir 21 år viss dødsfallet i tillegg skuldast ein yrkesskade eller yrkessjukdom.',
    childApplicantInformationOver18:
        'Har du mista ein eller begge foreldra dine må du bruke <a href="https://www.nav.no/fyllut/nav180405?lang=nn-NO">denne søknaden</a>.',
    youNeedFnrForEveryoneInThisApplicationSurvivingParent:
        'Du må oppgi heile fødselsnummeret til barnet/barna og avdøde. Dersom du ikkje har denne informasjonen, fyller du ut ein av våre <a href="https://www.nav.no/start/soknad-barnepensjon/nn">andre søknader om barnepensjon</a>.',
    aboutSurvivorsPensionTitle: 'Har du mista ektefellen, sambuaren eller partnaren din?',
    aboutSurvivorsPensionDescription:
        'Då kan du søkje om omstillingsstønad. Dersom du ønskjer å samstundes søkje om barnepensjon, kan du gjere begge delar i <a href="https://www.nav.no/omstillingsstonad/soknad/">søknad om omstillingsstønad.</a>',
    over18WithoutFnr:
        'Du må oppgi fødselsnummer på alle i søknaden. Dersom du ikkje har denne informasjonen, fyller du ut ein av våre <a href="https://www.nav.no/start/soknad-barnepensjon/nn">andre søknader om barnepensjon.</a>',
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
        'Vi treng å vite om avdøde har budd eller arbeidd utanfor Noreg. Dette kan påvirke berekninga av barnepensjon og i tillegg gi barnet/barna pensjonsrettar frå andre land.',
    workOrLivingAbroadCanAffectPensionOver18:
        'Vi treng å vite om avdøde har budd eller arbeidd utanfor Noreg. Dette kan påverke utrekninga av barnepensjon og i tillegg gi deg pensjonsrettar frå andre land.',
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
    occupationalInjury: 'Skuldast dødsfallet yrkesskade eller yrkessjukdom?',
    whyWeAskAboutOccupationalInjury:
        'Viss dødsfallet skuldast yrkesskade eller yrkessjukdom godkjent av NAV, kan det avgjere om barnet/barna får barnepensjon og kor mykje det/dei kan få.',
    whyWeAskAboutOccupationalInjuryOver18:
        'Dersom dødsfallet skuldast yrkesskade eller yrkessjukdom som NAV har godkjent, kan det avgjere om og eventuelt kor mykje du kan få i barnepensjon.',
    BODD: 'Budd',
    ARBEIDET: 'Arbeidd',
    addCountryButton: '+ Legg til fleire land',
}

const aboutChildren = {
    childAppliedForPension: 'Søker om barnepensjon',
    applyForThisChild: 'Søk om barnepensjon',
    userAppliesForChildrensPension: 'Ja, eg søker om barnepensjon for barnet',
    onlyChildrenOfDeceasedHaveRights: 'Det er berre avdødes barn og adoptivbarn som kan ha rett til barnepensjon.',
    onlyParentOrGuardianCanApply:
        'Har barnet mista ein forelder så må forelder eller oppnemnt verje sende eigen søknad.',
    onlyParentOrGuardianCanApplyOnLivingParent:
        'Det er berre barnets forelder eller oppnemnt verje som kan søke om barnepensjon for dette barnet. Det må søkast om barnepensjon i eigen søknad.',
    onlyChildrenUnder18Necessary: 'Du skal kun oppgi barn under 18 år.',
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
        'Eige skjema må også fyllast ut ved endring av <a href="https://www.nav.no/start/soknad-endring-bankkontonummer/nn">kontonummer</a> ' +
        'eller <a href="https://www.nav.no/skattetrekk#trekke-mer-skatt">frivillig skattetrekk</a>. ' +
        'Felles for desse er at dei må sendast inn per post.\n\n Viss du sender inn endringar, må du gi oss beskjed ' +
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
    'residesInNorway.required': 'Opphald må svarast på',
    'countryOfResidence.required': 'Oppgi land',
    'stayedAbroad.required': 'Opphald i utland må svarast på',
    'stayedAbroadCountry.required': 'Oppgi noverande opphaldsland',
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

const receipt = {
    pageTitle: 'Søknaden er sendt til oss',
    contact:
        'Vi har fått søknaden din om barnepensjon. Saka di er no til behandling hos NAV. Vi vil kontakte deg dersom vi treng meir informasjon eller dokumentasjon frå deg.',
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
    viewCaseInfoLinkText2: 'mitt NAV',
    processingTimeLink: 'forventa saksbehandlingstid.',
    processingTimeHref: 'https://www.nav.no/saksbehandlingstider/nn',
    closeApplicationButton: 'Les meir om barnepensjon',
    closeApplicationButtonHref: 'https://www.nav.no/barnepensjon',
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
