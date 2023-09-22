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
import { IInntekt } from '../../../typer/inntekt'

const InntektenDin: SoknadSteg = ({ neste, forrige }) => {
    const { t } = useTranslation()

    const { state, dispatch } = useSoknadContext()

    const methods = useForm<IInntekt>({
        defaultValues: state.dinSituasjon || {},
        shouldUnregister: true,
    })

    const {
        handleSubmit,
        formState: { errors },
        getValues,
    } = methods

    const lagreNeste = (data: IInntekt) => {
        dispatch({ type: ActionTypes.OPPDATER_INNTEKTEN_DIN, payload: { ...deepCopy(data), erValidert: true } })
        neste!!()
    }

    const lagreTilbake = (data: IInntekt) => {
        dispatch({ type: ActionTypes.OPPDATER_INNTEKTEN_DIN, payload: { ...deepCopy(data), erValidert: true } })
        forrige!!()
    }

    const lagreTilbakeUtenValidering = () => {
        const verdier = getValues()
        dispatch({ type: ActionTypes.OPPDATER_INNTEKTEN_DIN, payload: { ...deepCopy(verdier), erValidert: false } })
        forrige!!()
    }

    const erValidert = state.inntektenDin.erValidert

    return (
        <FormProvider {...methods}>
            <form>
                <SkjemaElement>
                    <Heading size={'medium'} className={'center'}>
                        {t('inntektenDin.tittel')}
                    </Heading>
                </SkjemaElement>

                <SkjemaGruppe>
                    <GuidePanel>
                        <Heading size={'small'}>{t('dinSituasjon.undertittel')}</Heading>
                        {t('dinSituasjon.ingress')}
                    </GuidePanel>
                </SkjemaGruppe>

                <Feilmeldinger errors={errors} />

                <Navigasjon
                    forrige={{ onClick: erValidert === true ? handleSubmit(lagreTilbake) : lagreTilbakeUtenValidering }}
                    neste={{ onClick: handleSubmit(lagreNeste) }}
                />
            </form>
        </FormProvider>
    )
}

export default InntektenDin
