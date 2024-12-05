import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { SystemUtilgjengelig } from '../common/SystemUtilgjengelig.tsx'
import { FantIkkeSiden } from '../common/FantIkkeSiden.tsx'
import { MeldInnEndringSkjema } from './meldInnEndringSkjema/MeldInnEndringSkjema.tsx'
import { useState } from 'react'

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
                { path: '/meld-inn', element: <MeldInnEndringSkjema /> },
            ],
        },
    ],
    { basename: '/omstillingsstonad/meld-inn-endring' }
)

export const MeldInnEndringRoot = () => {
    // TODO: denne vil bli erstattet med unleash feature toggle i neste PR
    const [skalVise] = useState<boolean>(false)

    return skalVise && <RouterProvider router={router} />
}
