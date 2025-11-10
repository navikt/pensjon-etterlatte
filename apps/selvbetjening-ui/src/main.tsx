import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@navikt/ds-css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { SWRConfig } from 'swr'
import { fetcher } from './common/api/api.ts'
import { FantIkkeSiden } from './common/FantIkkeSiden.tsx'
import { ProvideFeatureTogglesContext } from './common/featureToggles/FeatureTogglesContext.tsx'
import { ProvideInnloggetInnbyggerContext } from './common/innloggetInnbygger/InnloggetInnbyggerContext.tsx'
import { SystemUtilgjengelig } from './common/SystemUtilgjengelig.tsx'
import { ProvideSpraakContext } from './common/spraak/SpraakContext.tsx'
import { MeldInnEndringInnledning } from './meldInnEndring/1-innledning/MeldInnEndringInnledning.tsx'
import { MeldInnEndringMeldFra } from './meldInnEndring/2-meld-fra-om-endring/MeldInnEndringMeldFra.tsx'
import { MeldInnEndringOppsummering } from './meldInnEndring/3-oppsummering/MeldInnEndringOppsummering.tsx'
import { MeldInnEndringKvittering } from './meldInnEndring/4-kvittering/MeldInnEndringKvittering.tsx'
import { MeldInnEndringOutlet } from './meldInnEndring/MeldInnEndringOutlet.tsx'

const router = createBrowserRouter(
    [
        {
            path: '/',
            errorElement: <SystemUtilgjengelig />,
            children: [
                {
                    path: '/meld-inn-endring',
                    element: <MeldInnEndringOutlet />,
                    children: [
                        {
                            path: '*',
                            element: <FantIkkeSiden />,
                        },
                        { path: `/meld-inn-endring/system-utilgjengelig`, element: <SystemUtilgjengelig /> },
                        { path: '/meld-inn-endring/innledning', element: <MeldInnEndringInnledning /> },
                        { path: '/meld-inn-endring/meld-fra-om-endring', element: <MeldInnEndringMeldFra /> },
                        { path: '/meld-inn-endring/oppsummering', element: <MeldInnEndringOppsummering /> },
                        { path: '/meld-inn-endring/kvittering', element: <MeldInnEndringKvittering /> },
                    ],
                },
            ],
        },
    ],
    { basename: '/omstillingsstonad/skjema' }
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
            <ProvideFeatureTogglesContext>
                <ProvideSpraakContext>
                    <ProvideInnloggetInnbyggerContext>
                        <RouterProvider router={router} />
                    </ProvideInnloggetInnbyggerContext>
                </ProvideSpraakContext>
            </ProvideFeatureTogglesContext>
        </SWRConfig>
    </StrictMode>
)
