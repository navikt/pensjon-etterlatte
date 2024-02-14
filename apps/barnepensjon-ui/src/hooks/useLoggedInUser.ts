import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getLoggedInUser } from '../api/api'
import { ActionTypes, User } from '../context/user/user'
import { useUserContext } from '../context/user/UserContext'
import { getAgeFromDate, isLegalAge } from '../utils/age'
import { capitalize } from '../utils/capitalize'

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
                const kanSoeke = isLegalAge(alder)

                const fornavn = capitalize(user.fornavn!!)
                const etternavn = capitalize(user.etternavn!!)

                dispatch({
                    type: ActionTypes.SET_USER,
                    payload: { ...user, fornavn, etternavn, alder, kanSoeke },
                })

                if (!kanSoeke) navigate('/ugyldig-soeker')
            })
            .catch(() => {
                setLoading(false)
                navigate('/system-utilgjengelig')
            })
            .finally(() => setLoading(false))
    }, [dispatch, navigate, state.foedselsnummer])

    return loading
}
