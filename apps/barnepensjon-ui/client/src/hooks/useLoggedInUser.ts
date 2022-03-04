import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getLoggedInUser } from '../api/api'
import { ActionTypes, User } from '../context/user/user'
import { useUserContext } from '../context/user/UserContext'
import { getAgeFromDate, validAge } from '../utils/age'

export default function useLoggedInUser() {
    const navigate = useNavigate()
    const { state, dispatch } = useUserContext()
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!!state.foedselsnummer) return

        setLoading(true)

        getLoggedInUser()
            .then((user: User) => {
                const alder = getAgeFromDate(user.foedselsdato!!)
                const kanSoeke = validAge(alder)

                dispatch({
                    type: ActionTypes.SET_USER,
                    payload: { ...user, alder, kanSoeke },
                })

                // TODO: Div sjekker på for å se om bruker er gyldig
                //  Her må vi undersøke hva som gjelder for barn, gjenlev. og verge
            })
            .catch(() => {
                setLoading(false)
                navigate('/system-utilgjengelig')
            })
            .finally(() => setLoading(false))
    }, [dispatch, navigate, state.foedselsnummer])

    return loading
}
