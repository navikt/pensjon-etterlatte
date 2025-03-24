import { setParams } from '@navikt/nav-dekoratoren-moduler'
import React, { createContext, FC, useContext, useState } from 'react'
import { useCookies } from 'react-cookie'
import en from '../../locales/en'
import nb from '../../locales/nb'
import nn from '../../locales/nn'
import { FCProps } from '../../types/FCProps'
import { Language } from './language'
import { Namespace } from './translations'

const initialLanguage = (localStorage.getItem('language') as Language) || Language.BOKMAAL
const initialTranslations = nb as Record<Namespace, Record<string, string>>

document.documentElement.lang = initialLanguage

const LanguageContext = createContext({
    language: initialLanguage,
    translations: initialTranslations,
    updateLanguage: (_: Language) => {}, // eslint-disable-line  @typescript-eslint/no-unused-vars
})

const useLanguageContext = () => useContext(LanguageContext)

const languages = {
    nb,
    nn,
    en,
}

const dekoratorLanguageCookieName = 'decorator-language'

const LanguageProvider: FC<FCProps> = ({ children }) => {
    const [language, setLanguage] = useState<Language>(initialLanguage)
    const [translations, setTranslations] = useState<Record<Namespace, Record<string, string>>>(languages[language])
    const [cookies, setCookie] = useCookies([dekoratorLanguageCookieName])
    const { [dekoratorLanguageCookieName]: dekoratørSpraak } = cookies

    if (!dekoratørSpraak) {
        setCookie(dekoratorLanguageCookieName, language)
    }

    const updateLanguage = (lang: Language) => {
        console.log('setting language and translations')

        localStorage.setItem('language', lang)
        setLanguage(lang)
        document.documentElement.lang = lang

        if (lang === Language.NYNORSK) setTranslations(nn)
        else if (lang === Language.ENGELSK) setTranslations(en)
        else setTranslations(nb)

        setParams({ language: lang }).then()
        setCookie(dekoratorLanguageCookieName, lang)
    }

    return (
        <LanguageContext.Provider value={{ language, translations, updateLanguage }}>
            {children}
        </LanguageContext.Provider>
    )
}

export { useLanguageContext, LanguageProvider }
