import React, { createContext, FC, useContext, useState } from 'react'
import { Language } from './language'
import { Namespace, TKey } from './translations'
import nb from '../../locales/nb'
import nn from '../../locales/nn'
import en from '../../locales/en'
import { FCProps } from '../../types/FCProps'

const initialLanguage = (localStorage.getItem('language') as Language) || Language.BOKMAAL
const initialTranslations = (nb as Record<Namespace, Record<TKey, any>>) || {}

document.documentElement.lang = initialLanguage

const LanguageContext = createContext({
    language: initialLanguage,
    translations: initialTranslations,
    updateLanguage: (_: Language) => {},
})

const useLanguageContext = () => useContext(LanguageContext)

const languages = {
    nb,
    nn,
    en,
}

const LanguageProvider: FC<FCProps> = ({ children }) => {
    const [language, setLanguage] = useState<Language>(initialLanguage)
    const [translations, setTranslations] = useState<Record<Namespace, Record<TKey, any>>>(languages[language])

    const updateLanguage = (lang: Language) => {
        console.log('setting language and translations')

        localStorage.setItem('language', lang)
        setLanguage(lang)
        document.documentElement.lang = lang

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
