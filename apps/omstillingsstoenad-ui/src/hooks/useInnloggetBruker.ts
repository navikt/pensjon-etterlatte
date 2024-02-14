import { useEffect, useState } from 'react'
import { hentInnloggetPerson } from '../api/api'
import { ActionTypes as BrukerActionTypes, IBruker } from '../context/bruker/bruker'
import { hentAlder } from '../utils/dato'
import { gyldigAlder } from '../utils/alder'
import { useBrukerContext } from '../context/bruker/BrukerContext'
import { useNavigate } from 'react-router-dom'

export const capitalize = (str: string): string => {
    const strList = str.split(' ')
    return strList
        .map((str) => {
            return str.charAt(0).toUpperCase() + str.toLowerCase().slice(1)
        })
        .join(' ')
}

const useInnloggetBruker = () => {
    const navigate = useNavigate()

    const { dispatch } = useBrukerContext()
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)

        hentInnloggetPerson()
            .then((person: IBruker) => {
                const alder = hentAlder(person.foedselsdato!!)
                const kanSoeke = gyldigAlder(alder)

                const fornavn = capitalize(person.fornavn!!)
                const etternavn = capitalize(person.etternavn!!)

                dispatch({
                    type: BrukerActionTypes.HENT_INNLOGGET_BRUKER,
                    payload: { ...person, fornavn, etternavn, alder, kanSoeke },
                })

                if (!kanSoeke) {
                    navigate('/ugyldig-alder')
                }
            })
            .catch(() => {
                setLoading(false)
                navigate('/system-utilgjengelig')
            })
            .finally(() => setLoading(false))
    }, [])

    return loading
}

export default useInnloggetBruker
