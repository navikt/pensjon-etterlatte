import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { BodyShort, Button, Label, ReadMore } from '@navikt/ds-react'
import { RHFInput, RHFInputArea, RHFNumberInput } from '../../../felles/rhf/RHFInput'
import { RHFSpoersmaalRadio } from '../../../felles/rhf/RHFRadio'
import { DeleteFilled } from '@navikt/ds-icons'
import { useFormContext } from 'react-hook-form'
import { SkjemaElement } from '../../../felles/SkjemaElement'
import Bredde from '../../../../typer/bredde'
import { Arbeidsmengde } from '../../../../typer/arbeidsforhold'
import { IValg } from '../../../../typer/Spoersmaal'
import { RHFSelect } from '../../../felles/rhf/RHFSelect'
import { NumberSelectRad } from '../../../felles/StyledComponents'
import { SkjemaGruppe } from '../../../felles/SkjemaGruppe'
import { Panel } from '~components/felles/Panel'

interface Props {
    lengde: number
    index: number
    fjern: (index: number) => void
}

const SelvstendigInfokort = memo(({ lengde, index, fjern }: Props) => {
    const { t } = useTranslation()

    const { watch } = useFormContext()
    const selvstendigName = `selvstendig.[${index}]`

    const endretArbeidssituasjon = watch(`${selvstendigName}.forventerEndretArbeidssituasjon.svar`)

    const arbeidsmengdeValg = Object.values(Arbeidsmengde).map((value) => {
        return { label: t(value), value }
    })

    return (
        <Panel borderColor={'border-info'} borderWidth={'0 0 0 4'} background={'surface-selected'}>
            <SkjemaGruppe>
                <RHFInput
                    name={`${selvstendigName}.beskrivelse` as const}
                    label={t('merOmSituasjonenDin.selvstendig.hvaHeterNaeringen')}
                    description={t('merOmSituasjonenDin.selvstendig.hvaHeterNaeringen.beskrivelse')}
                    htmlSize={Bredde.M}
                />

                <SkjemaElement>
                    <RHFNumberInput
                        name={`${selvstendigName}.orgnr` as const}
                        description={t('merOmSituasjonenDin.selvstendig.orgnrplaceholder')}
                        label={t('merOmSituasjonenDin.selvstendig.orgnr')}
                        maxLength={9}
                        minLength={9}
                        htmlSize={Bredde.S}
                    />
                </SkjemaElement>
            </SkjemaGruppe>

            <SkjemaGruppe>
                <Label>{t('merOmSituasjonenDin.selvstendig.arbeidsmengde')}</Label>
                <BodyShort textColor="subtle">
                    {t('merOmSituasjonenDin.selvstendig.arbeidsmengde.beskrivelse')}
                </BodyShort>
                <SkjemaElement>
                    <NumberSelectRad>
                        <RHFNumberInput
                            name={`${selvstendigName}.arbeidsmengde.svar` as const}
                            label={t('merOmSituasjonenDin.selvstendig.arbeidsmengde.svar')}
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
            </SkjemaGruppe>

            <SkjemaElement>
                <RHFSpoersmaalRadio
                    name={`${selvstendigName}.forventerEndretArbeidssituasjon.svar` as const}
                    legend={t('merOmSituasjonenDin.selvstendig.forventerEndretArbeidssituasjon.svar')}
                />
            </SkjemaElement>

            {endretArbeidssituasjon === IValg.JA && (
                <SkjemaElement>
                    <RHFInputArea
                        name={`${selvstendigName}.forventerEndretArbeidssituasjon.beskrivelse`}
                        label={t('merOmSituasjonenDin.selvstendig.forventerEndretArbeidssituasjon.beskrivelse')}
                        maxLength={200}
                        className={'width-50'}
                    />
                </SkjemaElement>
            )}
            <SkjemaElement>
                <ReadMore header={t('hvorforSpoerVi')}>
                    {t('merOmSituasjonenDin.selvstendig.grunnTilSpoersmål.hvorfor')}
                </ReadMore>
            </SkjemaElement>

            {lengde > 1 && (
                <div>
                    <Button variant={'secondary'} type={'button'} onClick={() => fjern(index)}>
                        <DeleteFilled /> &nbsp;{t('knapp.fjern')}
                    </Button>
                </div>
            )}
        </Panel>
    )
})

export default SelvstendigInfokort
