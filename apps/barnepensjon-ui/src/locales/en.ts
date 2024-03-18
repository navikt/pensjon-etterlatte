import { TKey, TNamespace, Translation } from '../context/language/translations'

const app = {
    applicationTitle: 'Application for children’s pension',
    fetchingApplicationDetails: 'Retrieving application information...',
}

const common = {
    firstName: 'First name(s)',
    lastName: 'Family name',
    name: 'Name',
    fnrDnr: 'Norwegian national identity number or D number',
    address: 'Residential address',
    maritalStatus: 'Marital status',
    citizenship: 'Nationality',
    phoneNumber: 'Telephone number',
    phoneNumberOptional: 'Telephone number (optional)',
    phoneNumberHelpText: 'The telephone number has been obtained from the Contact and Reservation Register.',
    dateFormat: '(dd.mm.yyyy)',
    dateExample: 'For example, 01.11.2020',
    dateSRLabel: 'Enter date',
    chooseCountry: 'Select country',
    chooseLanguage: 'Select language',
    chooseCurrency: 'Select currency',
    norway: 'Norway',
    optional: 'optional',
}

const navigation = {
    cancelApplicationTitle: 'Do you want to quit this application?',
    cancelApplicationBody: 'You can continue now or later. Your application will be saved for 72 hours.',
    continueApplicationButton: 'No, I want to continue',
    cancelApplicationButton: 'Yes, I want to quit now and continue later',
    deleteApplicationButton: 'Yes, I want to quit now and clear the application form',
}

const btn = {
    backButton: 'Back',
    nextButton: 'Next',
    saveButton: 'Save',
    cancelButton: 'Cancel',
    removeButton: 'Remove',
    deleteButton: 'Delete',
    editButton: 'Change',
    continueButton: 'Continue',
    yesButton: 'Yes, submit application',
    noButton: 'No, go back',
    yesUnknownParent: 'Yes, my parent is unknown',
    yesUnknownParentGuardian: 'Yes, the parent is unknown',
    noUnknownParent: 'No, I know who my parents are',
    noUnknownParentGuardian: 'No, I do not know the identity of both parents',
}

const loggedInUserInfo = {
    incorrectInfoMustBeCorrected:
        'If the information we have about you is incorrect, you must change it in the National Registry. \n',
    incorrectInfoMustBeCorrectedHref: 'https://www.skatteetaten.no/en/forms/mine-opplysninger-i-folkeregisteret/',
    incorrectInfoMustBeCorrectedHrefText: 'Change your information',
}

const paymentDetails = {
    title: 'Enter your bank details',
    NORSK: 'Norwegian',
    UTENLANDSK: 'Foreign',
    bankAccount: 'Enter the Norwegian bank account number for payment of the children’s pension',
    bankAccountDescription: 'You can add a separate bank account number for the child.',
    information: 'You can add a separate bank account number for the child.',
    accountType: 'Do you want the pension to be paid into a Norwegian bank account or a foreign bank account?',
    foreignBankName: 'Name of bank',
    foreignBankAddress: 'Full address of the bank',
    iban: 'IBAN',
    ibanHelpText:
        'IBAN stands for International Bank Account Number and is an international standard for bank account numbers.',
    swift: 'The bank’s SWIFT code or BIC',
    swiftHelpText:
        'BIC stands for Bank Identifier Code, and is a unique code that identifies the bank. The BIC, which in some countries is called the SWIFT code, is required when making payments to a number of countries.',
    doYouWantUsToWithholdTax: 'Do you want us to deduct tax for the children’s pension?',
    childPensionIsTaxable:
        "A children's pension is taxable, but we do not deduct tax from the amount unless we are notified. If you have questions about the amount of the tax deduction, you must contact the Norwegian Tax Administration.",
    desiredTaxPercentage: 'Enter the desired tax deduction',
    desiredTaxPercentagePlaceholder: 'as a percentage; for example, 20%',
    taxWithholdMustBeSentYearly: 'Please note that voluntary tax deductions must be resubmitted each calendar year.',
}

