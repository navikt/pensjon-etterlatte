import { Box, Heading } from '@navikt/ds-react'
import React from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import Bredde from '../../../../typer/bredde'
import { IValg } from '../../../../typer/Spoersmaal'
import { IMerOmSituasjonenDin } from '../../../../typer/situasjon'
import { RHFCheckboksGruppe } from '../../../felles/rhf/RHFCheckboksPanelGruppe'
import { RHFInput, RHFNumberInput } from '../../../felles/rhf/RHFInput'
import { RHFSpoersmaalRadio } from '../../../felles/rhf/RHFRadio'

const EtablererVirksomhet = () => {
    const { t } = useTranslation()

    const { watch } = useFormContext<IMerOmSituasjonenDin>()

    const harForretningsplan = watch('etablererVirksomhet.forretningsplan.svar')
    const manglerOrgnr = watch('etablererVirksomhet.manglerOrgnr')

    return (
        <Box marginBlock="0 12">
            <Box marginBlock="4">
                <Heading size={'small'}>{t('merOmSituasjonenDin.etablererVirksomhet.tittel')}</Heading>
            </Box>

            <RHFInput
                name={'etablererVirksomhet.hvaHeterVirksomheten'}
                label={t('merOmSituasjonenDin.etablererVirksomhet.hvaHeterVirksomheten')}
                htmlSize={Bredde.M}
            />

            <Box marginBlock="4">
                <RHFNumberInput
                    name={`etablererVirksomhet.orgnr` as const}
                    label={t('merOmSituasjonenDin.etablererVirksomhet.orgnr')}
                    description={t('merOmSituasjonenDin.selvstendig.orgnrplaceholder')}
                    maxLength={9}
                    minLength={9}
                    htmlSize={Bredde.S}
                    valgfri={!!manglerOrgnr?.length}
                />
            </Box>

            <Box marginBlock="4">
                <RHFCheckboksGruppe
                    name={'etablererVirksomhet.manglerOrgnr'}
                    checkboxes={[
                        {
                            children: t('merOmSituasjonenDin.etablererVirksomhet.manglerOrgnr'),
                            value: t('merOmSituasjonenDin.etablererVirksomhet.manglerOrgnr'),
                        },
                    ]}
                    legend={t('merOmSituasjonenDin.etablererVirksomhet.manglerOrgnr')}
                    hideLegend
                    required={false}
                />
            </Box>

            <Box marginBlock="4">
                <RHFSpoersmaalRadio
                    name={`etablererVirksomhet.forretningsplan.svar` as const}
                    legend={t('merOmSituasjonenDin.etablererVirksomhet.forretningsplan.svar')}
                />
            </Box>

            {harForretningsplan === IValg.JA && (
                <Box marginBlock="4">
                    <RHFSpoersmaalRadio
                        name={`etablererVirksomhet.forretningsplan.samarbeidMedNAV.svar` as const}
                        legend={t('merOmSituasjonenDin.etablererVirksomhet.forretningsplan.samarbeidMedNAV.svar')}
                    />
                </Box>
            )}
        </Box>
    )
}

export default EtablererVirksomhet
