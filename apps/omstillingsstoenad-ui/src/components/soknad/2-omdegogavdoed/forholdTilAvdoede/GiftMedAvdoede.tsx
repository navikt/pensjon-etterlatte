import { Box } from '@navikt/ds-react'
import { useTranslation } from 'react-i18next'
import { useBrukerContext } from '../../../../context/bruker/BrukerContext'
import { useSoknadContext } from '../../../../context/soknad/SoknadContext'
import Datovelger from '../../../felles/Datovelger'
import { RHFSpoersmaalRadio } from '../../../felles/rhf/RHFRadio'

const GiftMedAvdoede = () => {
    const { t } = useTranslation()

    const { state } = useBrukerContext()
    const { state: soknadState } = useSoknadContext()

    const datoforDoedsfallet = soknadState.omDenAvdoede.datoForDoedsfallet

    return (
        <>
            <Box marginBlock="4">
                <Datovelger
                    name={'forholdTilAvdoede.datoForInngaattPartnerskap'}
                    label={t('omDegOgAvdoed.forholdTilAvdoede.datoForInngaattPartnerskap')}
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
        </>
    )
}

export default GiftMedAvdoede
