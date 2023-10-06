import { RHFSpoersmaalRadio } from '../../../felles/rhf/RHFRadio'
import { useTranslation } from 'react-i18next'
import React from 'react'
import { ISituasjon } from '../../../../typer/situasjon'
import { useFormContext } from 'react-hook-form'
import { SkjemaElement } from '../../../felles/SkjemaElement'
import { SkjemaGruppe } from '../../../felles/SkjemaGruppe'
import { IValg } from '../../../../typer/Spoersmaal'

const Arbeidssoeker = () => {
    const { t } = useTranslation()

    const { watch } = useFormContext<ISituasjon>()

    const registrertArbeidssoeker = watch('arbeidssoeker.svar')

    return (
        <SkjemaGruppe>
            <SkjemaElement>
                <RHFSpoersmaalRadio
                    name={`arbeidssoeker.svar` as const}
                    legend={t('dinSituasjon.arbeidssoeker.svar')}
                />
                {registrertArbeidssoeker === IValg.JA && (
                    <RHFSpoersmaalRadio
                        name={`arbeidssoeker.aktivitetsplan.svar` as const}
                        legend={t('dinSituasjon.arbeidssoeker.aktivitetsplan.svar')}
                    />
                )}
            </SkjemaElement>
        </SkjemaGruppe>
    )
}

export default Arbeidssoeker