const radiobuttons = {
    JA: 'Yes',
    NEI: 'No',
    VET_IKKE: 'Don’t know',
}

const frontPage = {
    frontPageTitle: 'Apply for children’s pension',
    ingress:
        'Hello. I am here to guide you through the application process. Please respond as well as you can based on your current situation. You can notify us about any changes that occur later.\n\n We save the changes you make to your application as things progress, so you can return and change them later. Please be aware that we only store your answers for 72 hours.',
    startApplication: 'Start the application',
    childMayBeApplicableForPension:
        'Children under the age of 20 who have lost one or both of their parents may receive financial support.',
    childMayBeApplicableForPension_li1:
        'It is the parent or guardian of the child who must apply for the children’s pension for the child if he/she is under the age of 18.',
    childMayBeApplicableForPension_li2:
        "As the child's guardian, you can only send an application for the child you are guardian for. You can also apply for those who have turned 18.",
    childMayBeApplicableForPension_li3: 'Children who have turned 18 must apply themselves.',
    readMoreAboutChildrensPension:
        'Any questions you may have about how much you can receive, taxes or other information about pensions, can you <a href="https://www.nav.no/barnepensjon/en">read more about children’s pension here</a>.',
    weWillRetrieveInfoTitle: 'Processing of personal data in the application',
    howWeProcessDataTitle: 'How NAV processes your personal data',
    howWeProcessDataContent:
        "When you submit an application for benefits, NAV will collect and process some personal data about the person applying for benefits. If you are sending an application on behalf of someone else, including a child under your care/guardianship, we will also collect and process some information about the child. This is necessary so that you, or the person you are applying for, will receive good services and correct benefits and to fulfill NAV's obligation to contribute financially security in the event of death – pursuant to Chapter 18 of the National Insurance Act.",
    collectAndProcessTitle: 'We collect and process personal data to:',
    collectAndProcess_li1: 'identify and communicate with you as an applicant or representative of an applicant',
    collectAndProcess_li2: 'process your application',
    collectAndProcess_li3: 'pay your benefits',
    weWillRetrieveInfo: 'We will collect any information we need',
    infoWeRetrieve:
        'In order to process your application, we collect information about you as the applicant and information about others that is relevant to your application. Relevant others can be surviving parents or a guardian authorised to represent you in dealings with NAV. \n\nIn addition to the information you provide during the application process, NAV is also authorised to collect: ',
    infoWeRetrieve_li1:
        'personal data from the National Population Register (national identification number, address, nationality, marital status)',
    infoWeRetrieve_li2:
        'information about other current benefits or support from NAV (periods when you received disability pension)',
    infoWeRetrieve_li3: 'information from foreign national insurance/social security authorities (if applicable)',
    infoWeRetrieve_li4: 'information about imprisonment and stays at institutions',
    survivingParentInfo:
        'If the user is applying on behalf of himself, or as a guardian applying for the user, NAV will collect information about any surviving parents. If so, we will need to collect:',
    survivingParentInfo_li1: 'name',
    survivingParentInfo_li2: 'national identity number  ',
    survivingParentInfo_li3: 'address',
    survivingParentInfo_li4: 'membership of the National Insurance Scheme (when necessary)',
    survivingParentInfo_li5: 'information from foreign national insurance/social security authorities (if applicable)',
    disclosureOfInformationTitle: 'Disclosure of your information',
    disclosureOfInformationContent:
        "In connection with processing applications for children's pensions, we disclose certain personal data to other recipients. Disclosure usually takes place in connection with the collection of information to prove that NAV is authorised to collect information about the identified individuals. For applicants with a connection abroad, information may also be provided to the national insurance/social security authorities of other countries.",
    durationDataIsStoredTitle: 'How long is your data stored?',
    durationDataIsStoredContent:
        'Personal data is stored for 10 years after the last payment in accordance with the provisions of the financial regulations.',
    automaticProcessingTitle: 'Automatic processing',
    automaticProcessingContent1:
        'Virtually all processing of personal data in connection with children’s pension is done manually. This means that there is a case handler who looks at and processes your case.',
    automaticProcessingContent2:
        'Automatic processing of cases is done in certain situations. In the case of an ongoing benefits that use <a href="https://www.nav.no/grunnbelopet">the basic amount in the National Insurance Scheme (G)</a> as a basis for calculation (such as transitional benefits), the system will automatically change your payment based on changes in the national basic amount. This is done to ensure that the payment of benefits takes place efficiently.',
    automaticProcessingContent3:
        'For you, this means that your benefits will automatically change in line with the annual adjustment of the basic amount. When your benefits are adjusted automatically, there is no case handler who processed the change.',
    automaticProcessingContent4: 'The following information is used to implement the basic amount adjustment:',
    automaticProcessingContent_li1: 'national identification number',
    automaticProcessingContent_li2: 'case ID',
    automaticProcessingContent_li3: 'type of benefits',
    automaticProcessingContent_li4: 'current applicable decision',
    automaticProcessingContent5:
        'The changes are made in the case processing system itself, and do not involve the transfer of information.',
    aboutPrivacyTitle: "NAV's Privacy Policy",
    aboutPrivacy:
        'Read more about <a href="https://www.nav.no/no/nav-og-samfunn/om-nav/personvern-i-arbeids-og-velferdsetaten">how NAV processes personal data here.</a>',
    consentTitle: 'We trust you',
    consentDescription: 'You must provide us with the correct information so that we can process your application.\n\n',
    consentToNav: 'I hereby confirm that the information I provide is correct and complete.',
    whoIsApplying: 'For whom are you submitting an application for the children’s pension?',
    additionalSituationDetails: 'The child have lost',
    additionalSituationDetailsDescription:
        'If the child has lost one parent and the other parent is unknown, you must choose "Both parents".',
    additionalSituationDetailsOver18: 'I have lost',
    additionalSituationDetailsOver18Description: 'If one of the parents is unknown, select "Both parents".',
    PARENT: 'I am applying for my child or children under the age of 18',
    GUARDIAN: 'I am applying for one or more children who I am the guardian for',
    CHILD: 'I have reached the age of 18 and am applying on behalf of myself',
    parentApplicantInformationLabel: 'I am applying for my child or children under the age of 18',
    parentApplicantInformation:
        'In the application, you must list all children and/or adoptive children under the age of 18 who you had together with the deceased.',
    guardianApplicantInformationLabel: 'I am applying for one or more children who I am the guardian for',
    guardianApplicantInformation:
        "The application must contain the names of all the deceased's children and/or adopted children under 20 years of age.",
    guardiansMustSendDocumentation:
        'In order for us to process your children’s pension application, you must send us documentation on the child you are guardian for later.\n\n Remember to provide all their national identity numbers on the application. If you do not have that information, please use one of our <a href="https://www.nav.no/start/soknad-barnepensjon/en">other applications for children’s pensions</a>.',
    childApplicantInformation1:
        '<b>If you have lost a parent</b> \nWhen the death was due to an occupational injury or occupational illness you are entitled to receive the children’s pension until the age of 21 if you are studying or serving as an apprentice or trainee.',
    childApplicantInformation2:
        '<b>If you have lost both of your parents or your paternity has not been determined</b> \nYou are entitled to receive the children’s pension until the age of 20 if you are studying or serving as an apprentice or trainee. You can receive the children’s pension until the age of 21 if the death was also due to occupational injury or occupational illness.',
    childApplicantInformationOver18:
        'If you have lost one or both of your parents you must use <a href="https://www.nav.no/soknader/en/person/pensjon/barn-som-har-mistet-en-eller-begge-foreldrene">this application</a>.',
    youNeedFnrForEveryoneInThisApplicationSurvivingParent:
        'You must enter the entire national identity number of the child/children and the deceased. If you do not have that information, please use one of our <a href="https://www.nav.no/start/soknad-barnepensjon/en">other applications for children’s pensions</a>.',
    aboutSurvivorsPensionTitle: 'Have you lost your spouse, cohabiting partner or partner?',
    aboutSurvivorsPensionDescription:
        'You may be eligible for transitional benefits. If you want to apply for a children’s pension at the same time, you can do both on the same <a href="https://www.nav.no/omstillingsstonad/soknad/">transitional benefits application form.</a>',
    over18WithoutFnr:
        'Remember to provide all their national identity numbers on the application. If you do not have that information, please use one of our <a href="https://www.nav.no/start/soknad-barnepensjon/en">other applications for children’s pensions.</a>',
    BOTH_PARENTS_DECEASED: 'Both parents',
    BOTH_PARENTS_DECEASED_CHILD_APPLICANT: 'I have no parents',
    ONE_PARENT_DECEASED: 'One parent',
}

