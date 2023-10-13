import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Detail, Label } from '@navikt/ds-react'
import { RHFInput, RHFNumberInput } from '../../../felles/rhf/RHFInput'
import { RHFSpoersmaalRadio } from '../../../felles/rhf/RHFRadio'
import { DeleteFilled } from '@navikt/ds-icons'
import { useFormContext } from 'react-hook-form'
import { SkjemaElement } from '../../../felles/SkjemaElement'
import Bredde from '../../../../typer/bredde'
import { Arbeidsmengde } from '../../../../typer/arbeidsforhold'
import { IValg } from '../../../../typer/Spoersmaal'
import HvorforSpoerVi from '../../../felles/HvorforSpoerVi'
import { RHFSelect } from '../../../felles/rhf/RHFSelect'
import { NumberSelectRad } from '../../../felles/StyledComponents'
import { SkjemaGruppe } from '../../../felles/SkjemaGruppe'

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

    const endretArbeidssituasjon = watch(`${selvstendigName}.forventerEndretArbeidssituasjon.svar`)

    const arbeidsmengdeValg = Object.values(Arbeidsmengde).map((value) => {
        return { label: t(value), value }
    })

    return (
        <>
            <SkjemaGruppe>
                <RHFInput
                    className={'kol-75'}
                    name={`${selvstendigName}.beskrivelse` as const}
                    label={t('dinSituasjon.selvstendig.hvaHeterNaeringen')}
                    description={t('dinSituasjon.selvstendig.hvaHeterNaeringen.beskrivelse')}
                    htmlSize={Bredde.M}
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
            </SkjemaGruppe>

            <SkjemaElement>
                <Label>
                    {type === 'enk'
                        ? t('dinSituasjon.selvstendig.arbeidsmengde.enk')
                        : t('dinSituasjon.selvstendig.arbeidsmengde')}
                </Label>
                <Detail textColor="subtle">{t('dinSituasjon.selvstendig.arbeidsmengde.beskrivelse')}</Detail>
                <SkjemaElement>
                    <NumberSelectRad>
                        <RHFNumberInput
                            name={`${selvstendigName}.arbeidsmengde.svar` as const}
                            label={t('dinSituasjon.selvstendig.arbeidsmengde.svar')}
                            htmlSize={Bredde.S}
                            maxLength={3}
                        />
                        <RHFSelect
                            name={`${selvstendigName}.arbeidsmengde.type` as const}
                            selectOptions={[
                                {
                                    label: t('felles.velg'),
                                    value: '',
                                },
                            ].concat(arbeidsmengdeValg)}
                            label={t('felles.velg.tittel')}
                        />
                    </NumberSelectRad>
                </SkjemaElement>
            </SkjemaElement>

            <SkjemaElement>
                <RHFSpoersmaalRadio
                    name={`${selvstendigName}.forventerEndretArbeidssituasjon.svar` as const}
                    legend={t('dinSituasjon.selvstendig.forventerEndretArbeidssituasjon.svar')}
                />
            </SkjemaElement>

            {endretArbeidssituasjon === IValg.JA && (
                <SkjemaElement>
                    <RHFInput
                        name={`${selvstendigName}.forventerEndretArbeidssituasjon.beskrivelse`}
                        label={t('dinSituasjon.selvstendig.forventerEndretArbeidssituasjon.beskrivelse')}
                        htmlSize={Bredde.M}
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
