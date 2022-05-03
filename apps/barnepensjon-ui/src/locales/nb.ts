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
    whyWeAsk: 'Hvorfor spør vi om dette',
    dateFormat: '(dd.mm.yyyy)',
    dateExample: 'eks. 01.11.2020',
    dateSRLabel: 'Oppgi dato',
    chooseCountry: 'Velg land',
    chooseLanguage: 'Velg språk',
    norway: 'Norge',
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
}

const loggedInUserInfo = {
    incorrectInfoMustBeCorrected:
        'Hvis opplysningene vi har om deg ikke stemmer, må du endre disse hos Folkeregisteret.',
}

const paymentDetails = {
    title: 'Oppgi bankopplysninger',
    NORSK: 'Norsk',
    UTENLANDSK: 'Utenlandsk',
    bankAccount: 'Oppgi norsk kontonummer for utbetaling av barnepensjon',
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
        'Barnepensjon er skattepliktig, men vi trekker ikke skatt av beløpet uten at vi får beskjed om det. Hvis du har spørsmål om skatt må du ta kontakt med Skatteetaten.',
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
    helloUser: `Hei, {fornavn} {etternavn}`,
    startApplication: 'Start søknad',
    childMayBeApplicableForPension:
        'Barn under 18 år som har mistet en eller begge foreldrene sine, kan få økonomisk støtte. Det er forelderen eller vergen til barnet som må søke om barnepensjon for barnet hvis det er under 18 år. \n\nBarn som er under utdanning, eller er lærling eller praktikant, kan ha rett til barnepensjon selv om det er over 18 år:\n',
    childMayBeApplicableForPension_li1:
        'Hvis dødsfallet skyldes yrkesskade eller yrkessykdom, kan barnet ha rett til barnepensjon inntil fylte 21 år.',
    childMayBeApplicableForPension_li2:
        'Hvis barnet har mistet begge foreldrene sine, kan barnet ha rett til barnepensjon inntil fylte 20 år.',
    childOver18HasToApplyByThemself:
        'Barn over 18 år må søke selv.\n\n<a href="https://www.nav.no/barnepensjon">Mer om barnepensjon</a>',
    tax: 'Skatt',
    aboutChildrensPensionTax:
        'Barnepensjon er skattepliktig, men det blir ikke trukket forskuddsskatt. Hvis du har spørsmål om skatt må du ta kontakt med Skatteetaten.',
    weWillRetrieveInfo: 'Vi henter informasjonen vi trenger',
    infoWeRetrieve:
        'For å kunne behandle søknaden din trenger vi informasjon om barnet/barna, foreldrene til barna og eventuelle søsken.\n\nVi henter:',
    infoWeRetrieve_li1: '<strong>Personinformasjon</strong> fra Folkeregisteret',
    infoWeRetrieve_li2: '<strong>Inntektsinformasjon</strong> fra Skatteetaten',
    infoWeRetrieve_li3: 'Opplysninger om <strong>arbeidsforhold</strong> fra Arbeidsgiver- og arbeidstakerregisteret',
    infoWeRetrieve_li4: 'Opplysninger om <strong>annen støtte fra NAV</strong>',
    infoWeRetrieve_li5: 'Eventuelt informasjon fra <strong>utenlandske trygdemyndigheter</strong>',
    howWeHandleData:
        '<a href="https://www.nav.no/no/nav-og-samfunn/om-nav/personvern-i-arbeids-og-velferdsetaten/personvernerklaering-for-arbeids-og-velferdsetaten">Slik behandler vi personopplysningene dine</a>',
    aboutPrivacy:
        '<a href="https://www.nav.no/no/nav-og-samfunn/om-nav/personvern-i-arbeids-og-velferdsetaten/personvern-og-sikkerhet-pa-nav.no#chapter-3">Om personvern og sikkerhet på nav.no</a>',
    aboutTheApplicationTitle: 'Utfylling av søknaden',
    aboutTheApplicationDescription:
        'Vi lagrer søknaden i 72 timer så du kan ta pauser underveis. Du kan når som helst avbryte søknaden.',
    consentTitle: 'Vi stoler på deg',
    consentDescription: 'Du må gi oss riktige opplysninger for at vi skal kunne behandle søknaden.\n\n',
    consentToNav: 'Jeg, {fornavn} {etternavn}, bekrefter at jeg vil gi riktige og fullstendige opplysninger.',
}