const aboutYou = {
    title: 'About you',
    titleGuardian: 'About you as the guardian',
    stayWhy:
        'If you have been living in a country other than Norway, this may determine whether you are eligible for a children’s pension and how much you can receive.',
    addressOfResidenceConfirmed: 'Do you live at this address?',
    alternativeAddress: 'Enter your current residential address',
    staysAbroadTitle: 'Stays outside Norway',
    residesInNorway: 'Are you residing in Norway?',
    residesInNorwaySummaryQuestion: 'Are you residing in a country other than Norway?',
    countryOfResidence: 'State which country you are residing in',
    stayedAbroad: 'Have you lived or stayed abroad in the last 12 months?',
    stayedAbroadCountry: 'State which country',
    stayedAbroadFromDate: 'From date',
    stayedAbroadToDate: 'To date',
    memberFolketrygdenAbroad:
        'Are you a member of the Norwegian National Insurance Scheme during your period living in a country other than Norway?',
    'subtitle.personalia': 'Personal data',
}

const aboutParents = {
    aboutParentsTitle: 'About the parents',
    unknownParentTitle: 'Unknown parent',
    firstParent: 'Parent 1',
    secondParent: 'Parent 2',
    survivingParent: 'Surviving parent',
    deceasedParent: 'Deceased parent',
    addParentBtn: 'Add',
    addSurvivingParentBtn: 'Add surviving parent',
    addDeceasedParentBtn: 'Add deceased parent',
    addFirstParentBtn: 'Add parent 1',
    addSecondParentBtn: 'Add parent 2',
    bothParentsRequired:
        "You must enter information about both your parents to continue the application. If the child has lost his mother and paternity has not been determined, you must use 'I have lost both parents'.",
    chooseUnknowParent:
        'You must enter information about both your parents to continue the application. \n\n If you do not know the identity of one of the parents, select "Unknown parent".',
    childAndOneParentDeceased: 'You do not need to fill in the surviving parent information',
    unknownParent: 'Unknown parent',
    unknownParentQuestion: 'Can you confirm that you do not know the identity of your parent?',
    unknownParentQuestionGuardian: 'Can you confirm that you do not know the identity of the deceased parent?',
    childAndOneParentDeceasedGuidepanel:
        'You do not need to fill in the surviving parent information. We collect this information when we process your application.\n\n If you have lost one parent and the other is unknown, you will need to start the application process again. Choose "I have lost both parents".',
    childAndBothParentsDeceasedGuidepanel:
        'You must enter information about both your parents to continue the application. \n\n If you do not know the identity of your parent, select "Unknown parent".',
    guardianAndOneParentDeceased:
        'You do not need to fill in the surviving parent information. We collect this information when we process your application. \n\n If the child has lost one parent and you do not know the identity of the other parent, you must start the application process over again. Choose the alternative "Both parents".',
}

