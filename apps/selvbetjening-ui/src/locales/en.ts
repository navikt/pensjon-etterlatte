const app = {
    applicationTitle: 'Self-service',
}

const common = {
    firstName: 'First name(s)',
    lastName: 'Family name',
    name: 'Name',
    fnrDnr: 'Norwegian national identity number or D number',
    fnrIsUnknown: 'I do not know the national identy number (optional)',
    fnrIsUnknownHelpText:
        'The application process will take longer if you fail to state their national identity number.',
    dateOfBirth: 'Date of birth',
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
    noSensitiveData: 'Please do not write sensitive personal data.',
    counterLeft: 'characters remaining',
    counterTooMuch: 'characters to many',
    whyWeAsk: 'Why do we ask about this?',
}

const loggedInUserInfo = {
    incorrectInfoMustBeCorrected:
        'If the information we have about you is incorrect, you must change it in the National Registry. \n',
    incorrectInfoMustBeCorrectedHref: 'https://www.skatteetaten.no/en/forms/mine-opplysninger-i-folkeregisteret/',
    incorrectInfoMustBeCorrectedHrefText: 'Change your information',
}

export const enTranslations = {
    ...app,
    ...common,
    ...loggedInUserInfo,
}
