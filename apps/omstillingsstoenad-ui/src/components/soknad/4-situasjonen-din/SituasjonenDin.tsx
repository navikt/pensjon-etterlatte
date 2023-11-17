import React from 'react'
import SoknadSteg from '../../../typer/SoknadSteg'
import { useSoknadContext } from '../../../context/soknad/SoknadContext'
import { ISituasjonenDin } from '../../../typer/person'
import { ActionTypes } from '../../../context/soknad/soknad'
import { useTranslation } from 'react-i18next'
import Navigasjon from '../../felles/Navigasjon'
import { BodyShort, GuidePanel, Heading, HGrid } from '@navikt/ds-react'
import { FormProvider, useForm } from 'react-hook-form'
import { deepCopy } from '../../../utils/deepCopy'
import { SkjemaElement } from '../../felles/SkjemaElement'
import { RHFSpoersmaalRadio } from '../../felles/rhf/RHFRadio'
import { IValg } from '../../../typer/Spoersmaal'
import { SkjemaGruppe } from '../../felles/SkjemaGruppe'
import NySivilstatus from '../2-omdegogavdoed/nySivilstatus/NySivilstatus'
import { RHFSelect } from '../../felles/rhf/RHFSelect'
import { useLand } from '../../../hooks/useLand'
import Datovelger from '../../felles/Datovelger'

const SituasjonenDin: SoknadSteg = ({ neste, forrige }) => {
    const { t } = useTranslation()
    const { state, dispatch } = useSoknadContext()
    const { land }: { land: any } = useLand()

    const methods = useForm<ISituasjonenDin>({
        defaultValues: state.situasjonenDin || {},
    })

    const { getValues, handleSubmit, watch } = methods

    const erValidert = state.situasjonenDin.erValidert

    const lagreNeste = (data: ISituasjonenDin) => {
        dispatch({ type: ActionTypes.OPPDATER_SITUASJONEN_DIN, payload: { ...deepCopy(data), erValidert: true } })
        neste!!()
    }

    const lagreTilbake = (data: ISituasjonenDin) => {
        dispatch({ type: ActionTypes.OPPDATER_SITUASJONEN_DIN, payload: { ...deepCopy(data), erValidert: true } })
        forrige!!()
    }

    const lagreTilbakeUtenValidering = () => {
        const verdier = getValues()
        dispatch({ type: ActionTypes.OPPDATER_SITUASJONEN_DIN, payload: { ...deepCopy(verdier), erValidert: false } })
        forrige!!()
    }

    const harOmsorg = watch('omsorgMinstFemti')
    const bosattINorge = watch('bosattINorge')
    const oppholderSegINorge = watch('oppholderSegINorge.svar')
    const oppholdFra = watch('oppholderSegINorge.oppholdFra')

    return (
        <FormProvider {...methods}>
            <form>
                <SkjemaElement>
                    <Heading size={'medium'} className={'center'}>
                        {t('situasjonenDin.tittel')}
                    </Heading>
                </SkjemaElement>

                <SkjemaGruppe>
                    <GuidePanel>
                        <BodyShort>{t('situasjonenDin.ingress')}</BodyShort>
                    </GuidePanel>
                </SkjemaGruppe>

                <NySivilstatus />

                <SkjemaElement>
                    <RHFSpoersmaalRadio name={'omsorgMinstFemti'} legend={t('situasjonenDin.omsorgMinstFemti')} />
                </SkjemaElement>

                {harOmsorg === IValg.JA && (
                    <>
                        <SkjemaGruppe>
                            <BodyShort>Her kommer det noe mer info hvis man har omsorg</BodyShort>
                        </SkjemaGruppe>
                    </>
                )}

                <SkjemaGruppe>
                    <RHFSpoersmaalRadio
                        name={'gravidEllerNyligFoedt'}
                        legend={t('situasjonenDin.gravidEllerNyligFoedt')}
                    />
                </SkjemaGruppe>

                <SkjemaElement>
                    <RHFSpoersmaalRadio name={'bosattINorge'} legend={t('situasjonenDin.bosattINorge')} />
                </SkjemaElement>

                {bosattINorge === IValg.JA && (
                    <SkjemaGruppe>
                        <SkjemaElement>
                            <RHFSpoersmaalRadio
                                name={'oppholderSegINorge.svar'}
                                legend={t('situasjonenDin.oppholderSegINorge.svar')}
                                description={t('situasjonenDin.oppholdHvorfor')}
                            />
                        </SkjemaElement>
                        {oppholderSegINorge === IValg.JA && (
                            <>
                                <SkjemaGruppe>
                                    <RHFSelect
                                        className="kol-50"
                                        name={`oppholderSegINorge.oppholdsland`}
                                        label={t('situasjonenDin.oppholderSegINorge.oppholdsland')}
                                        selectOptions={land}
                                    />
                                </SkjemaGruppe>

                                <HGrid gap={'2'} columns={{ xs: 1, sm: 2 }} align={'start'}>
                                    <Datovelger
                                        name={'oppholderSegINorge.oppholdFra'}
                                        label={t('situasjonenDin.oppholderSegINorge.oppholdFra')}
                                        valgfri={true}
                                        maxDate={new Date()}
                                    />

                                    <Datovelger
                                        name={'oppholderSegINorge.oppholdTil'}
                                        label={t('situasjonenDin.oppholderSegINorge.oppholdTil')}
                                        valgfri={true}
                                        minDate={oppholdFra}
                                        maxDate={new Date()}
                                    />
                                </HGrid>
                            </>
                        )}
                    </SkjemaGruppe>
                )}

                {bosattINorge === IValg.NEI && (
                    <SkjemaGruppe>
                        <RHFSelect
                            className="kol-50"
                            name={`bosattLand`}
                            label={t('situasjonenDin.bosattLand')}
                            selectOptions={land}
                        />
                    </SkjemaGruppe>
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

export default SituasjonenDin
