import { TrashIcon } from '@navikt/aksel-icons'
import { BodyShort, Box, Button, HGrid, Label, ReadMore } from '@navikt/ds-react'
import { memo, useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Arbeidsmengde } from '../../../../typer/arbeidsforhold'
import Bredde from '../../../../typer/bredde'
import { IValg } from '../../../../typer/Spoersmaal'
import { RHFInput, RHFInputArea, RHFNumberInput } from '../../../felles/rhf/RHFInput'
import { RHFSpoersmaalRadio } from '../../../felles/rhf/RHFRadio'
import { RHFSelect } from '../../../felles/rhf/RHFSelect'

interface Props {
    lengde: number
    index: number
    fjern: (index: number) => void
}

const SelvstendigInfokort = memo(({ lengde, index, fjern }: Props) => {
    const { t } = useTranslation()

    const [visEndretArbeidssituasjon, setVisEndretArbeidssituasjon] = useState(false)

    const { watch, setValue } = useFormContext()
    const selvstendigName = `selvstendig.[${index}]`

    const endretArbeidssituasjon = watch(`${selvstendigName}.forventerEndretArbeidssituasjon.svar`)

    const arbeidsmengdeValg = Object.values(Arbeidsmengde).map((value) => {
        return { label: t(value), value }
    })

    useEffect(() => {
        setVisEndretArbeidssituasjon(endretArbeidssituasjon === IValg.JA)
        if (endretArbeidssituasjon === IValg.NEI) {
            setValue(`${selvstendigName}.forventerEndretArbeidssituasjon.svar`, IValg.NEI)
        }
    }, [endretArbeidssituasjon])

    return (
        <Box padding="space-16" borderColor={'info'} borderWidth={'0 0 0 4'} background={'accent-soft'}>
            <Box marginBlock="space-0 space-48">
                <RHFInput
                    name={`${selvstendigName}.beskrivelse` as const}
                    label={t('merOmSituasjonenDin.selvstendig.hvaHeterNaeringen')}
                    description={t('merOmSituasjonenDin.selvstendig.hvaHeterNaeringen.beskrivelse')}
                    htmlSize={Bredde.M}
                />

                <Box marginBlock="space-16">
                    <RHFNumberInput
                        name={`${selvstendigName}.orgnr` as const}
                        description={t('merOmSituasjonenDin.selvstendig.orgnrplaceholder')}
                        label={t('merOmSituasjonenDin.selvstendig.orgnr')}
                        maxLength={9}
                        minLength={9}
                        htmlSize={Bredde.S}
                    />
                </Box>
            </Box>
            <Box marginBlock="space-0 space-48">
                <Label>{t('merOmSituasjonenDin.selvstendig.arbeidsmengde')}</Label>
                <BodyShort textColor="subtle">
                    {t('merOmSituasjonenDin.selvstendig.arbeidsmengde.beskrivelse')}
                </BodyShort>
                <HGrid marginBlock="space-16" gap="space-16" columns={{ sm: 1, md: 2 }}>
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
                </HGrid>
            </Box>
            <Box marginBlock="space-16">
                <RHFSpoersmaalRadio
                    name={`${selvstendigName}.forventerEndretArbeidssituasjon.svar` as const}
                    legend={t('merOmSituasjonenDin.selvstendig.forventerEndretArbeidssituasjon.svar')}
                />
            </Box>
            <div style={{ display: visEndretArbeidssituasjon ? 'block' : 'none' }}>
                <Box marginBlock="space-16">
                    <RHFInputArea
                        name={`${selvstendigName}.forventerEndretArbeidssituasjon.beskrivelse`}
                        label={t('merOmSituasjonenDin.selvstendig.forventerEndretArbeidssituasjon.beskrivelse')}
                        maxLength={200}
                        className={'width-50'}
                        valgfri={!visEndretArbeidssituasjon}
                    />
                </Box>
            </div>
            <Box marginBlock="space-16">
                <ReadMore header={t('hvorforSpoerVi')}>
                    {t('merOmSituasjonenDin.selvstendig.grunnTilSpoersmål.hvorfor')}
                </ReadMore>
            </Box>
            {lengde > 1 && (
                <div>
                    <Button variant={'secondary'} type={'button'} onClick={() => fjern(index)}>
                        <TrashIcon fontSize="1.5rem" /> &nbsp;{t('knapp.fjern')}
                    </Button>
                </div>
            )}
        </Box>
    )
})

export default SelvstendigInfokort