const livingParent = {
    title: 'Information about the survivor',
    address: 'Address (optional)',
}

const aboutTheDeceased = {
    firstParentTitle: 'About the first parent',
    secondParentTitle: 'About the other parent',
    singleParentTitle: 'About the deceased',
    dateOfDeath: 'When did the death occur?',
    phoneNumber: 'Telephone number (optional)',
    abroadStaysTitle: 'Time spent outside Norway',
    workOrLivingAbroadCanAffectPension:
        'We need to know if the deceased lived or worked outside Norway. This can influence the calculation of the children’s pension and also entitle the child/children to pension rights from other countries.',
    workOrLivingAbroadCanAffectPensionOver18:
        'We need to know whether the deceased has lived or worked outside of Norway. This can affect our calculation of the children’s pension, and you may also have pension rights from another country.',
    didTheDeceasedLiveAbroad: 'Did he or she live and/or work in a country other than Norway after the age of 16?',
    abroadInWhichCountry: 'Country',
    livedOrWorkedAbroad: 'Lived and/or worked?',
    stayedAbroadFromDate: 'From date',
    stayedAbroadToDate: 'To date',
    deceasedWasMemberOfFolketrygdenAbroad:
        'Was the deceased a member of the Norwegian National Insurance Scheme during this period?',
    whyWeAskAboutFolketrygden:
        'We need to know if the deceased was a member of the Norwegian National Insurance Scheme in order to determine the right to the children’s pension.',
    pensionReceivedFromAbroadTitle: 'Pension from abroad (optional)',
    pensionReceivedFromAbroadDescription: 'Enter any pension the deceased received from this country.',
    pensionWithCurrency: 'Annual pension, in the currency of that country',
    selfEmploymentTitle: 'Income from self-employment',
    weNeedToKnowIfDeceasedWasSelfEmployed:
        'We need to know if the deceased had any income as a self-employed person. This can influence the calculation of the children’s pension. We obtain information about other income directly.',
    wasTheDeceasedSelfEmployed: 'Was the deceased self-employed?',
    incomeFromSelfEmployymentYearBeforeDeath:
        'Enter the deceased’s income from self-employment from the calendar year before their death (optional)',
    incomeFromSelfEmploymentBeforeTaxes: 'Total annual income before tax',
    hadIncomeFromSelfEmployment: 'Did the deceased have any income from self-employment at the time of his/her death?',
    occupationalInjury: 'Was the death caused by an occupational injury or occupational illness?',
    whyWeAskAboutOccupationalInjury:
        'If the death was caused by an occupational injury or occupational illness approved by NAV, this may determine whether the child/children will receive the children’s pension and the amount the child/children is/are entitled to.',
    whyWeAskAboutOccupationalInjuryOver18:
        "If the death is due to an occupational injury or occupational illness approved by NAV, this can determine whether you are eligible for a children's pension and how much you can receive.",
    BODD: 'Lived',
    ARBEIDET: 'Worked',
    amountAbroad: 'Annual amount',
    addCountryButton: '+ Add more countries',
}

