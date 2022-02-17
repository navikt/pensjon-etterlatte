import { createContext, FC, useContext, useState } from 'react'
import { Language } from './language'

const initialLanguage = (localStorage.getItem('language') as Language) || Language.BOKMAAL

const LanguageContext = createContext({
    language: initialLanguage,
    updateLanguage: (_: Language) => {},
})

const useLanguageContext = () => useContext(LanguageContext)

const LanguageProvider: FC = ({ children }) => {
    const [language, setLanguage] = useState<Language>(initialLanguage)

    const updateLanguage = (lang: Language) => {
        localStorage.setItem('language', lang)
        setLanguage(lang)
    }

    return <LanguageContext.Provider value={{ language, updateLanguage }}>{children}</LanguageContext.Provider>
}

export { useLanguageContext, LanguageProvider }
