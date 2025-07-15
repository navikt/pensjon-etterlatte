import { Box } from '@navikt/ds-react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useBrukerContext } from '../../../../context/bruker/BrukerContext'
import { useSoknadContext } from '../../../../context/soknad/SoknadContext'
import { ISoekerOgAvdoed } from '../../../../typer/person'
import { IValg } from '../../../../typer/Spoersmaal'
import Datovelger from '../../../felles/Datovelger'
import { RHFSpoersmaalRadio } from '../../../felles/rhf/RHFRadio'

const SamboerMedAvdoede = () => {
    const { t } = useTranslation()

    const { watch } = useFormContext<ISoekerOgAvdoed>()
    const { state } = useBrukerContext()
    const { state: soknadState } = useSoknadContext()

    const ingenFellesBarn = watch('forholdTilAvdoede.fellesBarn') === IValg.NEI
    const datoforDoedsfallet = soknadState.omDenAvdoede.datoForDoedsfallet

    return (
        <>
            <Box marginBlock="4">
                <Datovelger
                    name={'forholdTilAvdoede.datoForInngaattSamboerskap'}
                    label={t('omDegOgAvdoed.forholdTilAvdoede.datoForInngaattSamboerskap')}
                    minDate={state.foedselsdato}
                    maxDate={datoforDoedsfallet || new Date()}
                />
            </Box>

            <Box marginBlock="4">
                <RHFSpoersmaalRadio
                    name={'forholdTilAvdoede.fellesBarn'}
                    legend={t('omDegOgAvdoed.forholdTilAvdoede.fellesBarn')}
                    description={t('omDegOgAvdoed.forholdTilAvdoede.fellesBarn.beskrivelse')}
                />
            </Box>

            {ingenFellesBarn && (
                <Box marginBlock="4">
                    <RHFSpoersmaalRadio
                        name={'forholdTilAvdoede.tidligereGift'}
                        legend={t('omDegOgAvdoed.forholdTilAvdoede.tidligereGift')}
                    />
                </Box>
            )}
        </>
    )
}

export default SamboerMedAvdoede
