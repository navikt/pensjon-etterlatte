import Bowser from 'bowser'
import { axiosInstance as api, isDev } from '~api/axios'

const browser = Bowser.getParser(window.navigator.userAgent)

const GYLDIG_FNR = (input: string | undefined) => /^\d{11}$/.test(input ?? '')

function sanitizeUrlPossibleFnr(url?: string): string {
    if (url) {
        const splittedUrl = url.split('/')
        return splittedUrl
            .map((urlpart) => {
                if (GYLDIG_FNR(urlpart)) {
                    return urlpart.substring(0, 5).concat('******')
                }
                return urlpart
            })
            .join('/')
    }
    return ''
}

const defaultContext = {
    url: sanitizeUrlPossibleFnr(window.location.href),
    userAgent: window.navigator.userAgent,
    userDeviceInfo: { browser: browser.parse().getBrowser(), os: browser.parse().getOS() },
}

export interface IStackLineNoColumnNo {
    readonly lineno: number
    readonly columnno: number
    readonly message: string
    readonly error: string
}

export const loggFunc = async (data: unknown) => {
    if (isDev) {
        console.log(
            `Logging til pod er deaktivert for lokal kjøring, returnerer uten å logge dit. Meldinga var: ${JSON.stringify(data)}`
        )
        return
    }

    try {
        const response = await api.post('/api/logg', data)
        return response.status
    } catch (e) {
        throw new Error(`Det skjedde en feil: ${e}`)
    }
}

export const logger = {
    info: (stackLineNoColumnNo: IStackLineNoColumnNo) => {
        const data = { type: 'info', stackInfo: stackLineNoColumnNo, jsonContent: { ...defaultContext } }
        loggFunc(data).catch((err) => {
            console.error('Unable to log info message: ', data, ' err: ', err)
        })
    },
    error: (stackLineNoColumnNo: IStackLineNoColumnNo) => {
        const data = { type: 'error', stackInfo: stackLineNoColumnNo, jsonContent: { ...defaultContext } }
        loggFunc(data).catch((err) => {
            console.error('Unable to log error message: ', data, ' err: ', err)
        })
    },
    generalInfo: (info: object) => {
        const data = { type: 'info', data: info, jsonContent: { ...defaultContext } }
        loggFunc(data).catch((err) => {
            console.error('Unable to log info message: ', data, ' err: ', err)
        })
    },
    generalError: (info: object) => {
        const data = { type: 'error', data: info, jsonContent: { ...defaultContext } }
        loggFunc(data).catch((err) => {
            console.error('Unable to log error message: ', data, ' err: ', err)
        })
    },
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
