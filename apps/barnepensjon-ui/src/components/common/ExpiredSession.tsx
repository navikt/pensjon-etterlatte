import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { getExpirationTimeForLoggedInUser } from '../../api/api'
import useTranslation from '../../hooks/useTranslation'
import { convertSecondsToTime } from '../../utils/convertSecondsToTime'
import WebWorker from '../../utils/workers/WebWorker'
import CloseableAlert from './CloseableAlert'

const LogOutAlertWrapper = styled.div`
    position: fixed;
    top: calc(80px + 2rem);
    right: 1em;
    margin: 0 auto;
    max-width: 600px;
    width: 100%;
    padding-left: 2rem;
`

const ExpiredSession = () => {
    const [open, setIsOpen] = useState<boolean>(false)
    const [hasBeenClosed, setHasBeenClosed] = useState<boolean>(false)
    const [loggingOut, setLoggingOut] = useState<boolean>(false)
    const [timeLeft, setTimeLeft] = useState<number>()
    const [time, setTime] = useState(convertSecondsToTime(0))
    const { t } = useTranslation('logOutUser')

    useEffect(() => {
        getExpirationTimeForLoggedInUser().then((expirationTime: string) => {
            const endTime = new Date(expirationTime)
            WebWorker.registerCountdownListener({ endTime: endTime.getTime(), callbackFn: setTimeLeft })
        })

        return () => {
            if (WebWorker) WebWorker.removeCountdownListener()
        }
    }, [])

    useEffect(() => {
        if (typeof timeLeft !== 'number') return

        const fiveMinutes = 5 * 60
        setTime(convertSecondsToTime(timeLeft))

        if (timeLeft <= 0) {
            setLoggingOut(true)
            logOut()
        } else if (timeLeft <= fiveMinutes && !hasBeenClosed) {
            setIsOpen(true)
        }
    }, [timeLeft, hasBeenClosed])

    const logOut = async () => {
        try {
            const response: string = await getExpirationTimeForLoggedInUser()

            const endTime = new Date(response).getTime()
            const now = new Date().getTime()

            if (endTime <= now) {
                window.location.reload()
            } else {
                const endTime = new Date(response)
                WebWorker.updateEndTime(endTime.getTime())
                setLoggingOut(false)
            }
        } catch (error) {
            window.location.reload()
        }
    }

    return (
        <>
            {open && (
                <LogOutAlertWrapper>
                    <CloseableAlert
                        onClose={() => {
                            setIsOpen(false)
                            setHasBeenClosed(true)
                        }}
                    >
                        {loggingOut ? (
                            <div>{t('wereLoggingYouOut')}</div>
                        ) : (
                            <span>
                                {`${t('youWillBeLoggedOutIn')} `}
                                <strong>
                                    {`${time.minutes.toString().padStart(2, '0')}:${time.seconds
                                        .toString()
                                        .padStart(2, '0')}`}
                                </strong>
                                {` ${t('time')}.
                                ${t('sendNowOrContinueLater')}`}
                            </span>
                        )}
                    </CloseableAlert>
                </LogOutAlertWrapper>
            )}
        </>
    )
}

export default ExpiredSession
