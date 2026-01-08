import { Alert, BodyLong, Box, Heading, HGrid, ReadMore, VStack } from '@navikt/ds-react'
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
            <Box marginBlock="4">
                <Heading className={'center'} size={'medium'}>
                    {t('omDenAvdoede.tittel')}
                </Heading>
            </Box>

            <form onSubmit={(e) => e.preventDefault()} autoComplete={isDev ? 'on' : 'off'}>
                <Box marginBlock="0 12">
                    <HGrid gap={'4'} columns={{ xs: 1, sm: 2 }} align={'start'}>
                        <RHFInput name={'fornavn'} label={t('omDenAvdoede.fornavn')} />
                        <RHFInput name={'etternavn'} label={t('omDenAvdoede.etternavn')} />
                    </HGrid>
                    <Box marginBlock="4">
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
                    </Box>

                    <Box maxWidth="14rem" marginBlock="4">
                        <RHFCombobox
                            name={`statsborgerskap`}
                            label={t('omDenAvdoede.statsborgerskap')}
                            options={countries}
                        />
                    </Box>

                    <Box marginBlock="4">
                        <Datovelger
                            name={'datoForDoedsfallet'}
                            label={t('omDenAvdoede.datoForDoedsfallet')}
                            minDate={minsteDatoForDoedsfall}
                            maxDate={new Date()}
                        />
                    </Box>
                </Box>

                <Box marginBlock="0 12">
                    <Heading size="small">{t('omDenAvdoede.doedsfallAarsak.tittel')}</Heading>
                    <Box marginBlock="4">
                        <RHFSpoersmaalRadio
                            name={'doedsfallAarsak'}
                            legend={t('omDenAvdoede.doedsfallAarsak')}
                            vetIkke
                        />
                        <ReadMore header={t('readmore.tittel.hvorfor.spoer.vi')}>
                            {t('omDenAvdoede.doedsfallAarsakHvorfor')}
                        </ReadMore>
                    </Box>
                </Box>

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
