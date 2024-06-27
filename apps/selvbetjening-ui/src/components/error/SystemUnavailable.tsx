import useTranslation from '../../hooks/useTranslation'
import { useEffect } from 'react'
import {LogEvents, useAmplitude} from "~hooks/useAmplitude";


export default function SystemUnavailable() {
    const { t } = useTranslation('systemUnavailable')

    const { logEvent } = useAmplitude()

    useEffect(() => {
        logEvent(LogEvents.SYSTEM_UNAVAILABLE)
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    const retry = () => {
        window.location.href = import.meta.env.BASE_URL
    }

    return (
        <div style={{ maxWidth: '500px', margin: 'auto' }}>
            Noe gikk galt selvbetjening...
        </div>
    )
}