const selectScenario = {
    whoIsApplying: 'Hvem søker du barnepensjon for?',
    additionalSituationDetails: 'Barnet/barna har mistet',
    PARENT: 'Jeg søker for mitt/mine barn under 18 år',
    GUARDIAN: 'Jeg søker for ett eller flere barn jeg er verge for',
    CHILD: 'Jeg har fylt 18 år og søker på vegne av meg selv',
    parentApplicantInformation:
        'I søknaden må du oppgi alle barn og/eller adoptivbarn under 18 år som du har sammen med avdøde. Søsken kan få betydning for beregningen av barnepensjon.',
    guardianApplicantInformation:
        'I søknaden må du oppgi alle avdødes barn og/eller adoptivbarn som er under 18 år. Søsken kan få betydning for beregningen av barnepensjon.',
    guardiansMustSendDocumentation:
        'Hvis barna ikke er helsøsken, må man søke for hvert barnekull. \n\nFor at vi skal kunne behandle søknaden om barnepensjon må du ettersende dokumentasjon på at du er verge for barnet/barna.',
    childApplicantInformation1:
        '<b>Hvis du har mistet en forelder</b>\nNår dødsfallet skyldes en yrkesskade eller yrkessykdom kan du få barnepensjon inntil du blir 21 år hvis du er under utdanning, eller er lærling eller praktikant.',
    childApplicantInformation2:
        '<b>Hvis du har mistet begge foreldrene dine</b>\nDu kan få barnepensjon inntil du blir 20 år hvis du er under utdanning, eller er lærling eller praktikant. Du kan få barnepensjon inntil du blir 21 år hvis dødsfallet i tillegg skyldes en yrkesskade eller yrkessykdom.',
    childApplicantInformationOver18:
        'Har du mistet en eller begge foreldrene dine må du bruke <a href="https://www.nav.no/fyllut/nav180405">denne søknaden</a>.',
    youNeedFnrForEveryoneInThisApplicationOneParentDeceased:
        'Du må oppgi hele fødselsnummeret til barnet/barna og foreldrene. Hvis ikke du har det, må du bruke <a href="https://www.nav.no/soknader/nb/person/stonader-ved-dodsfall/barn-som-har-mistet-en-eller-begge-foreldrene#NAV180401">denne søknaden</a>.',
    youNeedFnrForEveryoneInThisApplicationBothParentsDeceased:
        'Du må oppgi hele fødselsnummeret til barnet/barna og foreldrene. Hvis ikke du har det, må du bruke <a href="https://www.nav.no/soknader/nb/person/stonader-ved-dodsfall/barn-som-har-mistet-en-eller-begge-foreldrene#NAV180105">denne søknaden</a>.',
    guardianApplicantInformationFatherNotConfirmed:
        'Hvis barnet har mistet moren sin og farskapet ikke er fastsatt må du bruke <a href="https://www.nav.no/soknader/nb/person/stonader-ved-dodsfall/barn-som-har-mistet-en-eller-begge-foreldrene#NAV180105">denne søknaden</a>.',
    childApplicantInformationFatherNotConfirmed:
        'Hvis du har mistet moren din og farskapet ikke er fastsatt må du bruke <a href="https://www.nav.no/soknader/nb/person/stonader-ved-dodsfall/barn-som-har-mistet-en-eller-begge-foreldrene#NAV180105">denne søknaden</a>.',
    aboutSurvivorsPensionDescription:
        '<b>Har du mistet ektefellen, samboeren eller partneren din?</b>\nDa kan du søke om gjenlevendepensjon eller overgangsstønad. Hvis du ønsker å søke om barnepensjon samtidig kan du bruke <a href="https://www.nav.no/gjenlevendepensjon">denne søknaden.</a>',
    BOTH_PARENTS_DECEASED: 'Begge foreldrene',
    BOTH_PARENTS_DECEASED_CHILD_APPLICANT: 'Jeg er foreldreløs',
    ONE_PARENT_DECEASED: 'En forelder',
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
    'subtitle.personalia': 'Personalia',
}

