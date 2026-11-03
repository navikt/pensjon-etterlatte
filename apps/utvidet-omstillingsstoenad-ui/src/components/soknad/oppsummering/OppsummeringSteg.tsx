import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import { sendSoeknad } from '../../../api/api'
import { useBrukerContext } from '../../../context/bruker/BrukerContext'
import { ISoeknad } from '../../../context/soknad/soknad'
import { LogEvents, useAnalytics } from '../../../hooks/useAnalytics'
import { mapSoeknad } from '../../../utils/mapSoeknad'
import { SoeknadStegRute } from '../SoeknadSteg'
import { Oppsummering } from './Oppsummering'

export const OppsummeringSteg = () => {
    const { state: bruker } = useBrukerContext()
    const { t } = useTranslation()
    const navigate = useNavigate()
    const { logEvent } = useAnalytics()

    const send = async (soeknad: ISoeknad) => {
        const { fornavn, etternavn, foedselsnummer } = bruker
        if (!fornavn || !etternavn || !foedselsnummer) throw new Error('Mangler personopplysninger')

        // Node-serveren setter imageTag fra det deployede imaget før videresending.
        const kontrakt = mapSoeknad(soeknad, { fornavn, etternavn, foedselsnummer }, '', t)
        await sendSoeknad({ soeknader: [kontrakt] })
        logEvent(LogEvents.SEND_SOKNAD, { type: kontrakt.type })
        navigate('/skjema/sendt', { replace: true })
    }

    return (
        <SoeknadStegRute send={send}>
            <Oppsummering />
        </SoeknadStegRute>
    )
}
