import Bowser from 'bowser'
import Parser = Bowser.Parser.Parser
import { apiURL, poster } from './api.ts'

const browser = Bowser.getParser(window.navigator.userAgent)

interface LoggMelding {
    type: 'info' | 'error'
    stackInfo: StackInfo
    jsonContent: UserDeviceInfo
}

interface StackInfo {
    readonly lineno: number
    readonly columno: number
    readonly message: string
    readonly error: string
}

interface UserDeviceInfo {
    url: string
    userAgent: string
    userDeviceInfo: Parser
}

const defaultLoggingContext = {
    url: window.location.href,
    userAgent: window.navigator.userAgent,
    userDeviceInfo: browser.parse(),
}

const loggMelding = async (data: LoggMelding) => {
    if (import.meta.env.DEV) {
        console.log(
            `Logging til pod er deaktivert for lokal kjøring, returnerer uten å logge dit. Meldinga var: ${JSON.stringify(data)}`
        )
        return
    }

    try {
        await poster(`${apiURL}/api/logg`, { body: data })
    } catch (e) {
        throw new Error(`Det skjedde en feil: ${e}`)
    }
}

export const logger = {
    info: (stackInfo: StackInfo) => {
        const data: LoggMelding = {
            type: 'info',
            stackInfo,
            jsonContent: { ...defaultLoggingContext },
        }
        loggMelding(data).catch((err) => {
            console.error(`Kunne ikke logge info melding: ${data}, error: ${err}`)
        })
    },
    error: (stackInfo: StackInfo) => {
        const data: LoggMelding = {
            type: 'error',
            stackInfo,
            jsonContent: { ...defaultLoggingContext },
        }
        loggMelding(data).catch((err) => {
            console.error(`Kunne ikke logge error melding: ${data}, error: ${err}`)
        })
    },
    generalInfo: (info: object) => {
        const data = { type: 'info', stackInfo: info, jsonContent: { ...defaultLoggingContext } }
        loggMelding(data as LoggMelding).catch((err) => {
            console.error(`Kunne ikke logge info melding: ${data}, error: ${err}`)
        })
    },
    generalError: (info: object) => {
        const data = { type: 'error', stackInfo: info, jsonContent: { ...defaultLoggingContext } }
        loggMelding(data as LoggMelding).catch((err) => {
            console.error(`Kunne ikke logge error melding: ${data}, error: ${err}`)
        })
    },
}
