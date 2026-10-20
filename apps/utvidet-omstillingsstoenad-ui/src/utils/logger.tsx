import Bowser from 'bowser'
import { loggFunc } from '../api/api'

const GYLDIG_FNR = (input: string | undefined) => /^\d{11}$/.test(input ?? '')

function sanitizeUrlPossibleFnr(url?: string): string {
    if (!url) return ''

    return url
        .split('/')
        .map((urlpart) => (GYLDIG_FNR(urlpart) ? `${urlpart.substring(0, 5)}******` : urlpart))
        .join('/')
}

const defaultContext = {
    url: sanitizeUrlPossibleFnr(window.location.href),
    userAgent: window.navigator.userAgent,
    userDeviceInfo: Bowser.getParser(window.navigator.userAgent).getResult(),
}

export interface IStackLineNoColumnNo {
    readonly lineno: number
    readonly columnno: number
    readonly message: string
    readonly error: string
}

type LoggType = 'info' | 'error'

const logg = (type: LoggType, innhold: { stackInfo: IStackLineNoColumnNo } | { data: object }) => {
    const data = { type, ...innhold, jsonContent: { ...defaultContext } }
    loggFunc(data).catch((err) => {
        console.error(`Unable to log ${type} message: `, data, ' err: ', err)
    })
}

export const logger = {
    info: (stackInfo: IStackLineNoColumnNo) => logg('info', { stackInfo }),
    error: (stackInfo: IStackLineNoColumnNo) => logg('error', { stackInfo }),
    generalInfo: (info: object) => logg('info', { data: info }),
    generalError: (info: object) => logg('error', { data: info }),
}

export const setupWindowOnError = () => {
    addEventListener('error', (event) => {
        const { error: kanskjeError, lineno, colno, message } = event

        //Ignorerer js som kræsjer fra andre domener
        if (message.toLowerCase().includes('script error')) {
            return true
        }

        const error = kanskjeError || {}
        if (import.meta.env.MODE === 'development') {
            console.error(error.message, error.stack)
        } else {
            if (message !== 'ResizeObserver loop completed with undelivered notifications.') {
                logger.error({ lineno, columnno: colno, message, error: JSON.stringify(error) })
            }

            if (error.stack && error.stack?.indexOf('invokeGuardedCallbackDev') >= 0 && !error.alreadySeen) {
                error.alreadySeen = true
                event.preventDefault()
                return true
            }
        }
        return true
    })
}
