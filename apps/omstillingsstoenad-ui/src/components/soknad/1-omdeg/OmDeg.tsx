import SoknadSteg from '../../../typer/SoknadSteg'
import { useTranslation } from 'react-i18next'
import InnloggetBruker from './InnloggetBruker'
import { SkjemaGruppe } from '../../felles/SkjemaGruppe'
import { FormProvider, useForm } from 'react-hook-form'
import { useSoknadContext } from '../../../context/soknad/SoknadContext'
import { ISoeker } from '~typer/person'
import { ActionTypes } from '../../../context/soknad/soknad'
import { RHFInput, RHFKontonummerInput, RHFTelefonInput } from '../../felles/rhf/RHFInput'
import { RHFRadio } from '../../felles/rhf/RHFRadio'
import Feilmeldinger from '../../felles/Feilmeldinger'
import { useBrukerContext } from '../../../context/bruker/BrukerContext'
import Navigasjon from '../../felles/Navigasjon'
import { Heading, RadioProps } from '@navikt/ds-react'
import { BankkontoType } from '../../../typer/utbetaling'
import UtenlandskBankInfo from './utenlandskBankInfo/UtenlandskBankInfo'
import { deepCopy } from '../../../utils/deepCopy'
import { SkjemaElement } from '../../felles/SkjemaElement'
import Bredde from '../../../typer/bredde'
import { FieldErrors } from 'react-hook-form/dist/types/errors'
import { LogEvents, useAmplitude } from '~hooks/useAmplitude'

const OmDeg = ({ neste }: SoknadSteg) => {
    const { t } = useTranslation()
    const { state, dispatch } = useSoknadContext()
    const brukerState = useBrukerContext().state
    const { logEvent } = useAmplitude()

    const lagre = (data: ISoeker) => {
        dispatch({ type: ActionTypes.OPPDATER_OM_DEG, payload: { ...deepCopy(data), erValidert: true } })
        neste!()
    }

    const logErrors = (data: FieldErrors<ISoeker>) => {
        Object.keys(data).map((error) => logEvent(LogEvents.VALIDATION_ERROR, { skjemanavn: 'OmDeg', id: error }))
    }

    const methods = useForm<ISoeker>({
        defaultValues: state.omDeg || {},
        shouldUnregister: true,
    })

    const {
        handleSubmit,
        watch,
        formState: { errors },
    } = methods

    const bankkontoType = watch('utbetalingsInformasjon.bankkontoType')

    return (
        <>
            <SkjemaElement>
                <Heading size={'medium'} className={'center'}>
                    {t('omDeg.tittel')}
                </Heading>
            </SkjemaElement>
            <InnloggetBruker />

            <FormProvider {...methods}>
                <form onSubmit={(e) => e.preventDefault()}>
                    <SkjemaElement>
                        {!brukerState.adressebeskyttelse && !brukerState.adresse && (
                            <SkjemaGruppe>
                                <RHFInput name={'alternativAdresse'} label={t('omDeg.alternativAdresse')} />
                            </SkjemaGruppe>
                        )}

                        {!brukerState.telefonnummer && (
                            <SkjemaElement>
                                <RHFTelefonInput
                                    htmlSize={Bredde.S}
                                    name={'kontaktinfo.telefonnummer'}
                                    label={t('omDeg.kontaktinfo.telefonnummer')}
                                    valgfri={true}
                                    autoComplete="tel"
                                />
                            </SkjemaElement>
                        )}
                    </SkjemaElement>

                    {/* 2.7 */}
                    {!brukerState.adressebeskyttelse && (
                        <SkjemaGruppe>
                            <SkjemaElement>
                                <RHFRadio
                                    name={'utbetalingsInformasjon.bankkontoType'}
                                    legend={t('omDeg.utbetalingsInformasjon.bankkontoType')}
                                >
                                    {Object.values(BankkontoType).map((value) => {
                                        return { children: t(value), value } as RadioProps
                                    })}
                                </RHFRadio>
                            </SkjemaElement>

                            {bankkontoType === BankkontoType.norsk && (
                                <RHFKontonummerInput
                                    htmlSize={Bredde.S}
                                    name={'utbetalingsInformasjon.kontonummer'}
                                    label={t('omDeg.utbetalingsInformasjon.kontonummer')}
                                    description={t('omDeg.utbetalingsInformasjon.informasjon')}
                                    autoComplete="off"
                                />
                            )}

                            {bankkontoType === BankkontoType.utenlandsk && <UtenlandskBankInfo />}
                        </SkjemaGruppe>
                    )}

                    <br />

                    <Feilmeldinger errors={errors} />

                    <Navigasjon neste={{ onClick: handleSubmit(lagre, logErrors) }} />
                </form>
            </FormProvider>
        </>
    )
}

export default OmDeg