const aboutChildren = {
    childAppliedForPension: 'Applies for children’s pension',
    applyForThisChild: 'Apply for children’s pension',
    userAppliesForChildrensPension: 'Yes, I am applying for a children’s pension for the child',
    onlyChildrenOfDeceasedHaveRights:
        'Only the children and adopted children of the deceased may be entitled to the children’s pension.',
    onlyParentOrGuardianCanApply:
        'If the child has lost a parent, the parent or appointed guardian must submit a separate application.',
    onlyParentOrGuardianCanApplyOnLivingParent: `Only the child's parent or appointed guardian can apply for a children’s pension for this child. The children’s pension must be applied for separately.`,
    onlyChildrenUnder18Necessary: 'You must only list children under the age of 18.',
    livesIn: 'Lives in',
    doesTheChildLiveAbroad: 'Does the child live in a country other than Norway?',
    doesTheSiblingLiveAbroad: 'Does the sibling live in a country other than Norway?',
    stayAbroadCountry: 'Country',
    addressAbroad: 'Address abroad',
    guardianLastName: 'Surname (optional)',
    guardianFirstName: 'First name(s) (optional)',
    guardianName: 'Guardian’s name',
    childHasGuardian: 'Has a guardian been appointed for the child?',
    guardianFnr: 'The guardian’s Norwegian national identity number (optional)',
    guardianFnrPlaceholder: '11 digits',
    information:
        'Add all the children under 18 that you have in common with the deceased. Children over the age of 18 must apply themselves.',
    informationGuardian: 'Add all the children you are guardian for.',
    infoRegardingSiblings: 'Here is the information if there are siblings',
    infoCard_residence: 'PLACE OF RESIDENCE',
    infoCard_fnr: 'NORWEGIAN NATIONAL IDENTITY NUMBER',
    infoCard_citizenship: 'NATIONALITY',
    removeChildButton: 'Remove from the application',
    addChildButton: '+ Add child',
    addSiblingButton: '+ Add sibling',
    whoAreTheParents: 'Who are the parents of the child?',
    whoAreTheParentsHelpText:
        'We need to know if this is a child you share with the deceased (a “joint child”), the deceased’s child from another relationship, or your child from another relationship.',
    bothOfTheAbove: '{person1} and {person2}',
    remainingParent: 'Surviving parent',
    remainingParentsChild: 'Myself',
    jointChild: 'Myself and {person1}',
    guardianChild: 'Surviving parent and {person1}',
    relationHelpText:
        'We need to know if this is a child you share with the deceased (a “joint child”), the deceased’s child from another relationship, or your child from another relationship.',
    aboutChildrenTitle: 'About children',
    titleModal: 'About the child',
    aboutTheSiblingTitle: 'About the sibling',
    aboutSiblingsTitle: 'About siblings',
    thisIsOptional: 'This is optional',
    youAndDeceasedAreTheParents: 'Are you and the deceased the parents of the child?',
    loggedInUserIsGuardian: 'Are you the guardian of this child?',
    needToSendInDocumentation:
        'You must submit documentation proving that you are the guardian for the child after you have submitted the application.',
    onlyGuardiansCanApply:
        'You can only apply for a children’s pension for children you are the guardian of. \n All of the deceased’s children can be added.',
}

