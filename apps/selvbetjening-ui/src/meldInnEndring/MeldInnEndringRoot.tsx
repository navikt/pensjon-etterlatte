import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { SystemUtilgjengelig } from '../common/SystemUtilgjengelig.tsx'
import { FantIkkeSiden } from '../common/FantIkkeSiden.tsx'
import { MeldInnEndringSkjema } from './meldInnEndringSkjema/MeldInnEndringSkjema.tsx'
import {
    FeatureToggleNavn,
    FeatureToggleStatus,
    useFeatureToggle,
} from '../common/featureToggles/FeatureTogglesContext.tsx'

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
    const omsMeldInnEndringerSkjemaFeatureToggle = useFeatureToggle(FeatureToggleNavn.OMS_MELD_INN_ENDRING_SKJEMA)

    return (
        omsMeldInnEndringerSkjemaFeatureToggle.status === FeatureToggleStatus.PAA && <RouterProvider router={router} />
    )
}
