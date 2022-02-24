import { createContext, FC, useContext, useState } from 'react'
import { Language } from './language'
import { Namespace, TKey } from './translations'
import nb from '../../locales/nb'
import nn from '../../locales/nn'
import en from '../../locales/en'

const initialLanguage = (localStorage.getItem('language') as Language) || Language.BOKMAAL
const initialTranslations = (nb as Record<Namespace, Record<TKey, any>>) || {}

const LanguageContext = createContext({
    language: initialLanguage,
    translations: initialTranslations,
    updateLanguage: (_: Language) => {},
})

const useLanguageContext = () => useContext(LanguageContext)

const LanguageProvider: FC = ({ children }) => {
    const [language, setLanguage] = useState<Language>(initialLanguage)
    const [translations, setTranslations] = useState<Record<Namespace, Record<TKey, any>>>(nb)

    const updateLanguage = (lang: Language) => {
        console.log('setting language and translations')

        localStorage.setItem('language', lang)
        setLanguage(lang)

        if (lang === Language.NYNORSK) setTranslations(nn)
        else if (lang === Language.ENGELSK) setTranslations(en)
        else setTranslations(nb)
    }

    return (
        <LanguageContext.Provider value={{ language, translations, updateLanguage }}>
            {children}
        </LanguageContext.Provider>
    )
}

export { useLanguageContext, LanguageProvider }
