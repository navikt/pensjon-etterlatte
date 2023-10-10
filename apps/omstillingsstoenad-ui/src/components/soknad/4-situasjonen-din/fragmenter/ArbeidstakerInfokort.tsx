import { memo } from 'react'
import { Arbeidsmengde, SagtOppEllerRedusert, StillingType } from '../../../../typer/arbeidsforhold'
import { useTranslation } from 'react-i18next'
import { Button, Detail, Heading, Label, RadioProps } from '@navikt/ds-react'
import { RHFInput, RHFNumberInput, RHFProsentInput } from '../../../felles/rhf/RHFInput'
import { RHFSelect } from '../../../felles/rhf/RHFSelect'
import { RHFRadio, RHFSpoersmaalRadio } from '../../../felles/rhf/RHFRadio'
import { IValg } from '../../../../typer/Spoersmaal'
import { DeleteFilled } from '@navikt/ds-icons'
import { useFormContext } from 'react-hook-form'
import { SkjemaElement } from '../../../felles/SkjemaElement'
import Datovelger from '../../../felles/Datovelger'
import HvorforSpoerVi from '../../../felles/HvorforSpoerVi'
import Bredde from '../../../../typer/bredde'

interface Props {
    lengde: number
    index: number
    fjern: (index: number) => void
}

const ArbeidstakerInfokort = memo(({ lengde, index, fjern }: Props) => {
    const { t } = useTranslation()

    const { watch } = useFormContext()
    const arbeidsmengde = watch(`arbeidsforhold[${index}].typeArbeidsmengde`)
    const ansettelsesforhold = watch(`arbeidsforhold[${index}].ansettelsesforhold`)
    const endretArbeidssituasjon = watch(`arbeidsforhold[${index}].forventerEndretArbeidssituasjon.svar`)
    const sluttdato = watch(`arbeidsforhold[${index}].midlertidig.svar`)

    return (
        <>
            {lengde > 1 && <Heading size={'small'}>{`${t('dinSituasjon.arbeidsforhold.arbeidssted')} ${index + 1}`}</Heading>}
            <SkjemaElement>
                <RHFInput
                    className={'kol-50'}
                    name={`arbeidsforhold[${index}].arbeidsgiver` as const}
                    label={t('dinSituasjon.arbeidsforhold.arbeidsgiver')}
                    htmlSize={Bredde.M}
                />
            </SkjemaElement>

            <SkjemaElement>
                <Label>{t('dinSituasjon.arbeidsforhold.arbeidsmengde')}</Label>
                <Detail textColor="subtle">{t('dinSituasjon.arbeidsforhold.arbeidsmengde.beskrivelse')}</Detail>
                <RHFRadio
                    name={`arbeidsforhold[${index}].typeArbeidsmengde` as const}
                    legend={t('dinSituasjon.arbeidsforhold.typeArbeidsmengde')}
                >
                    {Object.values(Arbeidsmengde).map((value) => {
                        return { children: t(value), value } as RadioProps
                    })}
                </RHFRadio>
                {arbeidsmengde === Arbeidsmengde.prosent && (
                    <RHFProsentInput
                        name={`arbeidsforhold[${index}].arbeidsmengde.prosent` as const}
                        label={t('dinSituasjon.arbeidsforhold.arbeidsmengde.prosent')}
                        htmlSize={Bredde.S}
                    />
                )}

                {arbeidsmengde === Arbeidsmengde.timer && (
                    <RHFNumberInput
                        name={`arbeidsforhold[${index}].arbeidsmengde.timer` as const}
                        label={t('dinSituasjon.arbeidsforhold.arbeidsmengde.timer')}
                        htmlSize={Bredde.S}
                    />
                )}
            </SkjemaElement>

            <SkjemaElement>
                <RHFSelect
                    name={`arbeidsforhold[${index}].ansettelsesforhold` as const}
                    label={t('dinSituasjon.arbeidsforhold.ansettelsesforhold')}
                    selectOptions={[
                        { label: t('felles.velg'), value: '' },
                        {
                            label: t(StillingType.fast),
                            value: StillingType.fast,
                        },
                        {
                            label: t(StillingType.midlertidig),
                            value: StillingType.midlertidig,
                        },
                        {
                            label: t(StillingType.sesongarbeid),
                            value: StillingType.sesongarbeid,
                        },
                    ]}
                />
            </SkjemaElement>

            {ansettelsesforhold === StillingType.midlertidig && (
                <SkjemaElement>
                    <RHFSpoersmaalRadio
                        name={`arbeidsforhold[${index}].midlertidig.svar` as const}
                        legend={t('dinSituasjon.arbeidsforhold.midlertidig.svar')}
                    />
                    {sluttdato === IValg.JA && (
                        <Datovelger
                            name={`arbeidsforhold[${index}].midlertidig.sluttdatoVelger`}
                            label={t('dinSituasjon.arbeidsforhold.midlertidig.sluttdatoVelger')}
                            minDate={new Date()}
                        />
                    )}
                </SkjemaElement>
            )}

            <SkjemaElement>
                <RHFSpoersmaalRadio
                    name={`arbeidsforhold[${index}].forventerEndretArbeidssituasjon.svar` as const}
                    legend={t('dinSituasjon.arbeidsforhold.forventerEndretArbeidssituasjon.svar')}
                />
            </SkjemaElement>

            {endretArbeidssituasjon === IValg.JA && (
                <SkjemaElement>
                    <RHFInput
                        name={`arbeidsforhold[${index}].forventerEndretArbeidssituasjon.beskrivelse`}
                        label={t('dinSituasjon.arbeidsforhold.forventerEndretArbeidssituasjon.beskrivelse')}
                        htmlSize={Bredde.M}
                    />
                </SkjemaElement>
            )}

            <SkjemaElement>
                <RHFRadio
                    name={`arbeidsforhold[${index}].sagtOppEllerRedusert.svar` as const}
                    legend={t('dinSituasjon.arbeidsforhold.sagtOppEllerRedusert.svar')}
                    description={t('dinSituasjon.arbeidsforhold.sagtOppEllerRedusert.beskrivelse')}
                >
                    {Object.values(SagtOppEllerRedusert).map((value) => {
                        return { children: t(value), value } as RadioProps
                    })}
                </RHFRadio>
                <HvorforSpoerVi title="dinSituasjon.arbeidsforhold.sagtOppEllerRedusert.svar">
                    {t('dinSituasjon.arbeidsforhold.sagtOppEllerRedusert.hvorfor')}
                </HvorforSpoerVi>
            </SkjemaElement>

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
