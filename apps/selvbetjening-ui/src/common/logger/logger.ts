import Bowser from 'bowser'
import { apiURL, poster } from '../api/api.ts'
import OSDetails = Bowser.Parser.OSDetails
import Details = Bowser.Parser.Details

const browser = Bowser.getParser(window.navigator.userAgent)

interface LoggMelding {
    type: 'info' | 'error'
    stackInfo: StackInfo
    jsonContent: JsonContent
}

interface StackInfo {
    readonly lineno: number
    readonly columnno: number
    readonly message: string
    readonly error: string
}

interface JsonContent {
    url: string
    userAgent: string
    userDeviceInfo: UserDeviceInfo
}

interface UserDeviceInfo {
    browser: Details
    os: OSDetails
}

const defaultLoggingContext = {
    url: window.location.href,
    userAgent: window.navigator.userAgent,
    userDeviceInfo: { browser: browser.parse().getBrowser(), os: browser.parse().getOS() },
}

const loggMelding = async (data: LoggMelding) => {
    if (import.meta.env.DEV) {
        console.log(
            `Logging til pod er deaktivert for lokal kjøring, returnerer uten å logge dit. Meldinga var: ${JSON.stringify(data)}`
        )
        return
    }

    try {
        await poster(`${apiURL}/logg`, { body: data })
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
