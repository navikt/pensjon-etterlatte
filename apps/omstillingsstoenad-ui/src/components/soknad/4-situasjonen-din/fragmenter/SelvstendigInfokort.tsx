import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Detail, Label, RadioProps } from '@navikt/ds-react'
import { RHFInput, RHFNumberInput, RHFProsentInput } from '../../../felles/rhf/RHFInput'
import { RHFRadio, RHFSpoersmaalRadio } from '../../../felles/rhf/RHFRadio'
import { DeleteFilled } from '@navikt/ds-icons'
import { useFormContext } from 'react-hook-form'
import { SkjemaElement } from '../../../felles/SkjemaElement'
import Bredde from '../../../../typer/bredde'
import { Arbeidsmengde } from '../../../../typer/arbeidsforhold'
import { IValg } from '../../../../typer/Spoersmaal'
import HvorforSpoerVi from '../../../felles/HvorforSpoerVi'

interface Props {
    lengde: number
    index: number
    fjern: (index: number) => void
}

const SelvstendigInfokort = memo(({ lengde, index, fjern }: Props) => {
    const { t } = useTranslation()

    const { watch } = useFormContext()
    const arbeidsmengde = watch(`selvstendig[${index}].arbeidsmengde.fyllUt`)
    const endretArbeidssituasjon = watch(`selvstendig[${index}].forventerEndretArbeidssituasjon.svar`)


    return (
        <>
            <RHFInput
                className={'kol-75'}
                name={`selvstendig[${index}].beskrivelse` as const}
                label={t('dinSituasjon.selvstendig.hvaHeterNaeringen')}
                description={t('dinSituasjon.selvstendig.hvaHeterNaeringen.beskrivelse')}
            />

            <SkjemaElement>
                <RHFNumberInput
                    name={`selvstendig[${index}].orgnr` as const}
                    placeholder={t('dinSituasjon.selvstendig.orgnrplaceholder')}
                    label={t('dinSituasjon.selvstendig.orgnr')}
                    maxLength={9}
                    minLength={9}
                    htmlSize={Bredde.S}
                />
            </SkjemaElement>

            <SkjemaElement>
                <Label>{t('dinSituasjon.arbeidsforhold.arbeidsmengde')}</Label>
                <Detail textColor="subtle">{t('dinSituasjon.arbeidsforhold.stillingsprosent.description')}</Detail>
                <RHFRadio
                    name={`selvstendig[${index}].arbeidsmengde.fyllUt` as const}
                    legend={t('dinSituasjon.arbeidsforhold.arbeidsmengde.fyllUt')}
                >
                    {Object.values(Arbeidsmengde).map((value) => {
                        return { children: t(value), value } as RadioProps
                    })}
                </RHFRadio>
                {arbeidsmengde === Arbeidsmengde.prosent && (
                    <RHFProsentInput
                        name={`selvstendig[${index}].stillingsprosent` as const}
                        label={t('dinSituasjon.arbeidsforhold.stillingsprosent')}
                    />
                )}

                {arbeidsmengde === Arbeidsmengde.timer && (
                    <RHFNumberInput
                        name={`selvstendig[${index}].arbeidsmengde.timer` as const}
                        label={t('dinSituasjon.arbeidsforhold.arbeidsmengde.timer')}
                    />
                )}
            </SkjemaElement>

            <SkjemaElement>
                <RHFSpoersmaalRadio
                    name={`selvstendig[${index}].forventerEndretArbeidssituasjon.svar` as const}
                    legend={t('dinSituasjon.arbeidsforhold.forventerEndretInntekt.svar')}
                />
            </SkjemaElement>

            {endretArbeidssituasjon === IValg.JA && (
                <SkjemaElement>
                    <RHFInput
                        name={`selvstendig[${index}].forventerEndretArbeidssituasjon.beskrivelse`}
                        label={t('dinSituasjon.arbeidsforhold.forventerEndretArbeidssituasjon.beskrivelse')}
                    />
                </SkjemaElement>
            )}

            <SkjemaElement>
                <HvorforSpoerVi title="dinSituasjon.selvstendig.grunnTilSpoersmål">
                    {t('dinSituasjon.selvstendig.grunnTilSpoersmål.hvorfor')}
                </HvorforSpoerVi>
            </SkjemaElement>

            {lengde > 1 && (
                <div style={{ textAlign: 'right' }}>
                    <Button variant={'secondary'} type={'button'} onClick={() => fjern(index)}>
                        <DeleteFilled /> &nbsp;{t('knapp.fjern')}
                    </Button>
                </div>
            )}
        </>
    )
})

export default SelvstendigInfokort
