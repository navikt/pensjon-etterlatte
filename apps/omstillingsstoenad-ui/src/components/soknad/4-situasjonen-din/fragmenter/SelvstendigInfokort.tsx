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
    type: 'enk' | 'as'
}

const SelvstendigInfokort = memo(({ lengde, index, fjern, type }: Props) => {
    const { t } = useTranslation()

    const { watch } = useFormContext()
    const selvstendigName = `selvstendig.${type}[${index}]`

    const arbeidsmengde = watch(`${selvstendigName}.typeArbeidsmengde`)
    const endretArbeidssituasjon = watch(`${selvstendigName}.forventerEndretArbeidssituasjon.svar`)

    return (
        <>
            <RHFInput
                className={'kol-75'}
                name={`${selvstendigName}.beskrivelse` as const}
                label={t('dinSituasjon.selvstendig.hvaHeterNaeringen')}
                description={t('dinSituasjon.selvstendig.hvaHeterNaeringen.beskrivelse')}
            />

            <SkjemaElement>
                <RHFNumberInput
                    name={`${selvstendigName}.orgnr` as const}
                    placeholder={t('dinSituasjon.selvstendig.orgnrplaceholder')}
                    label={t('dinSituasjon.selvstendig.orgnr')}
                    maxLength={9}
                    minLength={9}
                    htmlSize={Bredde.S}
                />
            </SkjemaElement>

            <SkjemaElement>
                <Label>{t('dinSituasjon.selvstendig.arbeidsmengde')}</Label>
                <Detail textColor="subtle">{t('dinSituasjon.selvstendig.stillingsprosent.description')}</Detail>
                <RHFRadio
                    name={`${selvstendigName}.typeArbeidsmengde` as const}
                    legend={t('dinSituasjon.selvstendig.typeArbeidsmengde')}
                >
                    {Object.values(Arbeidsmengde).map((value) => {
                        return { children: t(value), value } as RadioProps
                    })}
                </RHFRadio>
                {arbeidsmengde === Arbeidsmengde.prosent && (
                    <RHFProsentInput
                        name={`${selvstendigName}.arbeidsmengde.prosent` as const}
                        label={t('dinSituasjon.selvstendig.arbeidsmengde.prosent')}
                    />
                )}

                {arbeidsmengde === Arbeidsmengde.timer && (
                    <RHFNumberInput
                        name={`${selvstendigName}.arbeidsmengde.timer` as const}
                        label={t('dinSituasjon.selvstendig.arbeidsmengde.timer')}
                    />
                )}
            </SkjemaElement>

            <SkjemaElement>
                <RHFSpoersmaalRadio
                    name={`${selvstendigName}.forventerEndretArbeidssituasjon.svar` as const}
                    legend={t('dinSituasjon.selvstendig.forventerEndretInntekt.svar')}
                />
            </SkjemaElement>

            {endretArbeidssituasjon === IValg.JA && (
                <SkjemaElement>
                    <RHFInput
                        name={`${selvstendigName}.forventerEndretArbeidssituasjon.beskrivelse`}
                        label={t('dinSituasjon.selvstendig.forventerEndretArbeidssituasjon.beskrivelse')}
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
