import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@navikt/ds-css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { SystemUtilgjengelig } from './common/SystemUtilgjengelig.tsx'
import { InntektsjusteringKvittering } from './inntektsjustering/4-kvittering/InntektsjusteringKvittering.tsx'
import { fetcher } from './utils/api.ts'
import { SWRConfig } from 'swr'
import { InntektsjusteringInnledning } from './inntektsjustering/1-innledning/InntektsjusteringInnledning.tsx'
import { ProvideSpraakContext } from './common/spraak/SpraakContext.tsx'
import { InntektsjusteringOppsummering } from './inntektsjustering/3-oppsummering/InntektsjusteringOppsummering.tsx'
import { InntektsjusteringInntektTilNesteAar } from './inntektsjustering/2-inntekt-til-neste-aar/InntektsjusteringInntektTilNesteAar.tsx'
import { FantIkkeSiden } from './common/FantIkkeSiden.tsx'
import { ProvideInntektContext } from './common/inntekt/InntektContext.tsx'
import { ProvideInnloggetInnbyggerContext } from './common/innloggetInnbygger/InnloggetInnbyggerContext.tsx'

const router = createBrowserRouter(
    [
        {
            path: '/',
            errorElement: <SystemUtilgjengelig />,
            children: [
                {
                    path: '*',
                    element: <FantIkkeSiden />,
                },
                { path: '/system-utilgjengelig', element: <SystemUtilgjengelig /> },
                {
                    path: '/innledning',
                    element: <InntektsjusteringInnledning />,
                },
                {
                    path: '/inntekt-til-neste-aar',
                    element: <InntektsjusteringInntektTilNesteAar />,
                },
                {
                    path: '/oppsummering',
                    element: <InntektsjusteringOppsummering />,
                },
                {
                    path: '/kvittering',
                    element: <InntektsjusteringKvittering />,
                },
            ],
        },
    ],
    { basename: '/omstillingsstonad/inntekt' }
)

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ProvideSpraakContext>
            <ProvideInntektContext>
                <SWRConfig
                    value={{
                        fetcher: fetcher,
                        shouldRetryOnError: false,
                        revalidateOnFocus: false,
                    }}
                >
                    <ProvideInnloggetInnbyggerContext>
                        <RouterProvider router={router} />
                    </ProvideInnloggetInnbyggerContext>
                </SWRConfig>
            </ProvideInntektContext>
        </ProvideSpraakContext>
    </StrictMode>
)
