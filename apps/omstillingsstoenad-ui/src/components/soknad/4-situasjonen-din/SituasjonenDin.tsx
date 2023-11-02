import SoknadSteg from '../../../typer/SoknadSteg'
import { SkjemaGruppe } from '../../felles/SkjemaGruppe'
import { ISituasjon, JobbStatus } from '../../../typer/situasjon'
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

const DynamicSpacing = styled.div<{ $margin: boolean }>`
    margin-bottom: ${(props) => (!props.$margin ? '3rem' : '')};
`

const SituasjonenDin: SoknadSteg = ({ neste, forrige }) => {
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
        watch,
    } = methods

    const lagreNeste = (data: ISituasjon) => {
        dispatch({ type: ActionTypes.OPPDATER_DIN_SITUASJON, payload: { ...deepCopy(data), erValidert: true } })
        neste!!()
    }

    const lagreTilbake = (data: ISituasjon) => {
        dispatch({ type: ActionTypes.OPPDATER_DIN_SITUASJON, payload: { ...deepCopy(data), erValidert: true } })
        forrige!!()
    }

    const lagreTilbakeUtenValidering = () => {
        const verdier = getValues()
        dispatch({ type: ActionTypes.OPPDATER_DIN_SITUASJON, payload: { ...deepCopy(verdier), erValidert: false } })
        forrige!!()
    }

    const erValidert = state.dinSituasjon.erValidert
    const jobbStatus = watch('jobbStatus')

    const selvstendigEllerArbeidstaker =
        jobbStatus?.includes(JobbStatus.selvstendigAS) ||
        jobbStatus?.includes(JobbStatus.arbeidstaker) ||
        jobbStatus?.includes(JobbStatus.selvstendigENK)

    return (
        <FormProvider {...methods}>
            <form>
                <SkjemaElement>
                    <Heading size={'medium'} className={'center'}>
                        {t('dinSituasjon.tittel')}
                    </Heading>
                </SkjemaElement>

                <SkjemaGruppe>
                    <GuidePanel>{t('dinSituasjon.ingress')}</GuidePanel>
                </SkjemaGruppe>

                {!brukerState.adressebeskyttelse && (
                    <>
                        <DynamicSpacing $margin={!!jobbStatus?.length}>
                            <Heading size={'small'} spacing>
                                {t('dinSituasjon.jobbStatus.tittel')}
                            </Heading>
                            <RHFCheckboksGruppe
                                name={'jobbStatus'}
                                legend={t('dinSituasjon.jobbStatus')}
                                description={t('dinSituasjon.jobbStatus.hvorfor')}
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
                    forrige={{ onClick: erValidert === true ? handleSubmit(lagreTilbake) : lagreTilbakeUtenValidering }}
                    neste={{ onClick: handleSubmit(lagreNeste) }}
                />
            </form>
        </FormProvider>
    )
}

export default SituasjonenDin
