import { memo, useEffect, useState } from 'react'
import { Arbeidsmengde, StillingType } from '../../../../typer/arbeidsforhold'
import { useTranslation } from 'react-i18next'
import { BodyShort, Box, Button, Heading, RadioProps, ReadMore } from '@navikt/ds-react'
import { RHFInput, RHFInputArea, RHFNumberInput, RHFProsentInput } from '../../../felles/rhf/RHFInput'
import { RHFRadio, RHFSpoersmaalRadio } from '../../../felles/rhf/RHFRadio'
import { IValg } from '../../../../typer/Spoersmaal'
import { DeleteFilled } from '@navikt/ds-icons'
import { useFormContext } from 'react-hook-form'
import { SkjemaElement } from '../../../felles/SkjemaElement'
import Datovelger from '../../../felles/Datovelger'
import Bredde from '../../../../typer/bredde'
import { SkjemaGruppe } from '../../../felles/SkjemaGruppe'
import { RHFSelect } from '../../../felles/rhf/RHFSelect'
import { NumberSelectRad } from '../../../felles/StyledComponents'

interface Props {
    lengde: number
    index: number
    fjern: (index: number) => void
}

const ArbeidstakerInfokort = memo(({ lengde, index, fjern }: Props) => {
    const { t } = useTranslation()

    const [visFastArbeidsmengde, setVisFastArbeidsmengde] = useState(false)
    const [visMidlertidigArbeidsmengde, setVisMidlertidigArbeidsmengde] = useState(false)
    const [visSluttdato, setVisSluttdato] = useState(false)
    const [visEndretArbeidssituasjon, setVisEndretArbeidssituasjon] = useState(false)

    const { watch, setValue } = useFormContext()

    const ansettelsesforhold = watch(`arbeidsforhold[${index}].ansettelsesforhold`)
    const arbeidsmengdeType = watch(`arbeidsforhold[${index}].arbeidsmengde.type`)
    const endretArbeidssituasjon = watch(`arbeidsforhold[${index}].forventerEndretArbeidssituasjon.svar`)
    const sluttdato = watch(`arbeidsforhold[${index}].midlertidig.svar`)

    const arbeidsmengdeValg = Object.values(Arbeidsmengde).map((value) => {
        return { label: t(value), value }
    })

    useEffect(() => {
        if (sluttdato === IValg.JA) setVisSluttdato(true)
        else if (sluttdato === IValg.NEI) {
            setVisSluttdato(false)
            setValue(`arbeidsforhold[${index}].midlertidig.sluttdatoVelger`, undefined)
        }
    }, [sluttdato])

    useEffect(() => {
        if (endretArbeidssituasjon === IValg.JA) setVisEndretArbeidssituasjon(true)
        else if (endretArbeidssituasjon === IValg.NEI) {
            setVisEndretArbeidssituasjon(false)
            setValue(`arbeidsforhold[${index}].forventerEndretArbeidssituasjon.beskrivelse`, '')
        }
    }, [endretArbeidssituasjon])

    useEffect(() => {
        if (ansettelsesforhold === StillingType.midlertidig || ansettelsesforhold === StillingType.tilkallingsvikar) {
            setVisFastArbeidsmengde(false)
            setVisMidlertidigArbeidsmengde(true)
            if (!arbeidsmengdeType) setValue(`arbeidsforhold[${index}].arbeidsmengde.svar`, '')
        } else if (ansettelsesforhold === StillingType.fast) {
            setVisFastArbeidsmengde(true)
            setVisMidlertidigArbeidsmengde(false)
            if (arbeidsmengdeType) {
                setValue(`arbeidsforhold[${index}].arbeidsmengde.svar`, '')
            }
            setValue(`arbeidsforhold[${index}].arbeidsmengde.type`, '')
            setValue(`arbeidsforhold[${index}].midlertidig.svar`, '')
        }
    }, [ansettelsesforhold])

    return (
        <Box padding="4" borderColor={'border-info'} borderWidth={'0 0 0 4'} background={'surface-selected'}>
            {lengde > 1 && (
                <Heading size={'small'}>{`${t('merOmSituasjonenDin.arbeidsforhold.arbeidssted')} ${
                    index + 1
                }`}</Heading>
            )}
            <SkjemaElement>
                <RHFInput
                    name={`arbeidsforhold[${index}].arbeidsgiver` as const}
                    label={t('merOmSituasjonenDin.arbeidsforhold.arbeidsgiver')}
                    htmlSize={Bredde.M}
                />
            </SkjemaElement>

            <SkjemaElement>
                <RHFRadio
                    name={`arbeidsforhold[${index}].ansettelsesforhold` as const}
                    legend={t('merOmSituasjonenDin.arbeidsforhold.ansettelsesforhold')}
                >
                    {Object.values(StillingType).map((value) => {
                        return { children: t(value), value } as RadioProps
                    })}
                </RHFRadio>
            </SkjemaElement>

            <SkjemaGruppe>
                <div style={{ display: visFastArbeidsmengde ? 'block' : 'none' }}>
                    <SkjemaElement>
                        <SkjemaElement>
                            <Heading size={'small'}>
                                {t('merOmSituasjonenDin.arbeidsforhold.ansettelsesforhold.fast.tittel')}
                            </Heading>
                            <BodyShort>
                                {t('merOmSituasjonenDin.arbeidsforhold.ansettelsesforhold.fast.beskrivelse')}
                            </BodyShort>
                        </SkjemaElement>
                        <RHFProsentInput
                            name={`arbeidsforhold[${index}].arbeidsmengde.svar` as const}
                            label={t('merOmSituasjonenDin.arbeidsforhold.arbeidsmengde.svar.fast')}
                            htmlSize={Bredde.XS}
                            valgfri={!visFastArbeidsmengde}
                            aria-hidden={!visFastArbeidsmengde}
                        />
                    </SkjemaElement>
                </div>

                <div style={{ display: visMidlertidigArbeidsmengde ? 'block' : 'none' }}>
                    <SkjemaElement>
                        <SkjemaElement>
                            <Heading size={'small'}>
                                {t('merOmSituasjonenDin.arbeidsforhold.ansettelsesforhold.fast.tittel')}
                            </Heading>
                            <BodyShort>
                                {t('merOmSituasjonenDin.arbeidsforhold.ansettelsesforhold.midlertidig.beskrivelse')}
                            </BodyShort>
                        </SkjemaElement>
                        <NumberSelectRad>
                            <RHFNumberInput
                                name={`arbeidsforhold[${index}].arbeidsmengde.svar` as const}
                                label={t('merOmSituasjonenDin.arbeidsforhold.arbeidsmengde.svar')}
                                htmlSize={Bredde.S}
                                valgfri={!visMidlertidigArbeidsmengde}
                                aria-hidden={!visMidlertidigArbeidsmengde}
                            />
                            <RHFSelect
                                name={`arbeidsforhold[${index}].arbeidsmengde.type` as const}
                                selectOptions={[
                                    {
                                        label: t('felles.velg'),
                                        value: '',
                                    },
                                ].concat(arbeidsmengdeValg)}
                                label={t('felles.velg.tittel')}
                                valgfri={!visMidlertidigArbeidsmengde}
                                aria-hidden={!visMidlertidigArbeidsmengde}
                            />
                        </NumberSelectRad>
                        <SkjemaElement>
                            <RHFSpoersmaalRadio
                                name={`arbeidsforhold[${index}].midlertidig.svar` as const}
                                legend={t('merOmSituasjonenDin.arbeidsforhold.midlertidig.svar')}
                                valgfri={!visMidlertidigArbeidsmengde}
                                aria-hidden={!visMidlertidigArbeidsmengde}
                            />
                        </SkjemaElement>
                        <div style={{ display: visSluttdato ? 'block' : 'none' }}>
                            <Datovelger
                                name={`arbeidsforhold[${index}].midlertidig.sluttdatoVelger`}
                                label={t('merOmSituasjonenDin.arbeidsforhold.midlertidig.sluttdatoVelger')}
                                minDate={new Date()}
                                valgfri={!visSluttdato}
                                aria-hidden={!visSluttdato}
                            />
                        </div>
                    </SkjemaElement>
                </div>
            </SkjemaGruppe>

            <SkjemaGruppe>
                <RHFSpoersmaalRadio
                    name={`arbeidsforhold[${index}].forventerEndretArbeidssituasjon.svar` as const}
                    legend={t('merOmSituasjonenDin.arbeidsforhold.forventerEndretArbeidssituasjon.svar')}
                />
                <div style={{ display: visEndretArbeidssituasjon ? 'block' : 'none' }}>
                    <SkjemaElement>
                        <RHFInputArea
                            name={`arbeidsforhold[${index}].forventerEndretArbeidssituasjon.beskrivelse`}
                            label={t('merOmSituasjonenDin.arbeidsforhold.forventerEndretArbeidssituasjon.beskrivelse')}
                            maxLength={200}
                            className={'width-50'}
                            valgfri={!visEndretArbeidssituasjon}
                        />
                    </SkjemaElement>
                </div>
                <ReadMore header={t('hvorforSpoerVi')}>
                    {t('merOmSituasjonenDin.arbeidsforhold.sagtOppEllerRedusert.hvorfor')}
                </ReadMore>
            </SkjemaGruppe>

            {/* VENTER PÅ AVKLARING OM DEN KAN BRUKES
            * <SkjemaElement>
                <RHFRadio
                    name={`arbeidsforhold[${index}].sagtOppEllerRedusert.svar` as const}
                    legend={t('merOmSituasjonenDin.arbeidsforhold.sagtOppEllerRedusert.svar')}
                >
                    {Object.values(SagtOppEllerRedusert).map((value) => {
                        return { children: t(value), value } as RadioProps
                    })}
                </RHFRadio>
            </SkjemaElement>
            * */}

            {lengde > 1 && (
                <div>
                    <Button
                        variant={'secondary'}
                        type={'button'}
                        onClick={() => fjern(index)}
                        icon={<DeleteFilled />}
                        data-testid={'fjern-arbeidsforhold-knapp'}
                    >
                        {t('knapp.fjern')}
                    </Button>
                </div>
            )}
        </Box>
    )
})

export default ArbeidstakerInfokort
