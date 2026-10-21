import i18n, { Resource } from 'i18next'
import { initReactI18next } from 'react-i18next'
import enLocale from './locales/en'
import nbLocale from './locales/nb'
import nnLocale from './locales/nn'

export enum Language {
    NORSK_BOKMAAL = 'nb',
    NORSK_NYNORSK = 'nn',
    ENGELSK = 'en',
}

const resources: Resource = {
    [Language.NORSK_BOKMAAL]: {
        translation: nbLocale,
    },
    [Language.NORSK_NYNORSK]: {
        translation: nnLocale,
    },
    [Language.ENGELSK]: {
        translation: enLocale,
    },
}

i18n.use(initReactI18next).init({
    lng: 'nb',
    nsSeparator: false,
    interpolation: {
        escapeValue: true,
    },
    react: {
        useSuspense: false,
    },
    returnNull: false,
    resources,
})

export default i18n
