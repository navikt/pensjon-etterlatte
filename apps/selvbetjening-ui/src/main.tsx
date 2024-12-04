import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@navikt/ds-css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { SystemUtilgjengelig } from './common/SystemUtilgjengelig.tsx'
import { fetcher } from './utils/api.ts'
import { SWRConfig } from 'swr'
import { ProvideSpraakContext } from './common/spraak/SpraakContext.tsx'
import { FantIkkeSiden } from './common/FantIkkeSiden.tsx'
import { ProvideInntektContext } from './common/inntekt/InntektContext.tsx'
import { ProvideInnloggetInnbyggerContext } from './common/innloggetInnbygger/InnloggetInnbyggerContext.tsx'
import { inntektjusteringRoutes } from './inntektsjustering/inntektjusteringRoutes.tsx'

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
                ...inntektjusteringRoutes,
            ],
        },
    ],
    { basename: '/omstillingsstonad' }
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
