import { createContext, FC, useContext, useState } from 'react'
import { Language } from './language'

const initialLanguage = Language.BOKMAAL

const LanguageContext = createContext({
    language: initialLanguage,
    setLanguage: (_: Language) => {},
})

const useLanguageContext = () => useContext(LanguageContext)

const LanguageProvider: FC = ({ children }) => {
    const [language, setLanguage] = useState<Language>(initialLanguage)

    return <LanguageContext.Provider value={{ language, setLanguage }}>{children}</LanguageContext.Provider>
}

export { useLanguageContext, LanguageProvider }
