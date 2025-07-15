import { Alert, BodyShort, Box, GuidePanel, Heading, HGrid, List } from '@navikt/ds-react'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { FieldErrors } from 'react-hook-form/dist/types/errors'
import { useTranslation } from 'react-i18next'
import { RHFCombobox } from '~components/felles/rhf/RHFCombobox'
import { LogEvents, useAnalytics } from '~hooks/useAnalytics'
import { ISituasjonenDin } from '~typer/person'
import { isDev } from '../../../api/axios'
import { useSoknadContext } from '../../../context/soknad/SoknadContext'
import { ActionTypes } from '../../../context/soknad/soknad'
import useCountries from '../../../hooks/useCountries'
import SoknadSteg from '../../../typer/SoknadSteg'
import { IValg } from '../../../typer/Spoersmaal'
import { deepCopy } from '../../../utils/deepCopy'
import Datovelger from '../../felles/Datovelger'
import Feilmeldinger from '../../felles/Feilmeldinger'
import Navigasjon from '../../felles/Navigasjon'
import { RHFSpoersmaalRadio } from '../../felles/rhf/RHFRadio'
import NySivilstatus from '../2-omdegogavdoed/nySivilstatus/NySivilstatus'

const SituasjonenDin = ({ neste, forrige }: SoknadSteg) => {
    const { t } = useTranslation()
    const { state, dispatch } = useSoknadContext()
    // biome-ignore lint/suspicious/noExplicitAny: gammel kode, venter med å fikse
    const { countries }: { countries: any } = useCountries()
    const { logEvent } = useAnalytics()

    const methods = useForm<ISituasjonenDin>({
        defaultValues: state.situasjonenDin || {},
    })

    const {
        getValues,
        formState: { errors },
        handleSubmit,
        watch,
    } = methods

    const erValidert = state.situasjonenDin.erValidert

    const lagreNeste = (data: ISituasjonenDin) => {
        dispatch({ type: ActionTypes.OPPDATER_SITUASJONEN_DIN, payload: { ...deepCopy(data), erValidert: true } })
        neste!()
    }

    const lagreTilbake = (data: ISituasjonenDin) => {
        dispatch({ type: ActionTypes.OPPDATER_SITUASJONEN_DIN, payload: { ...deepCopy(data), erValidert: true } })
        forrige!()
    }

    const lagreTilbakeUtenValidering = () => {
        const verdier = getValues()
        dispatch({ type: ActionTypes.OPPDATER_SITUASJONEN_DIN, payload: { ...deepCopy(verdier), erValidert: false } })
        forrige!()
    }

    const logErrors = (data: FieldErrors<ISituasjonenDin>) => {
        Object.keys(data).map((error) =>
            logEvent(LogEvents.VALIDATION_ERROR, { skjemanavn: 'SituasjonenDin', id: error })
        )
    }

    const harOmsorg = watch('omsorgMinstFemti')
    const bosattINorge = watch('bosattINorge')
    const oppholderSegIUtlandet = watch('oppholderSegIUtlandet.svar')
    const oppholdFra = watch('oppholderSegIUtlandet.oppholdFra')

    return (
        <FormProvider {...methods}>
            <form onSubmit={(e) => e.preventDefault()} autoComplete={isDev ? 'on' : 'off'}>
                <Box marginBlock="4">
                    <Heading size={'medium'} className={'center'}>
                        {t('situasjonenDin.tittel')}
                    </Heading>
                </Box>

                <Box marginBlock="0 12">
                    <GuidePanel>
                        <BodyShort>{t('situasjonenDin.ingress')}</BodyShort>
                        <List as={'ul'}>
                            <List.Item>{t('situasjonenDin.ingress.li1')}</List.Item>
                            <List.Item>{t('situasjonenDin.ingress.li2')}</List.Item>
                            <List.Item>{t('situasjonenDin.ingress.li3')}</List.Item>
                        </List>
                    </GuidePanel>
                </Box>

                <NySivilstatus />

                <Box marginBlock="0 12">
                    <Box marginBlock="4">
                        <Heading size={'small'}>{t('situasjonenDin.omsorgForBarn.tittel')}</Heading>
                    </Box>
                    <Box marginBlock="4">
                        <RHFSpoersmaalRadio name={'omsorgMinstFemti'} legend={t('situasjonenDin.omsorgMinstFemti')} />
                    </Box>
                    {harOmsorg === IValg.JA && (
                        <Box marginBlock="4">
                            <Alert variant={'info'}>
                                <BodyShort>{t('situasjonenDin.omsorgMinstFemti.dokumentasjon')}</BodyShort>
                            </Alert>
                        </Box>
                    )}

                    <Box marginBlock="4">
                        <RHFSpoersmaalRadio
                            name={'gravidEllerNyligFoedt'}
                            legend={t('situasjonenDin.gravidEllerNyligFoedt')}
                        />
                    </Box>
                </Box>

                <Box marginBlock="0 12">
                    <Box marginBlock="4">
                        <Heading size={'small'}>{t('situasjonenDin.oppholdUtenforNorge.tittel')}</Heading>
                    </Box>
                    <Box marginBlock="4">
                        <RHFSpoersmaalRadio name={'bosattINorge'} legend={t('situasjonenDin.bosattINorge')} />
                    </Box>

                    {bosattINorge === IValg.JA && (
                        <Box marginBlock="0 12">
                            <Box marginBlock="4">
                                <RHFSpoersmaalRadio
                                    name={'oppholderSegIUtlandet.svar'}
                                    legend={t('situasjonenDin.oppholderSegIUtlandet.svar')}
                                    description={t('situasjonenDin.oppholdHvorfor')}
                                />
                            </Box>
                            {oppholderSegIUtlandet === IValg.JA && (
                                <>
                                    <Box maxWidth="14rem" marginBlock="4">
                                        <RHFCombobox
                                            name={`oppholderSegIUtlandet.oppholdsland`}
                                            label={t('situasjonenDin.oppholderSegIUtlandet.oppholdsland')}
                                            options={countries}
                                        />
                                    </Box>

                                    <HGrid gap={'2'} columns={{ xs: 1, sm: 2 }} align={'start'}>
                                        <Datovelger
                                            name={'oppholderSegIUtlandet.oppholdFra'}
                                            label={t('situasjonenDin.oppholderSegIUtlandet.oppholdFra')}
                                            valgfri={true}
                                            maxDate={new Date()}
                                        />

                                        <Datovelger
                                            name={'oppholderSegIUtlandet.oppholdTil'}
                                            label={t('situasjonenDin.oppholderSegIUtlandet.oppholdTil')}
                                            valgfri={true}
                                            minDate={oppholdFra}
                                            maxDate={new Date()}
                                        />
                                    </HGrid>
                                </>
                            )}
                        </Box>
                    )}

                    {bosattINorge === IValg.NEI && (
                        <Box maxWidth="14rem" marginBlock="0 12">
                            <RHFCombobox
                                name={`bosattLand`}
                                label={t('situasjonenDin.bosattLand')}
                                options={countries}
                            />
                        </Box>
                    )}
                </Box>

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

export default SituasjonenDin
