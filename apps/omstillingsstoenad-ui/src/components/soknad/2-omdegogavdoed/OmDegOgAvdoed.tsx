import SoknadSteg from '../../../typer/SoknadSteg'
import { useTranslation } from 'react-i18next'
import { useSoknadContext } from '../../../context/soknad/SoknadContext'
import { ISoekerOgAvdoed } from '../../../typer/person'
import { ActionTypes } from '../../../context/soknad/soknad'
import { FormProvider, useForm } from 'react-hook-form'
import ForholdTilAvdoedeSkjema from './forholdTilAvdoede/ForholdTilAvdoedeSkjema'
import Feilmeldinger from '../../felles/Feilmeldinger'
import { Heading } from '@navikt/ds-react'
import Navigasjon from '../../felles/Navigasjon'
import { deepCopy } from '../../../utils/deepCopy'
import { SkjemaElement } from '../../felles/SkjemaElement'

const OmDegOgAvdoed: SoknadSteg = ({ neste, forrige }) => {
    const { t } = useTranslation()
    const { state, dispatch } = useSoknadContext()

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
        neste!!()
    }

    const lagreTilbake = (data: ISoekerOgAvdoed) => {
        dispatch({ type: ActionTypes.OPPDATER_OM_DEG_OG_AVDOED, payload: { ...deepCopy(data), erValidert: true } })
        forrige!!()
    }

    const lagreTilbakeUtenValidering = () => {
        const verdier = getValues()
        dispatch({ type: ActionTypes.OPPDATER_OM_DEG_OG_AVDOED, payload: { ...deepCopy(verdier), erValidert: false } })
        forrige!!()
    }

    return (
        <>
            <SkjemaElement>
                <Heading size={'medium'} className={'center'}>
                    {t('omDegOgAvdoed.tittel')}
                </Heading>
            </SkjemaElement>

            <FormProvider {...methods}>
                <form>
                    <ForholdTilAvdoedeSkjema />

                    <Feilmeldinger errors={errors} />

                    <Navigasjon
                        forrige={{
                            onClick: erValidert === true ? handleSubmit(lagreTilbake) : lagreTilbakeUtenValidering,
                        }}
                        neste={{ onClick: handleSubmit(lagreNeste) }}
                    />
                </form>
            </FormProvider>
        </>
    )
}

export default OmDegOgAvdoed
