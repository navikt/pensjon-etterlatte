import { useUserContext } from '../context/user/UserContext'
import { useEffect, useState } from 'react'
import { getLoggedInUser } from '../api/api'
import { ActionTypes, User } from '../context/user/user'

const useLoggedInUser = () => {
    const { dispatch } = useUserContext()
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)

        getLoggedInUser()
            .then((user: User) => {
                dispatch({
                    type: ActionTypes.SET_USER,
                    payload: user,
                })

                // TODO: Div sjekker på for å se om bruker er gyldig
                //  Her må vi undersøke hva som gjelder for barn, gjenlev. og verge
            })
            .catch(() => {
                setLoading(false)
            })
    }, [dispatch])

    return loading
}

export default useLoggedInUser
