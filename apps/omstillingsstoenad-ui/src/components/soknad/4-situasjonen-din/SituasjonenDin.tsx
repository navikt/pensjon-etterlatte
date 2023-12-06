import React from 'react'
import SoknadSteg from '../../../typer/SoknadSteg'
import { useSoknadContext } from '../../../context/soknad/SoknadContext'
import { ISituasjonenDin } from '../../../typer/person'
import { ActionTypes } from '../../../context/soknad/soknad'
import { useTranslation } from 'react-i18next'
import Navigasjon from '../../felles/Navigasjon'
import { Alert, BodyShort, GuidePanel, Heading, HGrid, List } from '@navikt/ds-react'
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
import Feilmeldinger from '../../felles/Feilmeldinger'

const SituasjonenDin: SoknadSteg = ({ neste, forrige }) => {
    const { t } = useTranslation()
    const { state, dispatch } = useSoknadContext()
    const { land }: { land: any } = useLand()

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
    const oppholderSegIUtlandet = watch('oppholderSegIUtlandet.svar')
    const oppholdFra = watch('oppholderSegIUtlandet.oppholdFra')

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
                        <List as={'ul'} size={'small'}>
                            <List.Item>{t('situasjonenDin.ingress.li1')}</List.Item>
                            <List.Item>{t('situasjonenDin.ingress.li2')}</List.Item>
                            <List.Item>{t('situasjonenDin.ingress.li3')}</List.Item>
                        </List>
                    </GuidePanel>
                </SkjemaGruppe>

                <NySivilstatus />

                <SkjemaGruppe>
                    <SkjemaElement>
                        <Heading size={'xsmall'}>{t('situasjonenDin.omsorgForBarn.tittel')}</Heading>
                    </SkjemaElement>
                    <SkjemaElement>
                        <RHFSpoersmaalRadio name={'omsorgMinstFemti'} legend={t('situasjonenDin.omsorgMinstFemti')} />
                    </SkjemaElement>
                    {harOmsorg === IValg.JA && (
                        <SkjemaElement>
                            <Alert variant={'info'}>
                                <BodyShort>{t('situasjonenDin.omsorgMinstFemti.dokumentasjon')}</BodyShort>
                            </Alert>
                        </SkjemaElement>
                    )}

                    <SkjemaElement>
                        <RHFSpoersmaalRadio
                            name={'gravidEllerNyligFoedt'}
                            legend={t('situasjonenDin.gravidEllerNyligFoedt')}
                        />
                    </SkjemaElement>
                </SkjemaGruppe>

                <SkjemaGruppe>
                    <SkjemaElement>
                        <Heading size={'xsmall'}>{t('situasjonenDin.oppholdUtenforNorge.tittel')}</Heading>
                    </SkjemaElement>
                    <SkjemaElement>
                        <RHFSpoersmaalRadio name={'bosattINorge'} legend={t('situasjonenDin.bosattINorge')} />
                    </SkjemaElement>

                    {bosattINorge === IValg.JA && (
                        <SkjemaGruppe>
                            <SkjemaElement>
                                <RHFSpoersmaalRadio
                                    name={'oppholderSegIUtlandet.svar'}
                                    legend={t('situasjonenDin.oppholderSegIUtlandet.svar')}
                                    description={t('situasjonenDin.oppholdHvorfor')}
                                />
                            </SkjemaElement>
                            {oppholderSegIUtlandet === IValg.JA && (
                                <>
                                    <SkjemaGruppe>
                                        <RHFSelect
                                            className="kol-50"
                                            name={`oppholderSegIUtlandet.oppholdsland`}
                                            label={t('situasjonenDin.oppholderSegIUtlandet.oppholdsland')}
                                            selectOptions={land}
                                        />
                                    </SkjemaGruppe>

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
                </SkjemaGruppe>

                <Feilmeldinger errors={errors} />

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
