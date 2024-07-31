import { useEffect } from 'react'
import {LogEvents, useAmplitude} from "~hooks/useAmplitude";


export default function SystemUnavailable() {

    const { logEvent } = useAmplitude()

    useEffect(() => {
        logEvent(LogEvents.SYSTEM_UNAVAILABLE)
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div style={{ maxWidth: '500px', margin: 'auto' }}>
            Noe gikk galt selvbetjening...
        </div>
    )
}