const summary = {
    summaryTitle: 'Summary',
    readTheSummaryBeforeSending:
        'Read through the summary of the application before submitting.  \nIf you need to make changes, you can go back and do this.',
    sendApplicationButton: 'Submit application',
    AboutYou: 'Change answers about you',
    AboutTheParents: 'Change answers about parents',
    AboutTheDeceased: 'Change answers about the deceased',
    AboutChildren: 'Change answers about children',
    YourSituation: 'Change answers about your situation',
    errorFromConflict:
        'We have already received an application for one or more of the children named in the application.\n\n' +
        'If you want to change any information on a submitted application, you must use the form ' +
        '<a href="https://www.nav.no/soknader/nb/person/diverse/div-dokumentasjon">Miscellaneous documentation</a>. ' +
        'You also need to submit the appropriate form to change <a href="https://www.nav.no/start/soknad-endring-bankkontonummer/en">account number</a> ' +
        'or <a href="https://www.nav.no/skattetrekk#trekke-mer-skatt">voluntary tax deduction</a>. ' +
        'All of these must be sent by conventional mail.\n\n If you send any changes, you must contact us by phone ' +
        '<a href="tel:+47 55 55 33 34">55 55 33 34</a>, so that we can postpone processing the application.',
    errorWhenSending:
        'An error occurred while submitting. Please wait a moment and try again. If the error persists, you can report it <a href="https://www.nav.no/person/kontakt-oss/en/tilbakemeldinger/feil-og-mangler">here.</a>',
    sendApplicationTitle: 'Do you wish to submit the application now?',
    sendingApplicationTitle: 'Submitting the application',
    sendApplicationBody: 'You will not be able to change your information after submitting the application.',
}

