import { Heading } from '@navikt/ds-react'
import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import {
    FeatureToggleNavn,
    FeatureToggleStatus,
    useFeatureToggle,
} from '../common/featureToggles/FeatureTogglesContext.tsx'
import { ProvideMeldInnEndringContext } from './components/meldInnEndringContext/MeldInnEndringContext.tsx'

export const MeldInnEndringOutlet = () => {
    const omsMeldInnEndringerSkjemaFeatureToggle = useFeatureToggle(FeatureToggleNavn.OMS_MELD_INN_ENDRING_SKJEMA)

    useEffect(() => {
        document.title = 'Meld inn endring'
    }, [])

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
