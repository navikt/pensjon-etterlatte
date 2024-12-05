import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { SystemUtilgjengelig } from '../common/SystemUtilgjengelig.tsx'
import { FantIkkeSiden } from '../common/FantIkkeSiden.tsx'
import { MeldInnEndringSkjema } from './meldInnEndringSkjema/MeldInnEndringSkjema.tsx'

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
    return <RouterProvider router={router} />
}
