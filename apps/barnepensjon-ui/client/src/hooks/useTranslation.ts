import { useLanguageContext } from '../context/language/LanguageContext'
import { TKey, TMeta, TNamespace, Translation } from '../context/language/translations'

export type TFunction = (key: TKey, meta?: TMeta) => Translation

export default function useTranslation(ns: TNamespace) {
    const { translations } = useLanguageContext()

    const t: TFunction = (key: TKey, meta?: TMeta): Translation => {
        try {
            let translation: Translation = translations[meta?.ns || ns][key]

            Object.entries(meta || {})?.forEach((entry) => {
                translation = translation.replace(`{${entry[0]}}`, entry[1] || '')
            })

            return translation || key
        } catch {
            return key
        }
    }

    return {
        t,
    }
}
