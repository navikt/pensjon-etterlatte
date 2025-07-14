import { Box, Heading } from '@navikt/ds-react'
import { FormProvider, useForm } from 'react-hook-form'
import { FieldErrors } from 'react-hook-form/dist/types/errors'
import { useTranslation } from 'react-i18next'
import { LogEvents, useAnalytics } from '~hooks/useAnalytics'
import { ISoekerOgAvdoed } from '~typer/person'
import { isDev } from '../../../api/axios'
import { useSoknadContext } from '../../../context/soknad/SoknadContext'
import { ActionTypes } from '../../../context/soknad/soknad'
import SoknadSteg from '../../../typer/SoknadSteg'
import { deepCopy } from '../../../utils/deepCopy'
import Feilmeldinger from '../../felles/Feilmeldinger'
import Navigasjon from '../../felles/Navigasjon'
import ForholdTilAvdoedeSkjema from './forholdTilAvdoede/ForholdTilAvdoedeSkjema'

const OmDegOgAvdoed = ({ neste, forrige }: SoknadSteg) => {
    const { t } = useTranslation()
    const { state, dispatch } = useSoknadContext()
    const { logEvent } = useAnalytics()

    const methods = useForm<ISoekerOgAvdoed>({
        defaultValues: state.omDegOgAvdoed || {},
        shouldUnregister: true,
    })

    const {
        handleSubmit,
        formState: { errors },
        getValues,
    } = methods

    const erValidert = state.omDegOgAvdoed.erValidert

    const lagreNeste = (data: ISoekerOgAvdoed) => {
        dispatch({ type: ActionTypes.OPPDATER_OM_DEG_OG_AVDOED, payload: { ...deepCopy(data), erValidert: true } })
        neste!()
    }

    const lagreTilbake = (data: ISoekerOgAvdoed) => {
        dispatch({ type: ActionTypes.OPPDATER_OM_DEG_OG_AVDOED, payload: { ...deepCopy(data), erValidert: true } })
        forrige!()
    }

    const lagreTilbakeUtenValidering = () => {
        const verdier = getValues()
        dispatch({ type: ActionTypes.OPPDATER_OM_DEG_OG_AVDOED, payload: { ...deepCopy(verdier), erValidert: false } })
        forrige!()
    }

    const logErrors = (data: FieldErrors<ISoekerOgAvdoed>) => {
        Object.keys(data).map((error) =>
            logEvent(LogEvents.VALIDATION_ERROR, { skjemanavn: 'OmDegOgAvdoed', id: error })
        )
    }

    return (
        <>
            <Box marginBlock="4">
                <Heading size={'medium'} className={'center'}>
                    {t('omDegOgAvdoed.tittel')}
                </Heading>
            </Box>

            <FormProvider {...methods}>
                <form onSubmit={(e) => e.preventDefault()} autoComplete={isDev ? 'on' : 'off'}>
                    <ForholdTilAvdoedeSkjema />

                    <Feilmeldinger errors={errors} />

                    <Navigasjon
                        forrige={{
                            onClick:
                                erValidert === true
                                    ? handleSubmit(lagreTilbake, logErrors)
                                    : lagreTilbakeUtenValidering,
                        }}
                        neste={{ onClick: handleSubmit(lagreNeste, logErrors) }}
                    />
                </form>
            </FormProvider>
        </>
    )
}

export default OmDegOgAvdoed
