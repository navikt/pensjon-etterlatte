import { RHFSpoersmaalRadio } from '../../../felles/rhf/RHFRadio'
import { useTranslation } from 'react-i18next'
import React from 'react'
import { IMerOmSituasjonenDin } from '../../../../typer/situasjon'
import { useFormContext } from 'react-hook-form'
import { SkjemaElement } from '../../../felles/SkjemaElement'
import { SkjemaGruppe } from '../../../felles/SkjemaGruppe'
import { IValg } from '../../../../typer/Spoersmaal'
import { Heading } from '@navikt/ds-react'

const Arbeidssoeker = () => {
    const { t } = useTranslation()

    const { watch } = useFormContext<IMerOmSituasjonenDin>()

    const registrertArbeidssoeker = watch('arbeidssoeker.svar')

    return (
        <SkjemaGruppe>
            <SkjemaElement>
                <Heading size={'small'}>{t('merOmSituasjonenDin.arbeidssoeker.tittel')}</Heading>
            </SkjemaElement>

            <RHFSpoersmaalRadio name={'arbeidssoeker.svar'} legend={t('merOmSituasjonenDin.arbeidssoeker.svar')} />
            {registrertArbeidssoeker === IValg.JA && (
                <SkjemaElement>
                    <RHFSpoersmaalRadio
                        name={'arbeidssoeker.aktivitetsplan.svar'}
                        legend={t('merOmSituasjonenDin.arbeidssoeker.aktivitetsplan.svar')}
                    />
                </SkjemaElement>
            )}
        </SkjemaGruppe>
    )
}

export default Arbeidssoeker
