import { memo } from 'react'
import { Arbeidsmengde, SagtOppEllerRedusert, StillingType } from '../../../../typer/arbeidsforhold'
import { useTranslation } from 'react-i18next'
import { Button, Detail, Heading, RadioProps } from '@navikt/ds-react'
import { RHFInput, RHFInputArea, RHFNumberInput, RHFProsentInput } from '../../../felles/rhf/RHFInput'
import { RHFRadio, RHFSpoersmaalRadio } from '../../../felles/rhf/RHFRadio'
import { IValg } from '../../../../typer/Spoersmaal'
import { DeleteFilled } from '@navikt/ds-icons'
import { useFormContext } from 'react-hook-form'
import { SkjemaElement } from '../../../felles/SkjemaElement'
import Datovelger from '../../../felles/Datovelger'
import HvorforSpoerVi from '../../../felles/HvorforSpoerVi'
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
                <Heading size={'small'}>{`${t('dinSituasjon.arbeidsforhold.arbeidssted')} ${index + 1}`}</Heading>
            )}
            <SkjemaGruppe>
                <RHFInput
                    className={'kol-50'}
                    name={`arbeidsforhold[${index}].arbeidsgiver` as const}
                    label={t('dinSituasjon.arbeidsforhold.arbeidsgiver')}
                    htmlSize={Bredde.M}
                />
            </SkjemaGruppe>

            <SkjemaElement>
                <RHFRadio
                    name={`arbeidsforhold[${index}].ansettelsesforhold` as const}
                    legend={t('dinSituasjon.arbeidsforhold.ansettelsesforhold')}
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
                                {t('dinSituasjon.arbeidsforhold.ansettelsesforhold.fast.tittel')}
                            </Heading>
                            <Detail>{t('dinSituasjon.arbeidsforhold.ansettelsesforhold.fast.beskrivelse')}</Detail>
                        </SkjemaElement>
                        <RHFProsentInput
                            name={`arbeidsforhold[${index}].arbeidsmengde.svar` as const}
                            label={t('dinSituasjon.arbeidsforhold.arbeidsmengde.svar.fast')}
                            htmlSize={Bredde.XS}
                        />
                    </SkjemaElement>
                )}

                {(ansettelsesforhold === StillingType.midlertidig ||
                    ansettelsesforhold === StillingType.tilkallingsvikar) && (
                    <SkjemaElement>
                        <SkjemaElement>
                            <Heading size={'xsmall'}>
                                {t('dinSituasjon.arbeidsforhold.ansettelsesforhold.fast.tittel')}
                            </Heading>
                            <Detail>
                                {t('dinSituasjon.arbeidsforhold.ansettelsesforhold.midlertidig.beskrivelse')}
                            </Detail>
                        </SkjemaElement>
                        <NumberSelectRad>
                            <RHFNumberInput
                                name={`arbeidsforhold[${index}].arbeidsmengde.svar` as const}
                                label={t('dinSituasjon.arbeidsforhold.arbeidsmengde.svar')}
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
            </SkjemaGruppe>

            <SkjemaGruppe>
                <SkjemaElement>
                    <RHFSpoersmaalRadio
                        name={`arbeidsforhold[${index}].forventerEndretArbeidssituasjon.svar` as const}
                        legend={t('dinSituasjon.arbeidsforhold.forventerEndretArbeidssituasjon.svar')}
                    />
                </SkjemaElement>

                {endretArbeidssituasjon === IValg.JA && (
                    <SkjemaElement>
                        <RHFInputArea
                            name={`arbeidsforhold[${index}].forventerEndretArbeidssituasjon.beskrivelse`}
                            label={t('dinSituasjon.arbeidsforhold.forventerEndretArbeidssituasjon.beskrivelse')}
                            maxLength={100}
                            className={'width-50'}
                        />
                    </SkjemaElement>
                )}
            </SkjemaGruppe>

            <SkjemaElement>
                <RHFRadio
                    name={`arbeidsforhold[${index}].sagtOppEllerRedusert.svar` as const}
                    legend={t('dinSituasjon.arbeidsforhold.sagtOppEllerRedusert.svar')}
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
