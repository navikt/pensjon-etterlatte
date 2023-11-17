import { RHFSpoersmaalRadio } from '../../../felles/rhf/RHFRadio'
import { useTranslation } from 'react-i18next'
import React from 'react'
import { IMerOmSituasjonenDin } from '../../../../typer/situasjon'
import { RHFInput, RHFNumberInput } from '../../../felles/rhf/RHFInput'
import { useFormContext } from 'react-hook-form'
import { Heading } from '@navikt/ds-react'
import { SkjemaElement } from '../../../felles/SkjemaElement'
import { SkjemaGruppe } from '../../../felles/SkjemaGruppe'
import Bredde from '../../../../typer/bredde'
import { IValg } from '../../../../typer/Spoersmaal'

const EtablererVirksomhet = () => {
    const { t } = useTranslation()

    const { watch } = useFormContext<IMerOmSituasjonenDin>()

    const harForretningsplan = watch('etablererVirksomhet.forretningsplan.svar')

    return (
        <SkjemaGruppe>
            <SkjemaElement>
                <Heading size={'small'}>{t('merOmSituasjonenDin.etablererVirksomhet.tittel')}</Heading>
            </SkjemaElement>

            <RHFInput
                name={'etablererVirksomhet.hvaHeterVirksomheten'}
                label={t('merOmSituasjonenDin.etablererVirksomhet.hvaHeterVirksomheten')}
                htmlSize={Bredde.M}
            />

            <SkjemaElement>
                <RHFNumberInput
                    name={`etablererVirksomhet.orgnr` as const}
                    label={t('merOmSituasjonenDin.etablererVirksomhet.orgnr')}
                    description={t('merOmSituasjonenDin.selvstendig.orgnrplaceholder')}
                    maxLength={9}
                    minLength={9}
                    htmlSize={Bredde.S}
                />
            </SkjemaElement>

            <SkjemaElement>
                <RHFSpoersmaalRadio
                    name={`etablererVirksomhet.forretningsplan.svar` as const}
                    legend={t('merOmSituasjonenDin.etablererVirksomhet.forretningsplan.svar')}
                />
            </SkjemaElement>

            {harForretningsplan === IValg.JA && (
                <SkjemaElement>
                    <RHFSpoersmaalRadio
                        name={`etablererVirksomhet.forretningsplan.samarbeidMedNAV.svar` as const}
                        legend={t('merOmSituasjonenDin.etablererVirksomhet.forretningsplan.samarbeidMedNAV.svar')}
                    />
                </SkjemaElement>
            )}
        </SkjemaGruppe>
    )
}

export default EtablererVirksomhet
