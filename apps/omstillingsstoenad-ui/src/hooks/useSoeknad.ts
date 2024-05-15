import { useBrukerContext } from '../context/bruker/BrukerContext'
import { useSoknadContext } from '../context/soknad/SoknadContext'
import { useEffect, useState } from 'react'
import { hentSoeknad, lagreSoeknad } from '../api/api'
import { ActionTypes, ISoeknad } from '../context/soknad/soknad'
import { useNavigate, useLocation } from 'react-router-dom'
import { useError } from './useError'

const useSoeknad = () => {
    const navigate = useNavigate()
    const location = useLocation()

    const { state: bruker } = useBrukerContext()
    const { state, dispatch } = useSoknadContext()
    const { setError } = useError()

    // TODO: loading-skjerm bør gjøres global og styres fra soknadskonteksten (p.g.a flere ting som laster data som også kan feile)
    const [lasterSoeknad, settLasterSoeknad] = useState(true)

    useEffect(() => {
        if (!bruker.kanSoeke) {
            settLasterSoeknad(false)
            return
        }

        if (location.pathname === '/skjema/admin') {
            settLasterSoeknad(false)
        } else {
            hentSoeknad()
                .then((soeknad: ISoeknad | undefined) => {
                    if (!soeknad?.harSamtykket) {
                        navigate('/')
                    } else {
                        dispatch({ type: ActionTypes.HENT_SOEKNAD, payload: soeknad })
                    }
                })
                .catch((err: Error) => {
                    settLasterSoeknad(false)

                    if (err.message === 'FERDIGSTILT') {
                        navigate('/skjema/sendt')
                    } else {
                        setError('Det skjedde en feil. Prøv igjen senere.')
                        navigate('/')
                    }
                })
                .finally(() => settLasterSoeknad(false))
        }
    }, [bruker])

    useEffect(() => {
        // TODO: Finne bedre løsning
        //  En mulig løsning kan være at bruker alltid sendes til start ved refresh, men får info om pågående søknad
        //  og mulighet til å fortsette der de slapp. Deretter kan vi sende personen til det steget de stoppet på.

        if (state.klarForLagring) {
            const now = new Date()

            lagreSoeknad({ ...state, sistLagretDato: now })
                .then(() => dispatch({ type: ActionTypes.LAGRE_SOEKNAD, payload: now }))
                .catch(() => {
                    setError('Det skjedde en feil. Prøv igjen senere.')
                })
        }
    }, [state.klarForLagring])

    return lasterSoeknad
}

export default useSoeknad
