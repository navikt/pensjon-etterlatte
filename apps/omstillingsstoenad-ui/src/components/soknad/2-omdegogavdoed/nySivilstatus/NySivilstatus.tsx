import { RHFRadio } from '../../../felles/rhf/RHFRadio'
import { ISoeker, Sivilstatus } from '../../../../typer/person'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { BodyLong, Heading, RadioProps } from '@navikt/ds-react'
import SamboerSkjema from './SamboerSkjema'
import { SkjemaGruppe } from '../../../felles/SkjemaGruppe'

const NySivilstatus = () => {
    const { t } = useTranslation()

    const { watch } = useFormContext<ISoeker>()

    const sivilstatus = watch('nySivilstatus.sivilstatus')
    return (
        <SkjemaGruppe>
            <>
                <Heading size={'small'}>{t('omDeg.nySivilstatus.sivilstatus')}</Heading>

                <BodyLong>{t('omDeg.nySivilstatus.beskrivelse')}</BodyLong>
            </>

            <RHFRadio legend={''} name={'nySivilstatus.sivilstatus'}>
                {Object.values(Sivilstatus).map((value) => {
                    return { children: t(value), value, required: true } as RadioProps
                })}
            </RHFRadio>

            {sivilstatus === Sivilstatus.samboerskap && <SamboerSkjema />}
        </SkjemaGruppe>
    )
}

export default NySivilstatus
