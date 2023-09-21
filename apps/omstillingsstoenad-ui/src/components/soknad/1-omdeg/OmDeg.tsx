import SoknadSteg from '../../../typer/SoknadSteg'
import { useTranslation } from 'react-i18next'
import InnloggetBruker from './InnloggetBruker'
import { SkjemaGruppe } from '../../felles/SkjemaGruppe'
import { FormProvider, useForm } from 'react-hook-form'
import { IValg } from '../../../typer/Spoersmaal'
import { useSoknadContext } from '../../../context/soknad/SoknadContext'
import { ISoeker } from '../../../typer/person'
import { ActionTypes } from '../../../context/soknad/soknad'
import { RHFInput, RHFKontonummerInput, RHFTelefonInput } from '../../felles/rhf/RHFInput'
import { RHFSpoersmaalRadio, RHFRadio } from '../../felles/rhf/RHFRadio'
import Feilmeldinger from '../../felles/Feilmeldinger'
import { useBrukerContext } from '../../../context/bruker/BrukerContext'
import Navigasjon from '../../felles/Navigasjon'
import { Cell, Grid, Heading, RadioProps } from '@navikt/ds-react'
import { BankkontoType } from '../../../typer/utbetaling'
import UtenlandskBankInfo from './utenlandskBankInfo/UtenlandskBankInfo'
import HvorforSpoerVi from '../../felles/HvorforSpoerVi'
import { deepCopy } from '../../../utils/deepCopy'
import { RHFSelect } from '../../felles/rhf/RHFSelect'
import { useLand } from '../../../hooks/useLand'
import { SkjemaElement } from '../../felles/SkjemaElement'
import Bredde from '../../../typer/bredde'

const OmDeg: SoknadSteg = ({ neste }) => {
    const { t } = useTranslation()
    const { state, dispatch } = useSoknadContext()
    const brukerState = useBrukerContext().state
    const { land }: { land: any } = useLand()
    const lagre = (data: ISoeker) => {
        dispatch({ type: ActionTypes.OPPDATER_OM_DEG, payload: { ...deepCopy(data), erValidert: true } })
        neste!!()
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

    const skalSjekkeFlyktningStatus = brukerState.foedselsaar!! < 1960

    const oppholderSegINorge = watch('oppholderSegINorge')
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
                {/* TODO: Flytte dette til start eller eget steg? */}

                <form>
                    <SkjemaGruppe>
                        {!brukerState.adressebeskyttelse && !brukerState.adresse && (
                            <SkjemaGruppe>
                                <RHFInput name={'alternativAdresse'} label={t('omDeg.alternativAdresse')} />
                            </SkjemaGruppe>
                        )}

                        {!brukerState.telefonnummer && (
                            <SkjemaGruppe>
                                <Grid>
                                    <Cell xs={12} md={6} className={'kol'}>
                                        <RHFTelefonInput
                                            htmlSize={Bredde.S}
                                            name={'kontaktinfo.telefonnummer'}
                                            label={t('omDeg.kontaktinfo.telefonnummer')}
                                            valgfri={true}
                                        />
                                    </Cell>
                                </Grid>
                            </SkjemaGruppe>
                        )}
                    </SkjemaGruppe>

                    {/* 2.7 */}
                    {!brukerState.adressebeskyttelse && (
                        <SkjemaGruppe>
                            <SkjemaElement>
                                <RHFSpoersmaalRadio
                                    name={'oppholderSegINorge'}
                                    legend={t('omDeg.oppholderSegINorge')}
                                    description={
                                        <HvorforSpoerVi title="omDeg.oppholderSegINorge">
                                            {t('omDeg.oppholdHvorfor')}
                                        </HvorforSpoerVi>
                                    }
                                />
                            </SkjemaElement>

                            {oppholderSegINorge === IValg.JA && (
                                <SkjemaGruppe>
                                    <RHFKontonummerInput
                                        htmlSize={Bredde.S}
                                        name={'utbetalingsInformasjon.kontonummer'}
                                        label={t('omDeg.utbetalingsInformasjon.kontonummer')}
                                        placeholder={t('felles.elleveSiffer')}
                                        description={t('omDeg.utbetalingsInformasjon.informasjon')}
                                    />
                                </SkjemaGruppe>
                            )}

                            {oppholderSegINorge === IValg.NEI && (
                                <>
                                    <SkjemaGruppe>
                                        <RHFSelect
                                            className="kol-50"
                                            name={`oppholdsland`}
                                            label={t('omDeg.oppholdsland')}
                                            selectOptions={land}
                                        />
                                    </SkjemaGruppe>

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
                                            placeholder={t('felles.elleveSiffer')}
                                        />
                                    )}

                                    {bankkontoType === BankkontoType.utenlandsk && <UtenlandskBankInfo />}
                                </>
                            )}
                        </SkjemaGruppe>
                    )}

                    {skalSjekkeFlyktningStatus && (
                        <SkjemaGruppe>
                            <RHFSpoersmaalRadio
                                name={'flyktning'}
                                legend={t('omDeg.flyktning')}
                                description={
                                    <HvorforSpoerVi title="omDeg.flyktning">
                                        {t('omDeg.flyktningHvorfor')}
                                    </HvorforSpoerVi>
                                }
                            />
                        </SkjemaGruppe>
                    )}

                    <br />

                    <Feilmeldinger errors={errors} />

                    <Navigasjon neste={{ onClick: handleSubmit(lagre) }} />
                </form>
            </FormProvider>
        </>
    )
}

export default OmDeg
