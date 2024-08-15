const app = {
    applicationTitle: 'Selvbetjening',
}

const common = {
    firstName: 'Fornavn',
    lastName: 'Etternavn',
    name: 'Navn',
    fnrDnr: 'Fødselsnummer / d-nummer',
    fnrIsUnknown: 'Jeg kjenner ikke fødselsnummeret (valgfritt)',
    fnrIsUnknownHelpText: 'Behandlingen av søknaden tar lengre tid når du ikke oppgir fødselsnummeret.',
    dateOfBirth: 'Fødselsdato',
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
    noSensitiveData: 'Ikke oppgi sensitive personopplysninger.',
    counterLeft: 'tegn igjen',
    counterTooMuch: 'tegn for mye',
    whyWeAsk: 'Hvorfor spør vi om dette?',
}

const loggedInUserInfo = {
    incorrectInfoMustBeCorrected:
        'Hvis opplysningene vi har om deg ikke stemmer, må du endre disse hos Folkeregisteret. \n',
    incorrectInfoMustBeCorrectedHref: 'https://www.skatteetaten.no/skjema/opplysninger-i-folkeregisteret/',
    incorrectInfoMustBeCorrectedHrefText: 'Endre opplysningene dine',
}

const radiobuttons = {
    JA: 'Ja',
    NEI: 'Nei',
    VET_IKKE: 'Vet ikke',
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
const inntektsjustering = {
    arbeidsinntekt: 'Arbeidsinntekt',
    naeringsinntekt: 'Næringsinntekt',
    norge: 'Norge',
    utland: 'Utland',
}

export const nbTranslations = {
    ...app,
    ...common,
    ...loggedInUserInfo,
    ...radiobuttons,
    ...pageNotFound,
    ...systemUnavailable,
    ...inntektsjustering,
}
