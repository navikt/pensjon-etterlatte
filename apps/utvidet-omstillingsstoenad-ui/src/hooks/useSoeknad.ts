import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { hentSoeknad } from '../api/api'
import { useBrukerContext } from '../context/bruker/BrukerContext'
import { useSoknadContext } from '../context/soknad/SoknadContext'
import { ActionTypes, ISoeknad } from '../context/soknad/soknad'
import { useError } from './useError'

const useSoeknad = () => {
    const navigate = useNavigate()
    const location = useLocation()

    const { state: bruker } = useBrukerContext()
    const { dispatch } = useSoknadContext()
    const { setError } = useError()

    // TODO: loading-skjerm bør gjøres global og styres fra soknadskonteksten (p.g.a flere ting som laster data som også kan feile)
    const [lasterSoeknad, settLasterSoeknad] = useState(true)

    useEffect(() => {
        if (!bruker.kanSoeke || location.pathname === '/skjema/admin') {
            settLasterSoeknad(false)
            return
        }

        hentSoeknad()
            .then((soeknad: ISoeknad | undefined) => {
                if (soeknad?.harSamtykket) {
                    dispatch({ type: ActionTypes.HENT_SOEKNAD, payload: soeknad })
                } else {
                    navigate('/')
                }
            })
            .catch((err: Error) => {
                if (err.message === 'FERDIGSTILT') {
                    navigate('/skjema/sendt')
                } else {
                    setError('Det skjedde en feil. Prøv igjen senere.')
                    navigate('/')
                }
            })
            .finally(() => settLasterSoeknad(false))
    }, [bruker])

    return lasterSoeknad
}

export default useSoeknad