const aboutParents = {
    aboutParentsTitle: 'Om foreldrene',
    firstParent: 'Forelder 1',
    secondParent: 'Forelder 2',
    survivingParent: 'Gjenlevende forelder',
    deceasedParent: 'Avdød forelder',
    addParentBtn: 'Legg til',
    addSurvivingParentBtn: 'Legg til gjenlevende forelder',
    addDeceasedParentBtn: 'Legg til avdød forelder',
    addFirstParentBtn: 'Legg til forelder 1',
    addSecondParentBtn: 'Legg til forelder 2',
    bothParentsRequired:
        'Du må legge til opplysninger om begge foreldre for å fortsette søknaden. \n\n Hvis barnet har mistet moren sin og farskapet ikke er fastsatt må du bruke',
    missingOneParentLink:
        '<a href="https://www.nav.no/soknader/nb/person/stonader-ved-dodsfall/barn-som-har-mistet-en-eller-begge-foreldrene#NAV180105"> denne søknaden</a>.',
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
        'Vi trenger å vite om avdøde har bodd eller arbeidet utenfor Norge. Dette kan påvirke beregningen av barnepensjon og i tillegg gi barnet/barna pensjonsrettigheter fra andre land.',
    didTheDeceasedLiveAbroad: 'Har han eller hun bodd og/eller arbeidet i et annet land enn Norge etter fylte 16 år?',
    abroadInWhichCountry: 'Land',
    livedOrWorkedAbroad: 'Bodd og/eller arbeidet?',
    stayedAbroadFromDate: 'Fra dato (valgfri)',
    stayedAbroadToDate: 'Til dato (valgfri)',
    deceasedWasMemberOfFolketrygdenAbroad: 'Var han eller hun medlem av folketrygden under oppholdet?',
    whyWeAskAboutFolketrygden:
        'Vi må vite om avdøde var medlem av folketrygden for å avgjøre rettigheten til barnepensjon.',
    pensionReceivedFromAbroad: 'Oppgi eventuell pensjon han eller hun mottok fra dette landet (valgfri)',
    selfEmploymentTitle: 'Næringsinntekt',
    weNeedToKnowIfDeceasedWasSelfEmployed:
        'Vi trenger å vite om avdøde hadde inntekt som selvstendig næringsdrivende. Dette kan påvirke beregningen av barnepensjon. Vi henter informasjon om andre inntekter.',
    wasTheDeceasedSelfEmployed: 'Var han eller hun selvstendig næringsdrivende?',
    incomeFromSelfEmployymentYearBeforeDeath: 'Oppgi næringsinntekt fra kalenderåret før dødsfallet (valgfri)',
    incomeFromSelfEmploymentBeforeTaxes: 'Samlet årsinntekt før skatt',
    hadIncomeFromSelfEmployment: 'Hadde han eller hun næringsinntekt når dødsfallet skjedde?',
    otherTitle: 'Annet',
    occupationalInjury: 'Skyldes dødsfallet yrkesskade eller yrkessykdom?',
    whyWeAskAboutOccupationalInjury:
        'Hvis dødsfallet skyldes yrkesskade eller yrkessykdom godkjent av NAV, kan det avgjøre om barnet/barna får barnepensjon og hvor mye det/de kan få.',
    deceasedHasServedInTheMilitary:
        'Har han eller hun gjennomført militær eller sivil førstegangstjeneste for Norge som varte minst 30 dager?',
    whyWeAskAboutMilitaryService: 'Dette kan gi opptjening som tas med i beregningen av barnepensjonen.',
    militaryServiceYears: 'Hvilke(-t) år? (valgfri)',
    BODD: 'Bodd',
    ARBEIDET: 'Arbeidet',
    addCountryButton: '+ Legg til flere land',
}

