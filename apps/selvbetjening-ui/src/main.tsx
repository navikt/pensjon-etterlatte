import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@navikt/ds-css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Inntektsjustering } from './inntektsjustering/Inntektsjustering.tsx'
import { AppOutlet } from './AppOutlet.tsx'
import { SystemUtilgjengelig } from './common/SystemUtilgjengelig.tsx'
import { Landing } from './Landing.tsx'

const router = createBrowserRouter(
    [
        {
            path: '/',
            element: <AppOutlet />,
            errorElement: <SystemUtilgjengelig />,
            children: [
                { path: '/', element: <Landing /> },
                {
                    path: '/inntektsjustering',
                    element: <Inntektsjustering />,
                },
            ],
        },
    ],
    { basename: '/selvbetjening' }
)

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>
)
