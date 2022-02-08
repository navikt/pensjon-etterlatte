import { useState } from 'react'
import nb from '../locales/nb'
import nn from '../locales/nn'
import en from '../locales/en'

enum Language {
    BOKMAAL = 'nb',
    NYNORSK = 'nn',
    ENGELSK = 'en',
}

const useTranslation = (ns?: string) => {
    const [language, setLanguage] = useState(Language.BOKMAAL)

    const file = (lang: Language): object => {
        switch (lang) {
            case Language.BOKMAAL:
                return nb
            case Language.NYNORSK:
                return nn
            case Language.ENGELSK:
                return en
        }
    }

    const t = (key: string, meta?: any): string => {
        if (!ns) {
            const values = key.split(':')

            if (values.length > 1) {
                const ns = values[0]
                const key = values[1]

                // @ts-ignore
                return file(language)[ns][key]
            }
        }

        // @ts-ignore
        return file(language)[ns][key]
    }

    return {
        setLanguage,
        t,
    }
}

export default useTranslation
