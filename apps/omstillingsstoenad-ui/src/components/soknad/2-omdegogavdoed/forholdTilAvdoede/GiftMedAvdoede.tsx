import Datovelger from '../../../felles/Datovelger'
import { RHFSpoersmaalRadio } from '../../../felles/rhf/RHFRadio'
import { useTranslation } from 'react-i18next'
import { useBrukerContext } from '../../../../context/bruker/BrukerContext'
import { SkjemaElement } from '../../../felles/SkjemaElement'
import { useSoknadContext } from '../../../../context/soknad/SoknadContext'

const GiftMedAvdoede = () => {
    const { t } = useTranslation()

    const { state } = useBrukerContext()
    const { state: soknadState } = useSoknadContext()

    const datoforDoedsfallet = soknadState.omDenAvdoede.datoForDoedsfallet

    return (
        <>
            <SkjemaElement>
                <Datovelger
                    name={'forholdTilAvdoede.datoForInngaattPartnerskap'}
                    label={t('omDegOgAvdoed.forholdTilAvdoede.datoForInngaattPartnerskap')}
                    minDate={state.foedselsdato}
                    maxDate={datoforDoedsfallet || new Date()}
                />
            </SkjemaElement>
            <SkjemaElement>
                <RHFSpoersmaalRadio
                    name={'forholdTilAvdoede.fellesBarn'}
                    legend={t('omDegOgAvdoed.forholdTilAvdoede.fellesBarn')}
                    description={t('omDegOgAvdoed.forholdTilAvdoede.fellesBarn.beskrivelse')}
                />
            </SkjemaElement>
        </>
    )
}

export default GiftMedAvdoede
