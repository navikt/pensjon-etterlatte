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
    whyWeAsk: 'Why are we asking you about this?',
    dateFormat: '(dd.mm.yyyy)',
    dateExample: 'For example, 01.11.2020',
    dateSRLabel: 'Enter date',
    chooseCountry: 'Select country',
    chooseLanguage: 'Select language',
    norway: 'Norway',
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
}

const loggedInUserInfo = {
    incorrectInfoMustBeCorrected:
        'If the information we have about you is incorrect, you must change it in the National Registry.',
}

const paymentDetails = {
    title: 'Enter your bank details',
    NORSK: 'Norwegian',
    UTENLANDSK: 'Foreign',
    bankAccount: 'Enter the Norwegian bank account number for payment of the children’s pension',
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
        'The children’s pension is taxable, however we do not deduct tax from the payment amount unless we are instructed to do so. If you have any questions about tax, you must contact the Norwegian Tax Administration (“Skatteetaten”).',
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
    helloUser: `Hi, {fornavn} {etternavn}`,
    startApplication: 'Start the application',
    childMayBeApplicableForPension:
        'Children under the age of 18 who have lost one or both of their parents may receive financial support. It is the parent or guardian of the child who must apply for the children’s pension for the child if he/she is under the age of 18. \n Children who are studying or serving as an apprentice or trainee may be entitled to the children’s pension even if they are over the age of 18: \n',
    childMayBeApplicableForPension_li1:
        'If the death was caused by occupational injury or occupational illness, the child may be entitled to the children’s pension until the age of 21.',
    childMayBeApplicableForPension_li2:
        'If the child has lost both parents, the child may be entitled to the children’s pension until the age of 20.',
    childOver18HasToApplyByThemself:
        'Children over the age of 18 must apply for the children’s pension themselves.  \n \n<a href="https://www.nav.no/barnepensjon">More about the children’s pension</a>',
    tax: 'Tax',
    aboutChildrensPensionTax:
        'The children’s pension is taxable, however advance tax is not deducted. If you have any questions about tax, you must contact the Norwegian Tax Administration (“Skatteetaten”).',
    weWillRetrieveInfo: 'We collect the information we require',
    infoWeRetrieve:
        'In order to process your application we require information about the child/children, the parents of the children and any siblings.  \n \n We retrieve:',
    infoWeRetrieve_li1:
        '<strong>Personal information</strong> from the Norwegian National Registry (“Folkeregisteret”)',
    infoWeRetrieve_li2:
        '<strong>Information about your income</strong> from the Norwegian Tax Administration (“Skatteetaten”)',
    infoWeRetrieve_li3:
        'Information about your <strong>work situation</strong> from the NAV State Register of Employers and Employees (the Aa Register)',
    infoWeRetrieve_li4: 'Information about <strong>other support you are receiving from NAV</strong>',
    infoWeRetrieve_li5: 'As applicable, information from <strong>foreign social security authorities</strong>',
    howWeHandleData:
        '<a href="https://www.nav.no/no/nav-og-samfunn/om-nav/personvern-i-arbeids-og-velferdsetaten/personvernerklaering-for-arbeids-og-velferdsetaten">Read more about how we process your personal data</a>',
    aboutPrivacy:
        '<a href="https://www.nav.no/no/nav-og-samfunn/om-nav/personvern-i-arbeids-og-velferdsetaten/personvern-og-sikkerhet-pa-nav.no#chapter-3">Read more about data protection and security on the nav.no website</a>',
    aboutTheApplicationTitle: 'Filling out the application',
    aboutTheApplicationDescription:
        'We save the application for 72 hours so that you can take breaks along the way. You can quit the application at any time.',
    consentTitle: 'We trust you',
    consentDescription: 'You must provide us with the correct information so that we can process your application.\n\n',
    consentToNav: 'I, {fornavn} {etternavn}, hereby confirm that the information I provide is correct and complete.',
}

