import { memo } from 'react'
import { Arbeidsmengde, StillingType } from '../../../../typer/arbeidsforhold'
import { useTranslation } from 'react-i18next'
import { Button, Detail, Heading, RadioProps } from '@navikt/ds-react'
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
import HvorforSpoerVi from '../../../felles/HvorforSpoerVi'

interface Props {
    lengde: number
    index: number
    fjern: (index: number) => void
}

const ArbeidstakerInfokort = memo(({ lengde, index, fjern }: Props) => {
    const { t } = useTranslation()

    const { watch } = useFormContext()
    const ansettelsesforhold = watch(`arbeidsforhold[${index}].ansettelsesforhold`)
    const endretArbeidssituasjon = watch(`arbeidsforhold[${index}].forventerEndretArbeidssituasjon.svar`)
    const sluttdato = watch(`arbeidsforhold[${index}].midlertidig.svar`)

    const arbeidsmengdeValg = Object.values(Arbeidsmengde).map((value) => {
        return { label: t(value), value }
    })

    return (
        <>
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
                {ansettelsesforhold === StillingType.fast && (
                    <SkjemaElement>
                        <SkjemaElement>
                            <Heading size={'xsmall'}>
                                {t('merOmSituasjonenDin.arbeidsforhold.ansettelsesforhold.fast.tittel')}
                            </Heading>
                            <Detail>
                                {t('merOmSituasjonenDin.arbeidsforhold.ansettelsesforhold.fast.beskrivelse')}
                            </Detail>
                        </SkjemaElement>
                        <RHFProsentInput
                            name={`arbeidsforhold[${index}].arbeidsmengde.svar` as const}
                            label={t('merOmSituasjonenDin.arbeidsforhold.arbeidsmengde.svar.fast')}
                            htmlSize={Bredde.XS}
                        />
                    </SkjemaElement>
                )}

                {(ansettelsesforhold === StillingType.midlertidig ||
                    ansettelsesforhold === StillingType.tilkallingsvikar) && (
                    <SkjemaElement>
                        <SkjemaElement>
                            <Heading size={'xsmall'}>
                                {t('merOmSituasjonenDin.arbeidsforhold.ansettelsesforhold.fast.tittel')}
                            </Heading>
                            <Detail>
                                {t('merOmSituasjonenDin.arbeidsforhold.ansettelsesforhold.midlertidig.beskrivelse')}
                            </Detail>
                        </SkjemaElement>
                        <NumberSelectRad>
                            <RHFNumberInput
                                name={`arbeidsforhold[${index}].arbeidsmengde.svar` as const}
                                label={t('merOmSituasjonenDin.arbeidsforhold.arbeidsmengde.svar')}
                                htmlSize={Bredde.S}
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
                            />
                        </NumberSelectRad>
                        <SkjemaElement>
                            <RHFSpoersmaalRadio
                                name={`arbeidsforhold[${index}].midlertidig.svar` as const}
                                legend={t('merOmSituasjonenDin.arbeidsforhold.midlertidig.svar')}
                            />
                        </SkjemaElement>
                        {sluttdato === IValg.JA && (
                            <Datovelger
                                name={`arbeidsforhold[${index}].midlertidig.sluttdatoVelger`}
                                label={t('merOmSituasjonenDin.arbeidsforhold.midlertidig.sluttdatoVelger')}
                                minDate={new Date()}
                            />
                        )}
                    </SkjemaElement>
                )}
            </SkjemaGruppe>

            <SkjemaGruppe>
                <RHFSpoersmaalRadio
                    name={`arbeidsforhold[${index}].forventerEndretArbeidssituasjon.svar` as const}
                    legend={t('merOmSituasjonenDin.arbeidsforhold.forventerEndretArbeidssituasjon.svar')}
                />
                {endretArbeidssituasjon === IValg.JA && (
                    <SkjemaElement>
                        <RHFInputArea
                            name={`arbeidsforhold[${index}].forventerEndretArbeidssituasjon.beskrivelse`}
                            label={t('merOmSituasjonenDin.arbeidsforhold.forventerEndretArbeidssituasjon.beskrivelse')}
                            maxLength={200}
                            className={'width-50'}
                        />
                    </SkjemaElement>
                )}
                <HvorforSpoerVi title={'merOmSituasjonenDin.arbeidsforhold.forventerEndretArbeidssituasjon.svar'}>
                    {t('merOmSituasjonenDin.arbeidsforhold.sagtOppEllerRedusert.hvorfor')}
                </HvorforSpoerVi>
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
                <div
                    style={{
                        textAlign: 'right',
                        borderBottom: '1px solid grey',
                        paddingBottom: '1rem',
                        marginBottom: '1rem',
                    }}
                >
                    <Button variant={'secondary'} type={'button'} onClick={() => fjern(index)}>
                        <DeleteFilled /> &nbsp;{t('knapp.fjern')}
                    </Button>
                </div>
            )}
        </>
    )
})

export default ArbeidstakerInfokort
