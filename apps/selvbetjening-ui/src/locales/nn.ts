const app = {
    applicationTitle: 'Selvbetjening',
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

const loggedInUserInfo = {
    incorrectInfoMustBeCorrected:
        'Viss opplysingane vi har om deg ikkje stemmer, må du endre desse hos Folkeregisteret. \n',
    incorrectInfoMustBeCorrectedHref: 'https://www.skatteetaten.no/nn/skjema/opplysninger-i-folkeregisteret/',
    incorrectInfoMustBeCorrectedHrefText: 'Endre opplysningane dine',
}

export const nnTranslations = {
    ...app,
    ...common,
    ...loggedInUserInfo,
}