const selectScenario = {
    whoIsApplying: 'For whom are you submitting an application for the children’s pension?',
    additionalSituationDetails: 'The child/children has/have lost',
    additionalSituationDetailsOver18: '<Mangler tekst>',
    PARENT: 'I am applying for my child/children under the age of 18',
    GUARDIAN: 'I am applying for one or more children who I am the guardian for',
    CHILD: 'I have reached the age of 18 and am applying on behalf of myself',
    parentApplicantInformation:
        'In the application, you must list all children and/or adoptive children under the age of 18 who you had together with the deceased. Siblings may be of importance when calculating the children’s pension.',
    guardianApplicantInformation:
        'In the application, you must list all of the deceased’s children and/or adoptive children who are under the age of 18. Siblings may be of importance when calculating the children’s pension.',
    guardiansMustSendDocumentation:
        'If the children are not full siblings, an application must be submitted for each family of children.  \n \nIn order for us to process the application for the children’s pension, you must submit documentation that you are the guardian of the child/children.',
    childApplicantInformation1:
        '<b>If you have lost a parent</b> \nWhen the death was due to an occupational injury or occupational illness you are entitled to receive the children’s pension until the age of 21 if you are studying or serving as an apprentice or trainee.',
    childApplicantInformation2:
        '<b>If you have lost both of your parents or your paternity has not been determined</b> \nYou are entitled to receive the children’s pension until the age of 20 if you are studying or serving as an apprentice or trainee. You can receive the children’s pension until the age of 21 if the death was also due to occupational injury or occupational illness.',
    childApplicantInformationOver18:
        'If you have lost one or both of your parents you must use <a href="https://www.nav.no/soknader/en/person/pensjon/barn-som-har-mistet-en-eller-begge-foreldrene">this application</a>.',
    youNeedFnrForEveryoneInThisApplicationOneParentDeceased:
        'You must provide the full Norwegian national identity number of the child/children and parents. If you do not have this, you will need to use <a href="https://www.nav.no/soknader/en/person/stonader-ved-dodsfall/barn-som-har-mistet-en-eller-begge-foreldrene/NAV%2018-04.01/brev">this application</a>.',
    youNeedFnrForEveryoneInThisApplicationSurvivingParent:
        'You must provide the full Norwegian national identity number of the child/children and the deceased. If you do not have this, you will need to use <a href="https://www.nav.no/soknader/en/person/pensjon/barn-som-har-mistet-en-eller-begge-foreldrene/NAV%2018-04.01/brev">this application</a>.',
    youNeedFnrForEveryoneInThisApplicationBothParentsDeceased:
        'You must provide the full Norwegian national identity number of the child/children and parents. If you do not have this, you will need to use <a href="https://www.nav.no/soknader/en/person/stonader-ved-dodsfall/barn-som-har-mistet-en-eller-begge-foreldrene/NAV%2018-01.05/brev">this application</a>.',
    guardianApplicantInformationFatherNotConfirmed:
        'If the child has lost his/her mother and paternity has not been determined, you will need to use <a href="https://www.nav.no/soknader/en/person/stonader-ved-dodsfall/barn-som-har-mistet-en-eller-begge-foreldrene/NAV%2018-01.05/brev">this application</a>.',
    aboutSurvivorsPensionDescription:
        '<b>Have you lost your spouse, cohabiting partner or partner? </b> \nYou may then apply for a survivor’s pension or transitional benefit. If you would like to apply for the children’s pension at the same time, you can use <a href="https://www.nav.no/soknader/en/person/pensjon/gjenlevende-ektefelle-partner-eller-samboer">this application.</a>',
    BOTH_PARENTS_DECEASED: 'Both parents',
    BOTH_PARENTS_DECEASED_CHILD_APPLICANT: 'I have no parents',
    ONE_PARENT_DECEASED: 'One parent',
}

