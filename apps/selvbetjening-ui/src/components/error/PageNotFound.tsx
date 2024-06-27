import { BodyShort, Button, Heading, Link } from '@navikt/ds-react'
import useTranslation from '../../hooks/useTranslation'
import { useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { BugIcon } from '@navikt/aksel-icons'

export default function PageNotFound() {
    const location = useLocation()

    const { t } = useTranslation('pageNotFound')
    /*
    TODO
    const { logEvent } = useAmplitude()

    useEffect(() => {
        logEvent(LogEvents.PAGE_NOT_FOUND, { side: location.pathname })
    }, []) // eslint-disable-line react-hooks/exhaustive-deps
     */

    return (
        <div>
            Not found!
        </div>
    )
}