const aboutChildren = {
    childAppliedForPension: 'Søkt om barnepensjon',
    applyForThisChild: 'Søk om barnepensjon',
    userAppliesForChildrensPension: 'Ja, jeg søker om barnepensjon for barnet',
    onlyChildrenOfDeceasedHaveRights: 'Det er kun avdødes barn og adoptivbarn som kan ha rett til barnepensjon.',
    onlyParentOrGuardianCanApply:
        'Har barnet mistet en forelder så må forelder eller oppnevnt verge sende egen søknad.',
    onlyParentOrGuardianCanApplyOnLivingParent:
        'Det er kun barnets foreldre eller oppnevnt verge som kan søke om barnepensjon for dette barnet. Det må søkes om barnepensjon i egen søknad.',
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
    information:
        'Oppgi avdødes biologiske barn og/eller adoptivbarn under 18 år. \n\nDersom barna ikke er helsøsken, må forelder eller oppnevnt verge sende inn egen søknad for disse barna.\n\nFosterbarn skal ikke føres opp, fordi de ikke har rett til barnepensjon etter fosterforeldrene.\n\nBarn over 18 år må søke selv om barnepensjon. ',
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
    remainingParentsChild: 'Jeg',
    jointChild: 'Jeg og {person1}',
    relationHelpText:
        'Vi må vite om dette er et barn du har felles med avdøde, avdødes eget barn, eller ditt eget barn.',
    aboutChildrenTitle: 'Om barn',
    titleModal: 'Om barnet',
    aboutTheSiblingTitle: 'Om søskenet',
    aboutSiblingsTitle: 'Om søsken',
    thisIsOptional: 'Dette er valgfritt',
    youAndDeceasedAreTheParents: 'Er du og den avdøde foreldrene til barnet?',
    loggedInUserIsGuardian: 'Er du verge for dette barnet?',
    onlyGuardiansCanApply:
        'Du kan kun søke om barnepensjon for barn du er verge for. \nAlle avdødes barn under 18 år kan legges til.',
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
        '<a href="https://www.nav.no/soknader/nb/person/diverse/endre-opplysninger-om-bankkontonummer">kontonummer</a> eller ' +
        '<a href="https://www.nav.no/no/nav-og-samfunn/kontakt-nav/utbetalinger/utbetalinger/utbetalingsdatoer-feriepenger-og-skattetrekk/barnepensjon_kap">frivillig skattetrekk</a>. ' +
        'Felles for disse er at de må sendes inn pr post.\n\n' +
        'Sender du inn endringer må du gi oss beskjed ved å kontakte oss på telefon <a href="tel:+47 55 55 33 34">55 55 33 34</a>, slik at vi venter med saksbehandlingen av søknaden.',
    errorWhenSending:
        'En feil oppsto ved sending. Vent litt og prøv på nytt. Dersom feilen vedvarer kan du melde feil <a href="https://www.nav.no/person/kontakt-oss/nb/tilbakemeldinger/feil-og-mangler">her.</a>',
    sendApplicationTitle: 'Ønsker du å sende inn søknaden nå?',
    sendApplicationBody: 'Når du har sendt inn søknaden kan du ikke endre på opplysningene som du har lagt inn.',
}

const error = {
    fixTheseErrorsToContinue: 'For å gå videre må du rette opp i dette:',
    'applicantRole.required': 'Oppgi hvem som søker om barnepensjon',
    'applicantSituation.required': 'Oppgi hvem barnet/barna har mistet',
    'abroadStays.hasStaysAbroad.required': 'Oppgi om den avdøde har bodd eller jobbet i et annet land enn Norge',
    'addressOfResidenceConfirmed.required': 'Bostedsadresse må bekreftes/avkreftes',
    'alternativeAddress.required': 'Du må oppgi nåværende bostedsadresse',
    'citizenship.required': 'Oppgi statsborgerskap',
    'countryOfResidence.required': 'Oppgi nåværende oppholdsland',
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
    'militaryService.completed.required': 'Oppgi om avdøde har gjennomført verneplikt',
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
}

const pageNotFound = {
    notFoundTitle: 'Oi, har du gått deg vill?',
    pageDoesNotExist: 'Denne siden finnes ikke.',
    pageDoesNotExistInfo:
        'Dersom du har klikket på en lenke på våre sider og endt opp her, kan du rapportere feilen her:',
    reportErrorLink:
        '<a href="https://www.nav.no/tilbakemelding-feilogmangler">www.nav.no/tilbakemelding-feilogmangler</a>',
    backButton: 'Klikk her for å gå tilbake',
}

const systemUnavailable = {
    applicationNotWorking: 'Å nei, søknaden fungerer ikke...',
    somethingIsWrongWithTheApplication:
        'Det er en feil i søknaden som gjør at den dessverre ikke fungerer som den skal.',
    weAreWorkingOnTheError:
        'Vi beklager dette og jobber med å finne ut av det så raskt som mulig. I mellomtiden er det nok lurt å ta en pause og prøve igjen senere.',
    reportError: 'Er det fortsatt feil, kan du melde fra om det på ',
    reportErrorLink:
        '<a href="https://www.nav.no/person/kontakt-oss/nb/tilbakemeldinger/feil-og-mangler">www.nav.no/person/kontakt-oss/nb/tilbakemeldinger/feil-og-mangler</a>',
    moreAboutBenefits: 'Du kan lese mer om ytelser til etterlatte på',
    moreAboutBenefitsLink: '<a href="https://www.nav.no/mistet-noen">www.nav.no/mistet-noen</a>',
    retryButton: 'Prøv igjen',
}