const aboutYou = {
    title: 'About you',
    stayWhy:
        'If you spend a prolonged period in a country other than Norway, this may affect whether you are entitled to a survivor’s pension and the amount you may receive.',
    addressOfResidenceConfirmed: 'Do you live at this address?',
    alternativeAddress: 'Enter your current residential address',
    residesInNorway: '<MANGLER TEKST>',
    residesInNorwayDescription: '<MANGLER TEKST>',
    countryOfResidence: 'State which country',
    memberFolketrygdenAbroad:
        'Are you a member of the Norwegian National Insurance Scheme during your period living in a country other than Norway?',
    'subtitle.personalia': 'Personal data',
}

const aboutParents = {
    aboutParentsTitle: 'About the parents',
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
        'You will need to add information about both parents to continue with the application.  \n \n If the child has lost his/her mother and paternity has not been determined, you will need to use',
    missingOneParentLink:
        '<a href="https://www.nav.no/soknader/en/person/stonader-ved-dodsfall/barn-som-har-mistet-en-eller-begge-foreldrene/NAV%2018-01.05/brev"> this application</a>.',
    bothParentsRequiredOver18: '<MANGLER TEKST>',
    childAndOneParentDeceased: '<MANGLER TEKST>'
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
    workOrLivingAbroadCanAffectPensionOver18: '<MANGLER TEKST>',
    didTheDeceasedLiveAbroad: 'Did he or she live and/or work in a country other than Norway after the age of 16?',
    abroadInWhichCountry: 'Country',
    livedOrWorkedAbroad: 'Lived and/or worked?',
    stayedAbroadFromDate: 'From date (optional)',
    stayedAbroadToDate: 'To date (optional)',
    deceasedWasMemberOfFolketrygdenAbroad:
        'Was the deceased a member of the Norwegian National Insurance Scheme during this period?',
    whyWeAskAboutFolketrygden:
        'We need to know if the deceased was a member of the Norwegian National Insurance Scheme in order to determine the right to the children’s pension.',
    pensionReceivedFromAbroad: 'Enter any pension the deceased received from this country (optional)',
    selfEmploymentTitle: 'Income from self-employment',
    weNeedToKnowIfDeceasedWasSelfEmployed:
        'We need to know if the deceased had any income as a self-employed person. This can influence the calculation of the children’s pension. We obtain information about other income directly.',
    wasTheDeceasedSelfEmployed: 'Was the deceased self-employed?',
    incomeFromSelfEmployymentYearBeforeDeath:
        'Enter the deceased’s income from self-employment from the calendar year before their death (optional)',
    incomeFromSelfEmploymentBeforeTaxes: 'Total annual income before tax',
    hadIncomeFromSelfEmployment: 'Did the deceased have any income from self-employment at the time of his/her death?',
    otherTitle: 'Other',
    occupationalInjury: 'Was the death caused by an occupational injury or occupational illness?',
    whyWeAskAboutOccupationalInjury:
        'If the death was caused by an occupational injury or occupational illness approved by NAV, this may determine whether the child/children will receive the children’s pension and the amount the child/children is/are entitled to.',
    whyWeAskAboutOccupationalInjuryOver18: '<MANGLER TEKST>',
    deceasedHasServedInTheMilitary:
        'Has he or she carried out compulsory military or civil service that had a minimum duration of 30 days?',
    whyWeAskAboutMilitaryService:
        'This may result in earnings that are to be included in the calculation of the children’s pension.',
    militaryServiceYears: 'In which year(s)? (optional)',
    BODD: 'Lived',
    ARBEIDET: 'Worked',
    addCountryButton: '+ Add more countries',
}

