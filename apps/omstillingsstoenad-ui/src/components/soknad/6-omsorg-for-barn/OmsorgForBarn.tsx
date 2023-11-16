import React from 'react'
import SoknadSteg from '../../../typer/SoknadSteg'
import { useSoknadContext } from '../../../context/soknad/SoknadContext'
import { IOmsorgForBarn } from '../../../typer/person'
import { ActionTypes } from '../../../context/soknad/soknad'
import { useTranslation } from 'react-i18next'
import Navigasjon from '../../felles/Navigasjon'
import { BodyShort, GuidePanel, Heading } from '@navikt/ds-react'
import { FormProvider, useForm } from 'react-hook-form'
import { deepCopy } from '../../../utils/deepCopy'
import { SkjemaElement } from '../../felles/SkjemaElement'
import { RHFSpoersmaalRadio } from '../../felles/rhf/RHFRadio'
import { IValg } from '../../../typer/Spoersmaal'
import { SkjemaGruppe } from '../../felles/SkjemaGruppe'

const OmsorgForBarn: SoknadSteg = ({ neste, forrige }) => {
    const { t } = useTranslation()
    const { state, dispatch } = useSoknadContext()

    const methods = useForm<IOmsorgForBarn>({
        defaultValues: state.omsorgForBarn || {},
    })

    const { getValues, handleSubmit, watch } = methods

    const erValidert = state.omsorgForBarn.erValidert

    const lagreNeste = (data: IOmsorgForBarn) => {
        dispatch({ type: ActionTypes.OPPDATER_OMSORG_FOR_BARN, payload: { ...deepCopy(data), erValidert: true } })
        neste!!()
    }

    const lagreTilbake = (data: IOmsorgForBarn) => {
        dispatch({ type: ActionTypes.OPPDATER_OMSORG_FOR_BARN, payload: { ...deepCopy(data), erValidert: true } })
        forrige!!()
    }

    const lagreTilbakeUtenValidering = () => {
        const verdier = getValues()
        dispatch({ type: ActionTypes.OPPDATER_OMSORG_FOR_BARN, payload: { ...deepCopy(verdier), erValidert: false } })
        forrige!!()
    }

    const harOmsorg = watch('omsorgMinstFemti')

    return (
        <FormProvider {...methods}>
            <form>
                <SkjemaElement>
                    <Heading size={'medium'} className={'center'}>
                        {t('omsorgForBarn.tittel')}
                    </Heading>
                </SkjemaElement>

                <SkjemaGruppe>
                    <GuidePanel>
                        <BodyShort>{t('omsorgForBarn.ingress')}</BodyShort>
                    </GuidePanel>
                </SkjemaGruppe>

                <SkjemaElement>
                    <RHFSpoersmaalRadio name={'omsorgMinstFemti'} legend={t('omsorgForBarn.omsorgMinst50')} />
                </SkjemaElement>

                {harOmsorg === IValg.JA && (
                    <>
                        <SkjemaGruppe>
                            <BodyShort>Her kommer det noe mer info hvis man har omsorg</BodyShort>
                        </SkjemaGruppe>
                    </>
                )}

                <Navigasjon
                    forrige={{
                        onClick: erValidert === true ? handleSubmit(lagreTilbake) : lagreTilbakeUtenValidering,
                    }}
                    neste={{ onClick: handleSubmit(lagreNeste) }}
                />
            </form>
        </FormProvider>
    )
}

export default OmsorgForBarn
