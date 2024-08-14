import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@navikt/ds-css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Inntektsjustering } from './inntektsjustering/Inntektsjustering.tsx'
import { AppOutlet } from './AppOutlet.tsx'
import { SystemUtilgjengelig } from './common/SystemUtilgjengelig.tsx'
import { Landing } from './Landing.tsx'
import { OpprettInntektsjustering } from './inntektsjustering/OpprettInntektsjustering.tsx'
import { InntektsjusteringKvittering } from './inntektsjustering/InntektsjusteringKvittering.tsx'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { nbTranslations } from './locales/nb.ts'
import { nnTranslations } from './locales/nn.ts'
import { enTranslations } from './locales/en.ts'
import { fetcher } from './fetcher.ts'
import { SWRConfig } from 'swr'

i18n.use(initReactI18next).init({
    lng: 'nb',
    resources: {
        nb: { translation: nbTranslations },
        nn: { translation: nnTranslations },
        en: { translation: enTranslations },
    },
})

const router = createBrowserRouter(
    [
        {
            path: '/',
            element: <AppOutlet />,
            errorElement: <SystemUtilgjengelig />,
            children: [
                { path: '/', element: <Landing /> },
                {
                    path: '/inntektsjustering',
                    element: <Inntektsjustering />,
                },
                {
                    path: '/inntektsjustering/opprett',
                    element: <OpprettInntektsjustering />,
                },
                {
                    path: '/inntektsjustering/kvittering',
                    element: <InntektsjusteringKvittering />,
                },
            ],
        },
    ],
    { basename: '/selvbetjening' }
)

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <SWRConfig
            value={{
                fetcher: fetcher,
                shouldRetryOnError: false,
                revalidateOnFocus: false,
            }}
        >
            <RouterProvider router={router} />
        </SWRConfig>
    </StrictMode>
)