const aboutChildren = {
    childAppliedForPension: 'Applied for children’s pension',
    applyForThisChild: 'Apply for children’s pension',
    userAppliesForChildrensPension: 'Yes, I am applying for a children’s pension for the child',
    onlyChildrenOfDeceasedHaveRights:
        'Only the children and adopted children of the deceased may be entitled to the children’s pension.',
    onlyParentOrGuardianCanApply:
        'If the child has lost a parent, the parent or appointed guardian must submit a separate application.',
    onlyParentOrGuardianCanApplyOnLivingParent: `Only the child's parents or appointed guardian can apply for a children’s pension for this child. The children’s pension must be applied for separately.`,
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
    information: `Enter the deceased's biological children and/or adoptive children who are under the age of 18. \n\nIf the children are not full siblings, the parent or appointed guardian must submit a separate application for these children. \n\n Foster children should not be listed, because they are not entitled to a children’s pension after the foster parents. \n\n Children over the age of 18 must apply for a children’s pension themselves. `,
    infoRegardingSiblings: 'Here is the information if there are siblings',
    infoCard_residence: 'PLACE OF RESIDENCE',
    infoCard_fnr: 'NORWEGIAN NATIONAL IDENTITY NUMBER',
    infoCard_citizenship: 'NATIONALITY',
    removeChildButton: 'Remove from the application',
    addChildButton: '+ Add another child',
    addSiblingButton: '+ Add another sibling',
    whoAreTheParents: 'Who are the parents of the child?',
    whoAreTheParentsHelpText:
        'We need to know if this is a child you share with the deceased (a “joint child”), the deceased’s child from another relationship, or your child from another relationship.',
    bothOfTheAbove: '{person1} and {person2}',
    remainingParentsChild: 'Myself',
    jointChild: 'Myself and {person1}',
    relationHelpText:
        'We need to know if this is a child you share with the deceased (a “joint child”), the deceased’s child from another relationship, or your child from another relationship.',
    aboutChildrenTitle: 'About children',
    titleModal: 'About the child',
    aboutTheSiblingTitle: 'About the sibling',
    aboutSiblingsTitle: 'About siblings',
    thisIsOptional: 'This is optional',
    youAndDeceasedAreTheParents: 'Are you and the deceased the parents of the child?',
    loggedInUserIsGuardian: 'Are you the guardian of this child?',
    onlyGuardiansCanApply:
        'You can only apply for a children’s pension for children you are the guardian of.  nAll of the deceased’s children under the age of 18 can be added.',
}

const summary = {
    summaryTitle: 'Summary',
    readTheSummaryBeforeSending:
        'Read through the summary of the application before submitting.  nIf you need to make changes, you can go back and do this.',
    sendApplicationButton: 'Submit application',
    AboutYou: 'Change answers about you',
    AboutTheParents: 'Change answers about parents',
    AboutTheDeceased: 'Change answers about the deceased',
    AboutChildren: 'Change answers about children',
    YourSituation: 'Change answers about your situation',
    errorWhenSending:
        'An error occurred while submitting. Please wait a moment and try again. If the error persists, you can report it ',
    errorWhenSendingLink: 'here.',
    errorWhenSendingHref: 'https://www.nav.no/person/kontakt-oss/nb/tilbakemeldinger/feil-og-mangler',
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
    'countryOfResidence.required': 'Enter your current country of residence',
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
    'militaryService.completed.required': 'State whether the deceased has carried out compulsory military service',
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
}

const pageNotFound = {
    notFoundTitle: 'Oh dear, are you lost?',
    pageDoesNotExist: 'This page does not exist.',
    pageDoesNotExistInfo:
        'If you have clicked on a link on one of our pages and ended up here, you can report the error here:',
    reportErrorLink:
        '<a href="https://www.nav.no/tilbakemelding-feilogmangler">www.nav.no/tilbakemelding-feilogmangler</a>',
    backButton: 'Click here to return',
}

