import { useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import {LogEvents, useAmplitude} from "~hooks/useAmplitude";

export default function PageNotFound() {
    const location = useLocation()

    const { logEvent } = useAmplitude()

    useEffect(() => {
        logEvent(LogEvents.PAGE_NOT_FOUND, { side: location.pathname })
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div>
            Not found!
        </div>
    )
}
