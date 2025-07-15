import { Box, RadioProps } from '@navikt/ds-react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { ISituasjonenDin, Sivilstatus } from '../../../../typer/person'
import { RHFRadio } from '../../../felles/rhf/RHFRadio'
import SamboerSkjema from './SamboerSkjema'

const NySivilstatus = () => {
    const { t } = useTranslation()

    const { watch } = useFormContext<ISituasjonenDin>()

    const sivilstatus = watch('nySivilstatus.sivilstatus')
    return (
        <Box marginBlock="0 12">
            <RHFRadio
                legend={t('situasjonenDin.nySivilstatus.sivilstatus')}
                description={t('situasjonenDin.nySivilstatus.beskrivelse')}
                name={'nySivilstatus.sivilstatus'}
            >
                {Object.values(Sivilstatus).map((value) => {
                    return { children: t(value), value, required: true } as RadioProps
                })}
            </RHFRadio>

            {sivilstatus === Sivilstatus.samboerskap && <SamboerSkjema />}
        </Box>
    )
}

export default NySivilstatus
