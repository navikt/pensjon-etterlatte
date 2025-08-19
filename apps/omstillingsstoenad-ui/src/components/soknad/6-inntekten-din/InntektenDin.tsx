import { Box, GuidePanel, Heading, VStack } from '@navikt/ds-react'
import { differenceInYears } from 'date-fns'
import { FormProvider, useForm } from 'react-hook-form'
import { FieldErrors } from 'react-hook-form/dist/types/errors'
import { useTranslation } from 'react-i18next'
import { useBrukerContext } from '~context/bruker/BrukerContext'
import { LogEvents, useAnalytics } from '~hooks/useAnalytics'
import { IInntekt } from '~typer/inntekt'
import { erEldreEnnSekstiEn } from '~utils/alder'
import { erMellomOktoberogDesember } from '~utils/dato'
import { useSoknadContext } from '../../../context/soknad/SoknadContext'
import { ActionTypes } from '../../../context/soknad/soknad'
import SoknadSteg from '../../../typer/SoknadSteg'
import { deepCopy } from '../../../utils/deepCopy'
import Feilmeldinger from '../../felles/Feilmeldinger'
import Navigasjon from '../../felles/Navigasjon'
import { ForventetInntektIAar } from './fragmenter/ForventetInntektIAar'
import { ForventetInntektTilNesteAar } from './fragmenter/ForventetInntektTilNesteAar'
import { InntektFremTilDoedsfallet } from './fragmenter/InntektFremTilDoedsfallet'
import { SkalGaaAvMedAlderspensjon } from './fragmenter/SkalGaaAvMedAlderspensjon'
import YtelserAndre from './fragmenter/YtelserAndre'
import YtelserNAV from './fragmenter/YtelserNAV'

const InntektenDin = ({ neste, forrige }: SoknadSteg) => {
    const { t } = useTranslation()
    const { logEvent } = useAnalytics()

    const { state, dispatch } = useSoknadContext()

    const { state: bruker } = useBrukerContext()

    const methods = useForm<IInntekt>({
        defaultValues: state.inntektenDin || {},
        shouldUnregister: true,
    })

    const {
        handleSubmit,
        formState: { errors },
        getValues,
        watch,
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

    const harSvartAtGaarAvMedAlderspensjonIAar = (datoForAaGaaAvMedAlderspensjon?: string): boolean => {
        if (!!datoForAaGaaAvMedAlderspensjon) {
            return new Date(datoForAaGaaAvMedAlderspensjon).getFullYear() === new Date().getFullYear()
        }

        return false
    }

    const erValidert = state.inntektenDin.erValidert

    return (
        <FormProvider {...methods}>
            <form onSubmit={(e) => e.preventDefault()}>
                <Box marginBlock="4">
                    <Heading size={'medium'} className={'center'}>
                        {t('inntektenDin.tittel')}
                    </Heading>
                </Box>

                <Box marginBlock="0 12">
                    <GuidePanel>{t('inntektenDin.ingress')}</GuidePanel>
                </Box>

                <VStack gap="12" paddingBlock="0 12">
                    {erEldreEnnSekstiEn(bruker) ? (
                        <>
                            <SkalGaaAvMedAlderspensjon />
                            {!!watch('skalGaaAvMedAlderspensjon.valg') && (
                                <>
                                    <VStack gap="6">
                                        <Heading size="medium">{t('inntektenDin.inntekteneDine.tittel')}</Heading>

                                        <InntektFremTilDoedsfallet />
                                    </VStack>

                                    <ForventetInntektIAar />
                                    {!harSvartAtGaarAvMedAlderspensjonIAar(
                                        watch('skalGaaAvMedAlderspensjon.datoForAaGaaAvMedAlderspensjon')
                                    ) &&
                                        erMellomOktoberogDesember() && <ForventetInntektTilNesteAar />}
                                </>
                            )}
                        </>
                    ) : (
                        <>
                            <VStack gap="6">
                                <Heading size="medium">{t('inntektenDin.inntekteneDine.tittel')}</Heading>

                                <InntektFremTilDoedsfallet />
                            </VStack>

                            <ForventetInntektIAar />

                            {erMellomOktoberogDesember() && <ForventetInntektTilNesteAar />}
                        </>
                    )}
                </VStack>

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
