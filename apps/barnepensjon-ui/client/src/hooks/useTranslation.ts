import { useEffect, useState } from 'react'
import nb from '../locales/nb'
import nn from '../locales/nn'
import en from '../locales/en'
import { useLanguageContext } from '../context/language/LanguageContext'
import { Language } from '../context/language/language'

type TKey = string
type Namespace = string
export type TFunction = (key: TKey, meta?: (string | undefined)[]) => string

export default function useTranslation(ns?: Namespace) {
    const { language } = useLanguageContext()

    const [translations, setTranslations] = useState<Record<Namespace, Record<TKey, any>>>(nb)

    useEffect(() => {
        if (language === Language.NYNORSK) setTranslations(nn)
        else if (language === Language.ENGELSK) setTranslations(en)
        else setTranslations(nb)
    }, [language])

    const translate = (key: TKey): string => {
        if (!ns) {
            const values = key.split(':')

            if (values.length > 1) {
                const ns = values[0]
                const key = values[1]

                return translations[ns][key]
            } else {
                return '' // Namespace missing. Returning empty string.
            }
        }

        // @ts-ignore
        return translations[ns][key]
    }

    const t: TFunction = (key: TKey, meta?: (string | undefined)[]): string => {
        try {
            let translation = translate(key)

            meta?.forEach((entry) => {
                translation = translation.replace(`{}`, entry || '')
            })

            return translation
        } catch {
            return ''
        }
    }

    return {
        t,
    }
}
