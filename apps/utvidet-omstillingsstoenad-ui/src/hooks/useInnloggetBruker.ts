import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { hentInnloggetPerson } from '../api/api'
import { useBrukerContext } from '../context/bruker/BrukerContext'
import { ActionTypes as BrukerActionTypes, IBruker } from '../context/bruker/bruker'
import { gyldigAlder } from '../utils/alder'
import { capitalizeName } from '../utils/capitalize'
import { hentAlder } from '../utils/dato'

const useInnloggetBruker = () => {
    const navigate = useNavigate()

    const { dispatch } = useBrukerContext()
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)

        hentInnloggetPerson()
            .then((person: IBruker) => {
                const alder = hentAlder(person.foedselsdato!)
                const kanSoeke = gyldigAlder(alder)

                const fornavn = capitalizeName(person.fornavn!)
                const etternavn = capitalizeName(person.etternavn!)

                dispatch({
                    type: BrukerActionTypes.HENT_INNLOGGET_BRUKER,
                    payload: { ...person, fornavn, etternavn, alder, kanSoeke },
                })

                if (!kanSoeke) {
                    navigate('/ugyldig-alder')
                }
            })
            .catch(() => navigate('/system-utilgjengelig'))
            .finally(() => setLoading(false))
    }, [])

    return loading
}

export default useInnloggetBruker
