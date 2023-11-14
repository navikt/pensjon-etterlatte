import { SkjemaGruppe } from '../../felles/SkjemaGruppe'
import SoknadSteg from '../../../typer/SoknadSteg'
import { useSoknadContext } from '../../../context/soknad/SoknadContext'
import { IAvdoed } from '../../../typer/person'
import { ActionTypes } from '../../../context/soknad/soknad'
import { useTranslation } from 'react-i18next'
import { FormProvider, useForm } from 'react-hook-form'
import { RHFFoedselsnummerInput, RHFInput, RHFValutaInput } from '../../felles/rhf/RHFInput'
import { RHFSpoersmaalRadio } from '../../felles/rhf/RHFRadio'
import { IValg } from '../../../typer/Spoersmaal'
import Feilmeldinger from '../../felles/Feilmeldinger'
import BoddEllerArbeidetUtland from './fragmenter/BoddEllerArbeidetUtland'
import Navigasjon from '../../felles/Navigasjon'
import { BodyLong, Heading, HGrid } from '@navikt/ds-react'
import { deepCopy } from '../../../utils/deepCopy'
import { RHFSelect } from '../../felles/rhf/RHFSelect'
import { useLand } from '../../../hooks/useLand'
import { SkjemaElement } from '../../felles/SkjemaElement'
import Bredde from '../../../typer/bredde'
import Datovelger from '../../felles/Datovelger'

const OmDenAvdode: SoknadSteg = ({ neste, forrige }) => {
    const { t } = useTranslation()
    const { state, dispatch } = useSoknadContext()
    const { land }: { land: any } = useLand()
    const methods = useForm<IAvdoed>({
        defaultValues: { ...state.omDenAvdoede, statsborgerskap: state.omDenAvdoede.statsborgerskap },
        shouldUnregister: true,
    })

    const {
        handleSubmit,
        watch,
        getValues,
        formState: { errors },
    } = methods

    const lagreNeste = (data: IAvdoed) => {
        dispatch({ type: ActionTypes.OPPDATER_AVDOED, payload: { ...deepCopy(data), erValidert: true } })
        neste!!()
    }

    const lagreTilbake = (data: IAvdoed) => {
        dispatch({ type: ActionTypes.OPPDATER_AVDOED, payload: { ...deepCopy(data), erValidert: true } })
        forrige!!()
    }

    const lagreTilbakeUtenValidering = () => {
        const verdier = getValues()
        dispatch({ type: ActionTypes.OPPDATER_AVDOED, payload: { ...deepCopy(verdier), erValidert: false } })
        forrige!!()
    }

    const erValidert = state.omDenAvdoede.erValidert
    const selvstendigNaeringsdrivende = watch('selvstendigNaeringsdrivende.svar')
    const datoForDoedsfallet = watch('datoForDoedsfallet')

    return (
        <FormProvider {...methods}>
            <SkjemaElement>
                <Heading className={'center'} size={'medium'}>
                    {t('omDenAvdoede.tittel')}
                </Heading>
            </SkjemaElement>

            <form>
                <SkjemaGruppe>
                    <HGrid gap={'4'} columns={{ xs: 1, sm: 2 }} align={'start'}>
                        <RHFInput name={'fornavn'} label={t('omDenAvdoede.fornavn')} />
                        <RHFInput name={'etternavn'} label={t('omDenAvdoede.etternavn')} />

                        <RHFFoedselsnummerInput
                            name={'foedselsnummer'}
                            label={t('omDenAvdoede.foedselsnummer')}
                            description={t('felles.fnrPlaceholder')}
                        />
                        <RHFSelect
                            name={`statsborgerskap`}
                            label={t('omDenAvdoede.statsborgerskap')}
                            selectOptions={land}
                        />
                    </HGrid>

                    <SkjemaElement>
                        <Datovelger
                            name={'datoForDoedsfallet'}
                            label={t('omDenAvdoede.datoForDoedsfallet')}
                            maxDate={new Date()}
                        />
                    </SkjemaElement>

                    <SkjemaElement>
                        <RHFSpoersmaalRadio
                            name={'doedsfallAarsak'}
                            legend={t('omDenAvdoede.doedsfallAarsak')}
                            description={t('omDenAvdoede.doedsfallAarsakHvorfor')}
                            vetIkke
                        />
                    </SkjemaElement>
                </SkjemaGruppe>

                <BoddEllerArbeidetUtland datoForDoedsfallet={datoForDoedsfallet} />

                <SkjemaGruppe>
                    <Heading size="small">{t('omDenAvdoede.selvstendigNaeringsdrivende.tittel')}</Heading>
                    <BodyLong>{t('omDenAvdoede.selvstendigNaeringsdrivende.ingress')}</BodyLong>

                    <SkjemaElement>
                        <RHFSpoersmaalRadio
                            name={'selvstendigNaeringsdrivende.svar'}
                            legend={t('omDenAvdoede.selvstendigNaeringsdrivende.svar')}
                            vetIkke
                        />
                    </SkjemaElement>

                    {selvstendigNaeringsdrivende === IValg.JA && (
                        <>
                            <SkjemaElement>
                                <RHFValutaInput
                                    name={'selvstendigNaeringsdrivende.beskrivelse'}
                                    htmlSize={Bredde.S}
                                    valgfri={true}
                                    type="tel"
                                    description={t('omDenAvdoede.selvstendigNaeringsdrivende.placeholder')}
                                    label={t('omDenAvdoede.selvstendigNaeringsdrivende.beskrivelse')}
                                />
                            </SkjemaElement>

                            <RHFSpoersmaalRadio
                                name={'haddePensjonsgivendeInntekt.svar'}
                                legend={t('omDenAvdoede.haddePensjonsgivendeInntekt.svar')}
                                vetIkke
                            />
                        </>
                    )}
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

export default OmDenAvdode
