import SoknadSteg from '../../../typer/SoknadSteg'
import { SkjemaGruppe } from '../../felles/SkjemaGruppe'
import { ISituasjon, JobbStatus } from '../../../typer/situasjon'
import { IngenJobb } from '../../../typer/arbeidsforhold'
import { FormProvider, useForm } from 'react-hook-form'
import { ActionTypes } from '../../../context/soknad/soknad'
import { useSoknadContext } from '../../../context/soknad/SoknadContext'
import NavaerendeArbeidsforhold from './fragmenter/NavaerendeArbeidsforhold'
import Feilmeldinger from '../../felles/Feilmeldinger'
import AndreYtelser from './fragmenter/AndreYtelser'
import HoeyesteUtdanning from './fragmenter/HoeyesteUtdanning'
import Navigasjon from '../../felles/Navigasjon'
import { useTranslation } from 'react-i18next'
import UnderUtdanning from './fragmenter/UnderUtdanning'
import { RHFSelect } from '../../felles/rhf/RHFSelect'
import { BodyLong, Heading } from '@navikt/ds-react'
import { RHFCheckboksGruppe } from '../../felles/rhf/RHFCheckboksPanelGruppe'
import { deepCopy } from '../../../utils/deepCopy'
import { useBrukerContext } from '../../../context/bruker/BrukerContext'
import { SkjemaElement } from '../../felles/SkjemaElement'

const InntektenDin: SoknadSteg = ({ neste, forrige }) => {
    const { t } = useTranslation()

    const { state, dispatch } = useSoknadContext()
    const brukerState = useBrukerContext().state

    const methods = useForm<ISituasjon>({
        defaultValues: state.dinSituasjon || {},
        shouldUnregister: true,
    })

    const {
        handleSubmit,
        formState: { errors },
        getValues,
    } = methods

    const lagreNeste = (data: ISituasjon) => {
        dispatch({ type: ActionTypes.OPPDATER_INNTEKTEN_DIN, payload: { ...deepCopy(data), erValidert: true } })
        neste!!()
    }

    const lagreTilbake = (data: ISituasjon) => {
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
                    <Heading size={'small'}>{t('dinSituasjon.undertittel')}</Heading>
                    <BodyLong>{t('dinSituasjon.ingress')}</BodyLong>
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