const invalidApplicant = {
    applicantIsTooYoung: 'For å søke om barnepensjon må du være over 18 år.',
    childMayBeApplicableForPension:
        'Barn som har mistet en eller begge foreldrene sine, kan få økonomisk støtte. Barnepensjon skal sikre inntekt til å leve og bo. \n\nFor barn under 18 år er det forelder eller verge som søker om barnepensjon.',
    moreAboutChildrensPension: '<a href="https://www.nav.no/barnepensjon">Mer om barnepensjon</a>',
}

const logOutUser = {
    btn: 'X-ikon for å lukke meldingen',
    time: 'minutter',
    youWillBeLoggedOutIn: 'Du vil bli logget ut om',
    sendNowOrContinueLater: 'Du kan sende søknad nå eller fortsette senere. \n Søknaden din lagres i 72 timer.',
    wereLoggingYouOut: 'Du vil nå bli logget ut!',
}

const receipt = {
    thankYou: 'Takk for søknaden!',
    pageTitle: 'Søknaden er sendt til oss',
    contact: 'Hvis vi mangler informasjon for å behandle søknaden, kontakter vi deg.',
    youMustNotifyRegardingChanges: 'Du må melde fra om endringer',
    importantChangesCanAffectYourRights:
        'Du må melde fra med en gang det skjer viktige endringer i livet til barnet eller barna. Det kan for eksempel være ved:',
    changeInLivingSituation: 'endring i bo/familiesituasjon',
    changeAddressOrMoveAbroad: 'flytting eller opphold i et annet land over tid',
    childrenOver18MustNotify:
        'Barn over 18 år som mottar barnepensjon må i tillegg gi beskjed om endring i utdanningssituasjon og/eller arbeidsinntekt.',
    changeInEduation: 'utdanningssituasjon og/eller arbeidsinntekt',
    moreAboutRightsAndDuties: 'Du kan lese mer om rettigheter og plikter på',
    moreAboutRightsAndDutiesLinkHref: 'https://nav.no/rettogplikt',
    moreAboutRightsAndDutiesLinkText: 'nav.no/rettogplikt',
    benefitsChangingTitle: 'Regelendringer',
    benefitsChangingDescription1: 'Barnepensjon skal styrkes. Les mer om endringene her: ',
    benefitsChangingDescription1_link: 'www.nav.no/barnepensjon',
    benefitsChangingDescription1_href: 'https://www.nav.no/barnepensjon#regel',
    submissionOfGuardianshipInfo: 'Verge',
    guardianshipMustBeConfirmed:
        'Dersom du har sendt inn søknad som verge må du sende bekreftelse på oppnevnelse av verge fra tingretten eller Statsforvalteren på ',
    guardianshipMustBeConfirmedLink: 'skjema NAV 00-03.00.',
    guardianshipMustBeConfirmedHref: 'https://www.nav.no/soknader/nb/person/diverse/div-dokumentasjon',
    viewCaseTitle: 'Sjekke status i saken?',
    viewCaseInfoContentPart1:
        'Forelder eller verge kan ikke følge saken til barnet digitalt. Hvis du har spørsmål om søknaden, må du kontakte oss på telefon 55 55 33 34.',
    viewCaseInfoContent2: 'Barn over 18 år kan selv sjekke status i saken sin ved å logge inn i ',
    viewCaseInfoLinkHref2: 'https://tjenester.nav.no/saksoversikt',
    viewCaseInfoLinkText2: 'Ditt NAV',
    processingTimeText_part1: 'Barnepensjon følger samme ',
    processingTimeLink4: 'saksbehandlingstid',
    processingTimeHref4: 'https://www.nav.no/saksbehandlingstider',
    processingTimeText_part2: ' som søknad om gjenlevendepensjon.',
    closeApplicationButton: 'Avslutt',
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
