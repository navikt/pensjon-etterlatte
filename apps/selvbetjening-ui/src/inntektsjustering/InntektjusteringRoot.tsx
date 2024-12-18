import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { SystemUtilgjengelig } from '../common/SystemUtilgjengelig.tsx'
import { FantIkkeSiden } from '../common/FantIkkeSiden.tsx'
import { InntektsjusteringInnledning } from './1-innledning/InntektsjusteringInnledning.tsx'
import { InntektsjusteringInntektTilNesteAar } from './2-inntekt-til-neste-aar/InntektsjusteringInntektTilNesteAar.tsx'
import { InntektsjusteringOppsummering } from './3-oppsummering/InntektsjusteringOppsummering.tsx'
import { InntektsjusteringKvittering } from './4-kvittering/InntektsjusteringKvittering.tsx'
import { ProvideInntektContext } from './components/inntektContext/InntektContext.tsx'

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
                { path: `/system-utilgjengelig`, element: <SystemUtilgjengelig /> },
                {
                    path: `/innledning`,
                    element: <InntektsjusteringInnledning />,
                },
                {
                    path: `/inntekt-til-neste-aar`,
                    element: <InntektsjusteringInntektTilNesteAar />,
                },
                {
                    path: `/oppsummering`,
                    element: <InntektsjusteringOppsummering />,
                },
                {
                    path: `/kvittering`,
                    element: <InntektsjusteringKvittering />,
                },
            ],
        },
    ],
    { basename: '/omstillingsstonad/skjema/inntekt' }
)

export const InntektsjusteringRoot = () => {
    return (
        <ProvideInntektContext>
            <RouterProvider router={router} />
        </ProvideInntektContext>
    )
}
