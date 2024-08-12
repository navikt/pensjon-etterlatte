import { Outlet } from 'react-router-dom'
import { Header } from './common/Header.tsx'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { nbTranslations } from './locales/nb.ts'
import { nnTranslations } from './locales/nn.ts'
import { enTranslations } from './locales/en.ts'

export const AppOutlet = () => {
    //TODO: sette lng basert på hvor bruker er i fra
    i18n.use(initReactI18next).init({
        lng: 'nb',
        resources: {
            nb: { translation: nbTranslations },
            nn: { translation: nnTranslations },
            en: { translation: enTranslations },
        },
    })

    return (
        <>
            <Header />
            <Outlet />
        </>
    )
}
