import { Box, Heading } from '@navikt/ds-react'
import React from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { IValg } from '../../../../typer/Spoersmaal'
import { IMerOmSituasjonenDin } from '../../../../typer/situasjon'
import { RHFSpoersmaalRadio } from '../../../felles/rhf/RHFRadio'
import { SkjemaGruppe } from '../../../felles/SkjemaGruppe'

const Arbeidssoeker = () => {
    const { t } = useTranslation()

    const { watch } = useFormContext<IMerOmSituasjonenDin>()

    const registrertArbeidssoeker = watch('arbeidssoeker.svar')

    return (
        <SkjemaGruppe>
            <Box marginBlock="4">
                <Heading size={'small'}>{t('merOmSituasjonenDin.arbeidssoeker.tittel')}</Heading>
            </Box>

            <RHFSpoersmaalRadio name={'arbeidssoeker.svar'} legend={t('merOmSituasjonenDin.arbeidssoeker.svar')} />
            {registrertArbeidssoeker === IValg.JA && (
                <Box marginBlock="4">
                    <RHFSpoersmaalRadio
                        name={'arbeidssoeker.aktivitetsplan.svar'}
                        legend={t('merOmSituasjonenDin.arbeidssoeker.aktivitetsplan.svar')}
                    />
                </Box>
            )}
        </SkjemaGruppe>
    )
}

export default Arbeidssoeker
