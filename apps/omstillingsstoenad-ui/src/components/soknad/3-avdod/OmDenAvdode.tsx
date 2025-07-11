import { Alert, BodyLong, Box, Heading, HGrid, VStack } from '@navikt/ds-react'
import { FormProvider, useForm } from 'react-hook-form'
import { FieldErrors } from 'react-hook-form/dist/types/errors'
import { useTranslation } from 'react-i18next'
import { RHFCheckboks } from '~components/felles/rhf/RHFCheckboksPanelGruppe'
import { RHFCombobox } from '~components/felles/rhf/RHFCombobox'
import { LogEvents, useAnalytics } from '~hooks/useAnalytics'
import { IAvdoed } from '~typer/person'
import { isDev } from '../../../api/axios'
import { useSoknadContext } from '../../../context/soknad/SoknadContext'
import { ActionTypes } from '../../../context/soknad/soknad'
import useCountries, { Options } from '../../../hooks/useCountries'
import Bredde from '../../../typer/bredde'
import SoknadSteg from '../../../typer/SoknadSteg'
import { deepCopy } from '../../../utils/deepCopy'
import Datovelger from '../../felles/Datovelger'
import Feilmeldinger from '../../felles/Feilmeldinger'
import Navigasjon from '../../felles/Navigasjon'
import { RHFFoedselsnummerInput, RHFInput } from '../../felles/rhf/RHFInput'
import { RHFSpoersmaalRadio } from '../../felles/rhf/RHFRadio'
import { SkjemaElement } from '../../felles/SkjemaElement'
import { SkjemaGruppe } from '../../felles/SkjemaGruppe'
import BoddEllerArbeidetUtland from './fragmenter/BoddEllerArbeidetUtland'

const OmDenAvdode = ({ neste, forrige }: SoknadSteg) => {
    const { t } = useTranslation()
    const { state, dispatch } = useSoknadContext()
    const { countries }: { countries: Options[] } = useCountries()
    const methods = useForm<IAvdoed>({
        defaultValues: { ...state.omDenAvdoede, statsborgerskap: state.omDenAvdoede.statsborgerskap },
        shouldUnregister: true,
    })
    const { logEvent } = useAnalytics()

    const {
        handleSubmit,
        watch,
        getValues,
        formState: { errors },
    } = methods

    const lagreNeste = (data: IAvdoed) => {
        dispatch({ type: ActionTypes.OPPDATER_AVDOED, payload: { ...deepCopy(data), erValidert: true } })

        // Logger svar om avdød har bodd i utlandet for å sjekke opp mot hypotese
        logEvent(LogEvents.SPOERSMAAL_BESVART, {
            skjemanavn: 'OmDenAvdode',
            spørsmål: 'omDenAvdoede.boddEllerJobbetUtland.svar',
            svar: data.boddEllerJobbetUtland?.svar,
        })

        neste!()
    }

    const lagreTilbake = (data: IAvdoed) => {
        dispatch({ type: ActionTypes.OPPDATER_AVDOED, payload: { ...deepCopy(data), erValidert: true } })
        forrige!()
    }

    const lagreTilbakeUtenValidering = () => {
        const verdier = getValues()
        dispatch({ type: ActionTypes.OPPDATER_AVDOED, payload: { ...deepCopy(verdier), erValidert: false } })
        forrige!()
    }

    const logErrors = (data: FieldErrors<IAvdoed>) => {
        Object.keys(data).map((error) => logEvent(LogEvents.VALIDATION_ERROR, { skjemanavn: 'OmDenAvdode', id: error }))
    }

    const erValidert = state.omDenAvdoede.erValidert
    const datoForDoedsfallet = watch('datoForDoedsfallet')
    const ukjentFoedselsnummer = watch('ukjentFoedselsnummer')

    const minsteDatoForDoedsfall = new Date(2015, 0, 1)

    return (
        <FormProvider {...methods}>
            <SkjemaElement>
                <Heading className={'center'} size={'medium'}>
                    {t('omDenAvdoede.tittel')}
                </Heading>
            </SkjemaElement>

            <form onSubmit={(e) => e.preventDefault()} autoComplete={isDev ? 'on' : 'off'}>
                <SkjemaGruppe>
                    <HGrid gap={'4'} columns={{ xs: 1, sm: 2 }} align={'start'}>
                        <RHFInput name={'fornavn'} label={t('omDenAvdoede.fornavn')} />
                        <RHFInput name={'etternavn'} label={t('omDenAvdoede.etternavn')} />
                    </HGrid>
                    <SkjemaElement>
                        {!ukjentFoedselsnummer && (
                            <RHFFoedselsnummerInput
                                name={'foedselsnummer'}
                                label={t('omDenAvdoede.foedselsnummer')}
                                htmlSize={Bredde.S}
                            />
                        )}

                        <RHFCheckboks
                            name={'ukjentFoedselsnummer'}
                            label={t('omDenAvdoede.ukjentFoedselsnummer')}
                            legend={t('omDenAvdoede.ukjentFoedselsnummer')}
                        />

                        {ukjentFoedselsnummer && (
                            <VStack gap="4">
                                <Alert variant={'info'}>{t('omDenAvdoede.ukjentFoedselsnummerInfo')}</Alert>
                                <Datovelger
                                    name={'foedselsdato'}
                                    label={t('omDenAvdoede.foedselsdato')}
                                    maxDate={new Date()}
                                />
                            </VStack>
                        )}
                    </SkjemaElement>

                    <Box maxWidth="14rem">
                        <SkjemaElement>
                            <RHFCombobox
                                name={`statsborgerskap`}
                                label={t('omDenAvdoede.statsborgerskap')}
                                options={countries}
                            />
                        </SkjemaElement>
                    </Box>

                    <SkjemaElement>
                        <Datovelger
                            name={'datoForDoedsfallet'}
                            label={t('omDenAvdoede.datoForDoedsfallet')}
                            minDate={minsteDatoForDoedsfall}
                            maxDate={new Date()}
                        />
                    </SkjemaElement>
                </SkjemaGruppe>

                <SkjemaGruppe>
                    <Heading size="small">{t('omDenAvdoede.doedsfallAarsak.tittel')}</Heading>
                    <BodyLong>{t('omDenAvdoede.doedsfallAarsakHvorfor')}</BodyLong>
                    <SkjemaElement>
                        <RHFSpoersmaalRadio
                            name={'doedsfallAarsak'}
                            legend={t('omDenAvdoede.doedsfallAarsak')}
                            vetIkke
                        />
                    </SkjemaElement>
                </SkjemaGruppe>

                <BoddEllerArbeidetUtland datoForDoedsfallet={datoForDoedsfallet} />

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

export default OmDenAvdode