const error = {
    fixTheseErrorsToContinue: 'To proceed, you must correct the following:',
    'applicantRole.required': 'State who is applying for a children’s pension',
    'applicantSituation.required': 'State who the child/children has/have lost',
    'abroadStays.hasStaysAbroad.required':
        'State whether the deceased has ever lived or worked in a country other than Norway',
    'addressOfResidenceConfirmed.required': 'You must confirm whether or not this is your current residential address',
    'alternativeAddress.required': 'You must enter your current residential address',
    'citizenship.required': 'Enter nationality',
    'consent.required': 'You must confirm that the information you provide is correct and complete.',
    'dateOfDeath.required': 'State when the death occurred',
    'firstName.required': 'Enter first name(s)',
    'firstName.pattern': 'Invalid first name(s)',
    'fnr.required': 'Enter Norwegian national identity number',
    'fnrDnr.duplicate': 'Duplicate Norwegian national identity number or D number',
    'fnr.validate': 'Invalid Norwegian national identity number',
    'fnrDnr.required': 'Enter Norwegian national identity number or D number',
    'fnrDnr.validate': 'Invalid Norwegian national identity number',
    'lastName.required': 'Enter family name',
    'lastName.pattern': 'Invalid family name',
    'address.required': 'Enter address',
    'phoneNumber.minLength': 'Inadequate number of digits in telephone number',
    'phoneNumber.pattern': 'Telephone number has invalid format',
    'children.required': 'You must apply for the children’s pension for at least one child.',
    'children.validate': 'You must apply for the children’s pension for at least one child.',
    'memberFolketrygdenAbroad.required':
        'State whether you are a member of the Norwegian National Insurance Scheme during your stay in a country other than Norway',
    'occupationalInjury.required': 'State whether the death was due to an occupational injury or occupational illness',
    'paymentDetails.taxWithhold.answer.required': 'State whether you wish to add tax deductions ',
    'paymentDetails.taxWithhold.taxPercentage.required': 'Enter the desired tax deduction',
    'paymentDetails.bankAccount.required': 'Norwegian bank account number is a required field (11 digits)',
    'paymentDetails.bankAccount.pattern': 'Invalid account number It must have 11 digits',
    'paymentDetails.accountType.required':
        'You must choose whether you want the money to be paid into a Norwegian bank account or a foreign bank account',
    'paymentDetails.foreignBankName.required': 'The name of the foreign bank is a required field',
    'paymentDetails.foreignBankAddress.required': 'The address of the foreign bank is a required field',
    'paymentDetails.iban.required': 'IBAN number is a required field',
    'paymentDetails.iban.validate': 'Invalid IBAN',
    'paymentDetails.swift.required': 'The bank’s SWIFT code or BIC is a required field',
    'paymentDetails.swift.validate': 'Invalid SWIFT code',
    'residesInNorway.required': 'You must answer this question about residence',
    'selfEmplyment.wasSelfEmployed.required': 'State whether the deceased was self-employed',
    'selfEmplyment.selfEmplymentDetails.income.pattern': 'Enter valid income from self-employment (digits only)',
    'selfEmplyment.selfEmplymentDetails.incomeAtDeath.required':
        'State whether the deceased had income from self-employment',
    'staysAbroad.answer.required': 'State whether the child is a resident in a country other than Norway',
    'staysAbroad.hasStaysAbroad.required': 'State whether the deceased spent periods outside of Norway',
    'staysAbroad.abroadStays.type.required': 'Select the type of stay',
    'staysAbroad.abroadStays.country.required': 'State the country in which time was spent',
    'staysAbroad.abroadStays.medlemFolketrygd.required':
        'State whether the deceased was a member of the Norwegian National Insurance Scheme during his/her stay',
    'staysAbroad.abroadStays.pension.amount.required': 'State annual amount',
    'staysAbroad.abroadStays.pension.currency.required': 'Select currency',
    'parents.required': 'State the child’s parents',
    'loggedInUserIsGuardian.required': 'State whether you are the child’s guardian',
    'staysAbroad.country.required': 'State the child’s country of residence',
    'staysAbroad.address.required': `State the child's residential address`,
    'childHasGuardianship.answer.required': 'State whether a guardian has been appointed for the child',
    'childHasGuardianship.firstName.pattern': 'Invalid first name(s)',
    'childHasGuardianship.lastName.pattern': 'Invalid family name',
    'childHasGuardianship.fnr.validate': 'Invalid Norwegian national identity number',
    'whyDoYouApply.required': 'State the reason you are applying for the children’s pension',
    'timeUsedForEducation.required': 'State the amount of time you spend studying',
    'doYouHaveIncome.required': 'State whether you have earned income',
    'countryOfResidence.required': 'Enter your current country of residence',
    'stayedAbroad.required': 'You must answer this question about residence',
    'stayedAbroadCountry.required': 'State which country',
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
    applicantIsTooYoung: 'To apply for the children’s pension, you must be over the age of 18.',
    childMayBeApplicableForPension:
        'Children who have lost one or both of their parents may receive financial support. The children’s pension shall ensure there is an income to cover living and housing expenses.  \n \nFor children under the age of 18, it is the parent or guardian who must apply for a children’s pension.',
    moreAboutChildrensPension: '<a href="https://www.nav.no/barnepensjon">Read more about the children’s pension</a>',
}

