import { BodyShort, GuidePanel, Heading } from '@navikt/ds-react'
import { FormProvider, useForm } from 'react-hook-form'
import { FieldErrors } from 'react-hook-form/dist/types/errors'
import { useTranslation } from 'react-i18next'
import { FeatureToggleNavn, FeatureToggleStatus, useFeatureToggle } from '~context/featureToggle/FeatureToggleContext'
import { LogEvents, useAmplitude } from '~hooks/useAmplitude'
import { IInntekt } from '~typer/inntekt'
import { useSoknadContext } from '../../../context/soknad/SoknadContext'
import { ActionTypes } from '../../../context/soknad/soknad'
import SoknadSteg from '../../../typer/SoknadSteg'
import { deepCopy } from '../../../utils/deepCopy'
import Feilmeldinger from '../../felles/Feilmeldinger'
import Navigasjon from '../../felles/Navigasjon'
import { SkjemaElement } from '../../felles/SkjemaElement'
import { SkjemaGruppe } from '../../felles/SkjemaGruppe'
import Inntekt from './fragmenter/Inntekt'
import YtelserAndre from './fragmenter/YtelserAndre'
import YtelserNAV from './fragmenter/YtelserNAV'

const InntektenDin = ({ neste, forrige }: SoknadSteg) => {
    const { t } = useTranslation()
    const { logEvent } = useAmplitude()

    const omsSoeknadNyttInntektStegFeatureToggle = useFeatureToggle(FeatureToggleNavn.OMS_SOEKNAD_NYTT_INNTEKT_STEG)

    const { state, dispatch } = useSoknadContext()

    const methods = useForm<IInntekt>({
        defaultValues: state.inntektenDin || {},
        shouldUnregister: true,
    })

    const {
        handleSubmit,
        formState: { errors },
        getValues,
    } = methods

    const lagreNeste = (data: IInntekt) => {
        dispatch({ type: ActionTypes.OPPDATER_INNTEKTEN_DIN, payload: { ...deepCopy(data), erValidert: true } })
        neste!()
    }

    const lagreTilbake = (data: IInntekt) => {
        dispatch({ type: ActionTypes.OPPDATER_INNTEKTEN_DIN, payload: { ...deepCopy(data), erValidert: true } })
        forrige!()
    }

    const lagreTilbakeUtenValidering = () => {
        const verdier = getValues()
        dispatch({ type: ActionTypes.OPPDATER_INNTEKTEN_DIN, payload: { ...deepCopy(verdier), erValidert: false } })
        forrige!()
    }

    const logErrors = (data: FieldErrors<IInntekt>) => {
        Object.keys(data).map((error) =>
            logEvent(LogEvents.VALIDATION_ERROR, { skjemanavn: 'InntektenDin', id: error })
        )
    }

    const erValidert = state.inntektenDin.erValidert

    return (
        <FormProvider {...methods}>
            <form onSubmit={(e) => e.preventDefault()}>
                <SkjemaElement>
                    <Heading size={'medium'} className={'center'}>
                        {t('inntektenDin.tittel')}
                    </Heading>
                </SkjemaElement>

                <SkjemaGruppe>
                    <GuidePanel>{t('inntektenDin.ingress')}</GuidePanel>
                </SkjemaGruppe>

                {omsSoeknadNyttInntektStegFeatureToggle.status === FeatureToggleStatus.PAA && (
                    <BodyShort>Jeg er en feature toggle, og jeg er på kun i dev</BodyShort>
                )}

                <Inntekt />

                <YtelserNAV />

                <YtelserAndre />

                <Feilmeldinger errors={errors} />

                <Navigasjon
                    forrige={{
                        onClick:
                            erValidert === true ? handleSubmit(lagreTilbake, logErrors) : lagreTilbakeUtenValidering,
                    }}
                    neste={{ onClick: handleSubmit(lagreNeste, logErrors) }}
                />
            </form>
        </FormProvider>
    )
}

export default InntektenDin
