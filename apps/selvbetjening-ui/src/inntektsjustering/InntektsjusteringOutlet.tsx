import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import {
    FeatureToggleNavn,
    FeatureToggleStatus,
    useFeatureToggle,
} from '../common/featureToggles/FeatureTogglesContext.tsx'
import { ProvideInntektContext } from './components/inntektContext/InntektContext.tsx'
import { InntektSkjemaLukket } from './components/inntektSkjemaLukket/InntektSkjemaLukket.tsx'

export const InntektsjusteringOutlet = () => {
    const omsInntetksjusteringSkjemaFeatureToggle = useFeatureToggle(FeatureToggleNavn.OMS_INNTEKTSJUSTERING_SKJEMA)

    useEffect(() => {
        document.title = 'Inntekt neste år'
    }, [])

    return (
        <ProvideInntektContext>
            {omsInntetksjusteringSkjemaFeatureToggle.status === FeatureToggleStatus.PAA ? (
                <Outlet />
            ) : (
                <InntektSkjemaLukket />
            )}
        </ProvideInntektContext>
    )
}
