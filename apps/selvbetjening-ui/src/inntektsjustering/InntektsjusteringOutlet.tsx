import { ProvideInntektContext } from './components/inntektContext/InntektContext.tsx'
import {
    FeatureToggleNavn,
    FeatureToggleStatus,
    useFeatureToggle,
} from '../common/featureToggles/FeatureTogglesContext.tsx'
import { InntektSkjemaLukket } from './components/inntektSkjemaLukket/InntektSkjemaLukket.tsx'
import { Outlet } from 'react-router-dom'
import { useEffect } from 'react'

export const InntektsjusteringOutlet = () => {
    const omsInntetksjusteringSkjemaFeatureToggle = useFeatureToggle(FeatureToggleNavn.OMS_INNTEKTSJUSTERING_SKJEMA)

    // useEffect(() => {
    //     document.title = 'Inntekt neste år'
    // }, [])

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
