import { useEffect, useState } from 'react'
import { useSoknadContext } from '../context/soknad/SoknadContext'
import { ActionTypes } from '../context/soknad/soknad'

let timer: ReturnType<typeof setTimeout>

export const useError = () => {
    const [message, setError] = useState<null | string>(null)
    const { dispatch } = useSoknadContext()

    useEffect(() => {
        clearTimeout(timer)
        timer = setTimeout(() => setError(null), 10000)
        dispatch({ type: ActionTypes.SET_ERROR, payload: message })
    }, [message])

    return { setError, message }
}
