import { RHFRadio } from '../../../felles/rhf/RHFRadio'
import { ISituasjonenDin, Sivilstatus } from '../../../../typer/person'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { RadioProps } from '@navikt/ds-react'
import SamboerSkjema from './SamboerSkjema'
import { SkjemaGruppe } from '../../../felles/SkjemaGruppe'

const NySivilstatus = () => {
    const { t } = useTranslation()

    const { watch } = useFormContext<ISituasjonenDin>()

    const sivilstatus = watch('nySivilstatus.sivilstatus')
    return (
        <SkjemaGruppe>
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
        </SkjemaGruppe>
    )
}

export default NySivilstatus
