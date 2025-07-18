import { Box, GuidePanel, Heading } from '@navikt/ds-react'
import { FormProvider, useForm } from 'react-hook-form'
import { FieldErrors } from 'react-hook-form/dist/types/errors'
import { useTranslation } from 'react-i18next'
import { LogEvents, useAnalytics } from '~hooks/useAnalytics'
import { useBrukerContext } from '../../../context/bruker/BrukerContext'
import { useSoknadContext } from '../../../context/soknad/SoknadContext'
import { ActionTypes } from '../../../context/soknad/soknad'
import SoknadSteg from '../../../typer/SoknadSteg'
import { IMerOmSituasjonenDin, JobbStatus } from '../../../typer/situasjon'
import { deepCopy } from '../../../utils/deepCopy'
import Feilmeldinger from '../../felles/Feilmeldinger'
import Navigasjon from '../../felles/Navigasjon'
import { RHFCheckboksGruppe } from '../../felles/rhf/RHFCheckboksPanelGruppe'
import AnnenSituasjon from './fragmenter/AnnenSituasjon'
import Arbeidssoeker from './fragmenter/Arbeidssoeker'
import EtablererVirksomhet from './fragmenter/EtablererVirksomhet'
import HoeyesteUtdanning from './fragmenter/HoeyesteUtdanning'
import NavaerendeArbeidsforhold from './fragmenter/NavaerendeArbeidsforhold'
import TilbudOmJobb from './fragmenter/TilbudOmJobb'
import UnderUtdanning from './fragmenter/UnderUtdanning'

const MerOmSituasjonenDin = ({ neste, forrige }: SoknadSteg) => {
    const { t } = useTranslation()
    const { logEvent } = useAnalytics()

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
                <Box marginBlock="4">
                    <Heading size={'medium'} className={'center'}>
                        {t('merOmSituasjonenDin.tittel')}
                    </Heading>
                </Box>

                <Box marginBlock="0 12">
                    <GuidePanel>{t('merOmSituasjonenDin.ingress')}</GuidePanel>
                </Box>

                {!brukerState.adressebeskyttelse && (
                    <>
                        <Box marginBlock="0 12">
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
                        </Box>

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
