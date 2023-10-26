/* eslint-disable no-restricted-globals */

import { CountdownMessage } from '../../types/countdown'
import {logger} from "../logger";

let countdown: ReturnType<typeof setInterval>
let counter = false
let endTime = 0

const sendCountdownMessage = (period: number) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    self.postMessage({ msg: CountdownMessage.COUNTDOWN_NOTIFICATION, period })
}

const notifyCountdownListener = () => {
    const currentTime = new Date()
    const period = Math.floor((endTime - currentTime.valueOf()) / 1000)

    sendCountdownMessage(period)
}

const startCountdown = () => {
    counter = true
    countdown = setInterval(() => {
        notifyCountdownListener()
    }, 1000)
}

const stopCountdown = () => {
    counter = false
    clearInterval(countdown)
}

const registerCountdownListener = (newEndTime: number) => {
    endTime = newEndTime
    if (!counter) {
        startCountdown()
    }
}

const removeCountdownListener = () => {
    if (counter) {
        stopCountdown()
    }
}

self.onmessage = async (event: MessageEvent<{ msg: CountdownMessage; endTime: number }>) => {
    const data = event?.data

    if (!data?.msg) return

    logger.info(`Origin: ${event.origin}`)

    switch (data.msg) {
        case CountdownMessage.REGISTER_COUNTDOWN_LISTENER:
            return registerCountdownListener(data.endTime)
        case CountdownMessage.UPDATE_COUNTDOWN_LISTENER:
            return registerCountdownListener(data.endTime)
        case CountdownMessage.REMOVE_COUNTDOWN_LISTENER:
            return removeCountdownListener()
        default:
    }
}
