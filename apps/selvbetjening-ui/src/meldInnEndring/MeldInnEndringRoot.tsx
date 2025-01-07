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
    { basename: '/omstillingsstonad/skjema/meld-inn-endring' }
)

export const MeldInnEndringRoot = () => {
    const [skalVise] = useState<boolean>(true)

    return skalVise && <RouterProvider router={router} />
}
