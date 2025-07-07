import { GuidePanel, Heading, VStack } from '@navikt/ds-react'
import { FormProvider, useForm } from 'react-hook-form'
import { FieldErrors } from 'react-hook-form/dist/types/errors'
import { useTranslation } from 'react-i18next'
import { FeatureToggleNavn, FeatureToggleStatus, useFeatureToggle } from '~context/featureToggle/FeatureToggleContext'
import { LogEvents, useAmplitude } from '~hooks/useAmplitude'
import { IInntekt } from '~typer/inntekt'
import { erMellomOktoberogDesember } from '~utils/dato'
import { useSoknadContext } from '../../../context/soknad/SoknadContext'
import { ActionTypes } from '../../../context/soknad/soknad'
import SoknadSteg from '../../../typer/SoknadSteg'
import { deepCopy } from '../../../utils/deepCopy'
import Feilmeldinger from '../../felles/Feilmeldinger'
import Navigasjon from '../../felles/Navigasjon'
import { SkjemaElement } from '../../felles/SkjemaElement'
import { SkjemaGruppe } from '../../felles/SkjemaGruppe'
import { ForventetInntektIAar } from './fragmenter/ForventetInntektIAar'
import { ForventetInntektTilNesteAar } from './fragmenter/ForventetInntektTilNesteAar'
import Inntekt from './fragmenter/Inntekt'
import { InntektFremTilDoedsallet } from './fragmenter/InntektFremTilDoedsallet'
import { SkalGaaAvMedAlderspensjon } from './fragmenter/SkalGaaAvMedAlderspensjon'
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

    const skalViseSkjemaForInntektNesteAar = (): boolean => {
        if (omsSoeknadNyttInntektStegFeatureToggle.status === FeatureToggleStatus.PAA) {
            return true
        } else return erMellomOktoberogDesember()
    }

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

                {omsSoeknadNyttInntektStegFeatureToggle.status === FeatureToggleStatus.PAA ? (
                    <VStack gap="12" paddingBlock="0 12">
                        <SkalGaaAvMedAlderspensjon />

                        <VStack gap="6">
                            <Heading size="medium">{t('inntektenDin.inntekteneDine.tittel')}</Heading>

                            <InntektFremTilDoedsallet />
                        </VStack>

                        <ForventetInntektIAar />

                        {skalViseSkjemaForInntektNesteAar() && <ForventetInntektTilNesteAar />}
                    </VStack>
                ) : (
                    <Inntekt />
                )}

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
