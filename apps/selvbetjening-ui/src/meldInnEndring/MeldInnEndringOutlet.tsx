import {
    FeatureToggleNavn,
    FeatureToggleStatus,
    useFeatureToggle,
} from '../common/featureToggles/FeatureTogglesContext.tsx'
import { Outlet } from 'react-router-dom'
import { Heading } from '@navikt/ds-react'
import { ProvideMeldInnEndringContext } from './components/meldInnEndringContext/MeldInnEndringContext.tsx'

export const MeldInnEndringOutlet = () => {
    const omsMeldInnEndringerSkjemaFeatureToggle = useFeatureToggle(FeatureToggleNavn.OMS_MELD_INN_ENDRING_SKJEMA)

    return omsMeldInnEndringerSkjemaFeatureToggle.status === FeatureToggleStatus.PAA ? (
        <ProvideMeldInnEndringContext>
            <Outlet />
        </ProvideMeldInnEndringContext>
    ) : (
        <Heading size="large" level="2">
            Skjema ikke tilgjengelig
        </Heading>
    )
}
