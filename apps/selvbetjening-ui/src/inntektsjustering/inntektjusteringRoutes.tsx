import { RouteObject } from 'react-router-dom'
import { SystemUtilgjengelig } from '../common/SystemUtilgjengelig.tsx'
import { InntektsjusteringInnledning } from './1-innledning/InntektsjusteringInnledning.tsx'
import { InntektsjusteringInntektTilNesteAar } from './2-inntekt-til-neste-aar/InntektsjusteringInntektTilNesteAar.tsx'
import { InntektsjusteringOppsummering } from './3-oppsummering/InntektsjusteringOppsummering.tsx'
import { InntektsjusteringKvittering } from './4-kvittering/InntektsjusteringKvittering.tsx'

const inntektjusteringBasePath = '/inntekt'

export const inntektjusteringRoutes: RouteObject[] = [
    { path: `${inntektjusteringBasePath}/system-utilgjengelig`, element: <SystemUtilgjengelig /> },
    {
        path: `${inntektjusteringBasePath}/innledning`,
        element: <InntektsjusteringInnledning />,
    },
    {
        path: `${inntektjusteringBasePath}/inntekt-til-neste-aar`,
        element: <InntektsjusteringInntektTilNesteAar />,
    },
    {
        path: `${inntektjusteringBasePath}/oppsummering`,
        element: <InntektsjusteringOppsummering />,
    },
    {
        path: `${inntektjusteringBasePath}/kvittering`,
        element: <InntektsjusteringKvittering />,
    },
]
