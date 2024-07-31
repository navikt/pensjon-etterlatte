import { TKey, TNamespace, Translation } from '../context/language/translations'

const app = {
    applicationTitle: 'Selvbetjening',
}

const common = {

}

const navigation = {

}

const btn = {

}
const radiobuttons = {
    JA: 'Yes',
    NEI: 'No',
    VET_IKKE: 'Don’t know',
}

const frontPage = {

}

const aboutYou = {

}

const error = {

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
    arbeidsinntekt: "Employment income",
    naeringsinntekt: "Business income",
    norge: "Norway",
    utland: "abroad",
}

const texts: Record<TNamespace, Record<TKey, Translation>> = {
    app,
    aboutYou,
    error,
    common,
    frontPage,
    navigation,
    btn,
    radiobuttons,
    pageNotFound,
    systemUnavailable,
    inntektsjustering,
}

export default texts