const systemUnavailable = {
    applicationNotWorking: 'Oh no, the application has failed...',
    somethingIsWrongWithTheApplication:
        'The application contains an error that has unfortunately caused it to not be processed as intended.',
    weAreWorkingOnTheError:
        'We apologize for this and are working to resolve the situation as quickly as possible. In the meantime, it would probably be a good idea to take a break and try again later.',
    reportError: 'If the error persists, you can report this at ',
    reportErrorLink:
        '<a href="https://www.nav.no/person/kontakt-oss/nb/tilbakemeldinger/feil-og-mangler">www.nav.no/person/kontakt-oss/nb/tilbakemeldinger/feil-og-mangler</a>',
    moreAboutBenefits: 'You can read more about survivors’ benefits at',
    moreAboutBenefitsLink: '<a href="https://www.nav.no/mistet-noen">www.nav.no/mistet-noen</a>',
    retryButton: 'Please try again',
}

const invalidApplicant = {
    applicantIsTooYoung: 'To apply for the children’s pension, you must be over the age of 18.',
    childMayBeApplicableForPension:
        'Children who have lost one or both of their parents may receive financial support. The children’s pension shall ensure there is an income to cover living and housing expenses.  \n \nFor children under the age of 18, it is the parent or guardian who must apply for a children’s pension.',
    moreAboutChildrensPension: '<a href="https://www.nav.no/barnepensjon">Read more about the children’s pension</a>',
}

const logOutUser = {
    btn: 'X icon to close the message',
    time: 'minutes',
    youWillBeLoggedOutIn: 'You will be logged out in',
    sendNowOrContinueLater:
        'You can submit the application now or continue later.  \n Your application will be saved for 72 hours.',
    wereLoggingYouOut: 'You will be logged out!',
}

const receipt = {
    thankYou: 'Thank you for your application!',
    pageTitle: 'The application has been sent to us',
    contact: 'If we need more information to be able to process the application, we will contact you.',
    youMustNotifyRegardingChanges: 'You must notify us of any changes',
    importantChangesCanAffectYourRights:
        'You must immediately notify us of any important life changes for the child or children. Examples of this include:',
    changeInLivingSituation: 'change in living/family situation',
    changeAddressOrMoveAbroad: 'move to or stay in another country over an extended period of time',
    childrenOver18MustNotify:
        'Children over the age of 18 who receive a children’s pension must also give notice of changes to their educational situation and/or earned income.',
    changeInEduation: 'educational situation and/or earned income',
    moreAboutRightsAndDuties: 'You can read more about rights and obligations at',
    moreAboutRightsAndDutiesLinkHref: 'https://nav.no/rettogplikt',
    moreAboutRightsAndDutiesLinkText: 'nav.no/rettogplikt',
    benefitsChangingTitle: 'Changes to the rules',
    benefitsChangingDescription1: 'The children’s pension shall be strengthened. Read more about the changes here: ',
    benefitsChangingDescription1_link: 'www.nav.no/barnepensjon',
    benefitsChangingDescription1_href: 'https://www.nav.no/barnepensjon#regel',
    submissionOfGuardianshipInfo: 'Guardian',
    guardianshipMustBeConfirmed:
        'If you have submitted an application as a guardian, you must submit confirmation of your appointment as guardian from the District Court or County Governor using ',
    guardianshipMustBeConfirmedLink: 'form NAV 00-03.00.',
    guardianshipMustBeConfirmedHref: 'https://www.nav.no/soknader/nb/person/diverse/div-dokumentasjon',
    viewCaseTitle: 'Do you want to check the status of the case?',
    viewCaseInfoContentPart1:
        'The parent or guardian cannot check the status of the child’s case digitally. If you have any questions regarding the application, please contact us at telephone number 55 55 33 34.',
    viewCaseInfoContent2: 'Children over the age of 18 can check the status of their case by logging on at ',
    viewCaseInfoLinkHref2: 'https://tjenester.nav.no/saksoversikt',
    viewCaseInfoLinkText2: 'Ditt NAV (Your NAV)',
    processingTimeText_part1: 'The children’s pension is subject to the same ',
    processingTimeLink4: 'processing time',
    processingTimeHref4: 'https://www.nav.no/saksbehandlingstider',
    processingTimeText_part2: ' as an application for a survivor’s pension.',
    closeApplicationButton: 'End',
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
