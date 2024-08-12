import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@navikt/ds-css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Inntektsjustering } from './inntektsjustering/Inntektsjustering.tsx'
import { AppOutlet } from './AppOutlet.tsx'

const router = createBrowserRouter(
    [
        {
            path: '/',
            element: <AppOutlet />,
            children: [
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
