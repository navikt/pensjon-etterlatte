import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@navikt/ds-css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { SWRConfig } from 'swr'
import { FantIkkeSiden } from './common/FantIkkeSiden.tsx'
import { SystemUtilgjengelig } from './common/SystemUtilgjengelig.tsx'
import { fetcher } from './common/api/api.ts'
import { ProvideFeatureTogglesContext } from './common/featureToggles/FeatureTogglesContext.tsx'
import { ProvideInnloggetInnbyggerContext } from './common/innloggetInnbygger/InnloggetInnbyggerContext.tsx'
import { ProvideSpraakContext } from './common/spraak/SpraakContext.tsx'
import { InntektsjusteringInnledning } from './inntektsjustering/1-innledning/InntektsjusteringInnledning.tsx'
import { InntektsjusteringInntektTilNesteAar } from './inntektsjustering/2-inntekt-til-neste-aar/InntektsjusteringInntektTilNesteAar.tsx'
import { InntektsjusteringOppsummering } from './inntektsjustering/3-oppsummering/InntektsjusteringOppsummering.tsx'
import { InntektsjusteringKvittering } from './inntektsjustering/4-kvittering/InntektsjusteringKvittering.tsx'
import { InntektsjusteringOutlet } from './inntektsjustering/InntektsjusteringOutlet.tsx'
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
                    path: '/inntekt',
                    element: <InntektsjusteringOutlet />,
                    children: [
                        {
                            path: '*',
                            element: <FantIkkeSiden />,
                        },
                        { path: `/inntekt/system-utilgjengelig`, element: <SystemUtilgjengelig /> },
                        {
                            path: `/inntekt/innledning`,
                            element: <InntektsjusteringInnledning />,
                        },
                        {
                            path: `/inntekt/inntekt-til-neste-aar`,
                            element: <InntektsjusteringInntektTilNesteAar />,
                        },
                        {
                            path: `/inntekt/oppsummering`,
                            element: <InntektsjusteringOppsummering />,
                        },
                        {
                            path: `/inntekt/kvittering`,
                            element: <InntektsjusteringKvittering />,
                        },
                    ],
                },
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
