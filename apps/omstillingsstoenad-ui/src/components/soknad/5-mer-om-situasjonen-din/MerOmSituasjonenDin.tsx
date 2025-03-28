import SoknadSteg from '../../../typer/SoknadSteg'
import { SkjemaGruppe } from '../../felles/SkjemaGruppe'
import { IMerOmSituasjonenDin, JobbStatus } from '../../../typer/situasjon'
import { FormProvider, useForm } from 'react-hook-form'
import { ActionTypes } from '../../../context/soknad/soknad'
import { useSoknadContext } from '../../../context/soknad/SoknadContext'
import NavaerendeArbeidsforhold from './fragmenter/NavaerendeArbeidsforhold'
import Feilmeldinger from '../../felles/Feilmeldinger'
import HoeyesteUtdanning from './fragmenter/HoeyesteUtdanning'
import Navigasjon from '../../felles/Navigasjon'
import { useTranslation } from 'react-i18next'
import UnderUtdanning from './fragmenter/UnderUtdanning'
import { GuidePanel, Heading } from '@navikt/ds-react'
import { RHFCheckboksGruppe } from '../../felles/rhf/RHFCheckboksPanelGruppe'
import { deepCopy } from '../../../utils/deepCopy'
import { useBrukerContext } from '../../../context/bruker/BrukerContext'
import { SkjemaElement } from '../../felles/SkjemaElement'
import EtablererVirksomhet from './fragmenter/EtablererVirksomhet'
import TilbudOmJobb from './fragmenter/TilbudOmJobb'
import Arbeidssoeker from './fragmenter/Arbeidssoeker'
import AnnenSituasjon from './fragmenter/AnnenSituasjon'
import styled from 'styled-components'
import { LogEvents, useAmplitude } from '~hooks/useAmplitude'
import { FieldErrors } from 'react-hook-form/dist/types/errors'

const DynamicSpacing = styled.div<{ $margin: boolean }>`
    margin-bottom: ${(props) => (!props.$margin ? '3rem' : '')};
`

const MerOmSituasjonenDin = ({ neste, forrige }: SoknadSteg) => {
    const { t } = useTranslation()
    const { logEvent } = useAmplitude()

    const { state, dispatch } = useSoknadContext()
    const brukerState = useBrukerContext().state

    const methods = useForm<IMerOmSituasjonenDin>({
        defaultValues: state.merOmSituasjonenDin || {},
        shouldUnregister: true,
    })

    const {
        handleSubmit,
        formState: { errors },
        getValues,
        watch,
    } = methods

    const lagreNeste = (data: IMerOmSituasjonenDin) => {
        dispatch({
            type: ActionTypes.OPPDATER_MER_OM_SITUASJONEN_DIN,
            payload: { ...deepCopy(data), erValidert: true },
        })
        neste!()
    }

    const lagreTilbake = (data: IMerOmSituasjonenDin) => {
        dispatch({
            type: ActionTypes.OPPDATER_MER_OM_SITUASJONEN_DIN,
            payload: { ...deepCopy(data), erValidert: true },
        })
        forrige!()
    }

    const lagreTilbakeUtenValidering = () => {
        const verdier = getValues()
        dispatch({
            type: ActionTypes.OPPDATER_MER_OM_SITUASJONEN_DIN,
            payload: { ...deepCopy(verdier), erValidert: false },
        })
        forrige!()
    }

    const logErrors = (data: FieldErrors<IMerOmSituasjonenDin>) => {
        Object.keys(data).map((error) =>
            logEvent(LogEvents.VALIDATION_ERROR, { skjemanavn: 'MerOmSituasjonenDin', id: error })
        )
    }

    const erValidert = state.merOmSituasjonenDin.erValidert
    const jobbStatus = watch('jobbStatus')

    const selvstendigEllerArbeidstaker =
        jobbStatus?.includes(JobbStatus.selvstendig) || jobbStatus?.includes(JobbStatus.arbeidstaker)

    return (
        <FormProvider {...methods}>
            <form onSubmit={(e) => e.preventDefault()}>
                <SkjemaElement>
                    <Heading size={'medium'} className={'center'}>
                        {t('merOmSituasjonenDin.tittel')}
                    </Heading>
                </SkjemaElement>

                <SkjemaGruppe>
                    <GuidePanel>{t('merOmSituasjonenDin.ingress')}</GuidePanel>
                </SkjemaGruppe>

                {!brukerState.adressebeskyttelse && (
                    <>
                        <DynamicSpacing $margin={!!jobbStatus?.length}>
                            <Heading size={'small'} spacing>
                                {t('merOmSituasjonenDin.jobbStatus.tittel')}
                            </Heading>
                            <RHFCheckboksGruppe
                                name={'jobbStatus'}
                                legend={t('merOmSituasjonenDin.jobbStatus')}
                                description={t('merOmSituasjonenDin.jobbStatus.hvorfor')}
                                checkboxes={Object.values(JobbStatus).map((value) => {
                                    return { children: t(value), value, required: true }
                                })}
                            />

                            {selvstendigEllerArbeidstaker && <NavaerendeArbeidsforhold />}

                            {jobbStatus?.includes(JobbStatus.etablerer) && <EtablererVirksomhet />}

                            {jobbStatus?.includes(JobbStatus.tilbud) && <TilbudOmJobb />}

                            {jobbStatus?.includes(JobbStatus.arbeidssoeker) && <Arbeidssoeker />}

                            {jobbStatus?.includes(JobbStatus.underUtdanning) && <UnderUtdanning />}

                            {jobbStatus?.includes(JobbStatus.ingen) && <AnnenSituasjon />}
                        </DynamicSpacing>

                        <HoeyesteUtdanning />
                    </>
                )}

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

export default MerOmSituasjonenDin