const receipt = {
    pageTitle: 'The application has been sent to us',
    contact:
        "We have received your application for a children's pension. NAV will now process and review your case. We will contact you if we need more information or documentation from you.",
    youMustNotifyRegardingChanges: 'You must notify us of any changes',
    importantChangesCanAffectYourRights:
        'You must immediately notify us of any important changes. Examples of this include:',
    changeInLivingSituation: 'Change in living/family situation',
    changeAddressOrMoveAbroad: 'Move to or stay in another country over an extended period of time',
    changeInEduation: 'educational situation and/or earned income',
    moreAboutChanges: 'You can read more about ',
    moreAboutChangesLinkHref: 'https://www.nav.no/endringer',
    moreAboutChangesLinkText: 'notifying us of any changes.',
    submissionOfGuardianshipInfo: 'Guardian',
    guardianshipMustBeConfirmed:
        'If you have submitted an application as a guardian, you must submit confirmation of your appointment as guardian from the District Court or County Governor, ',
    guardianshipMustBeConfirmedLink: 'The form that you need to send later can be found here.',
    guardianshipMustBeConfirmedHref: 'https://www.nav.no/ettersende/en#childrens-pension',
    viewCaseTitle: 'Do you want to check the status of the case',
    viewCaseInfoContentPart1:
        "Parents or guardians cannot follow the child's case digitally. If you have any questions about the application, please contact us by phone +47 55 55 33 34. Curious about how long this will take? You can see the anticipated processing time here ",
    viewCaseInfoContent2: 'Children over the age of 18 can check the status of their case by logging on at ',
    viewCaseInfoLinkHref2: 'https://www.nav.no/min-side',
    viewCaseInfoLinkText2: 'mitt NAV (my NAV)',
    processingTimeLink: 'processing time.',
    processingTimeHref: 'https://www.nav.no/saksbehandlingstider/en',
    closeApplicationButton: `Read more about children's pension`,
    closeApplicationButtonHref: 'https://www.nav.no/barnepensjon/en',
}

const yourSituation = {
    title: 'Your situation',
    whatsYourSituation: 'What is your situation?',
    timeUsedForEducation: 'How much time do you spend on studying?',
    whyDoYouApply: 'Why are you applying for a children’s pension after the age of 18',
    doYouHaveIncome: 'Do you have an earned income?',
    BELOW50: 'Less than 50%',
    OVER50: '50% or more',
    ORPHAN: 'I have no parents',
    OCCUPATIONAL_INJURY: 'My late mother or father died as a result of an approved occupational injury',
    EDUCATION: 'I am studying',
    APPRENTICE: 'I am an apprentice',
    INTERNSHIP: 'I have an internship or am a trainee',
}

const continueApplicationModal = {
    doYouWantToContinueWithTheApplication: 'Do you want to continue filling in the application you started earlier?',
    yesContinueWithApplication: 'Yes, I want to carry on from where I left off',
    noRestartApplication: 'No, I want to start a new application',
}

const steps = {
    AboutYou: 'About you',
    AboutYouGuardian: 'About you as the guardian',
    AboutTheParents: 'About the parents',
    AboutTheDeceased: 'About the deceased',
    YourSituation: 'Your situation',
    AboutChildren: 'Information about the children',
    Summary: 'Summary',
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
