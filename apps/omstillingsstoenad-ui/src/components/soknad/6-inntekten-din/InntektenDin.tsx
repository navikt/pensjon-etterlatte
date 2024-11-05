import SoknadSteg from '../../../typer/SoknadSteg'
import { SkjemaGruppe } from '../../felles/SkjemaGruppe'
import { FormProvider, useForm } from 'react-hook-form'
import { ActionTypes } from '../../../context/soknad/soknad'
import { useSoknadContext } from '../../../context/soknad/SoknadContext'
import Feilmeldinger from '../../felles/Feilmeldinger'
import Navigasjon from '../../felles/Navigasjon'
import { useTranslation } from 'react-i18next'
import { GuidePanel, Heading } from '@navikt/ds-react'
import { deepCopy } from '../../../utils/deepCopy'
import { SkjemaElement } from '../../felles/SkjemaElement'
import { IInntekt } from '~typer/inntekt'
import Inntekt from './fragmenter/Inntekt'
import YtelserNAV from './fragmenter/YtelserNAV'
import YtelserAndre from './fragmenter/YtelserAndre'
import PropTypes from 'prop-types'
import { FieldErrors } from 'react-hook-form/dist/types/errors'
import { LogEvents, useAmplitude } from '~hooks/useAmplitude'

const InntektenDin: SoknadSteg = ({ neste, forrige }) => {
    const { t } = useTranslation()
    const { logEvent } = useAmplitude()

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

InntektenDin.propTypes = {
    neste: PropTypes.func,
    forrige: PropTypes.func,
}

export default InntektenDin
