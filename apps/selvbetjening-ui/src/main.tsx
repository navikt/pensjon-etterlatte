import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@navikt/ds-css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { SystemUtilgjengelig } from './common/SystemUtilgjengelig.tsx'
import { Landing } from './Landing.tsx'
import { OpprettInntektsjustering } from './inntektsjustering/OpprettInntektsjustering.tsx'
import { InntektsjusteringKvittering } from './inntektsjustering/InntektsjusteringKvittering.tsx'
import { fetcher } from './utils/api.ts'
import { SWRConfig } from 'swr'
import { InntektsjusteringInnledning } from './inntektsjustering/1-innledning/InntektsjusteringInnledning.tsx'
import { ProvideSpraakContext } from './common/spraak/SpraakContext.tsx'

const router = createBrowserRouter(
    [
        {
            path: '/',
            errorElement: <SystemUtilgjengelig />,
            children: [
                { path: '/', element: <Landing /> },
                { path: '/system-utilgjengelig', element: <SystemUtilgjengelig /> },
                {
                    path: '/inntektsjustering',
                    element: <InntektsjusteringInnledning />,
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
        <ProvideSpraakContext>
            <SWRConfig
                value={{
                    fetcher: fetcher,
                    shouldRetryOnError: false,
                    revalidateOnFocus: false,
                }}
            >
                <RouterProvider router={router} />
            </SWRConfig>
        </ProvideSpraakContext>
    </StrictMode>
)
