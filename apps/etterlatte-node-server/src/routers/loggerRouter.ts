import express from 'express'
import sourceMap, { NullableMappedPosition } from 'source-map'
import * as fs from 'fs'
import { sanitize, sanitizeUrl } from '../utils/sanitize'
import {frontendLogger, logger as logger} from "../monitoring/logger";
/* eslint @typescript-eslint/no-explicit-any: 0 */ // --> OFF

export const loggerRouter = express.Router()

export interface IStackLineNoColumnNo {
    lineno: number
    columnno: number
    message: any
    error: any
}

function isStackInfoValid(numbers: IStackLineNoColumnNo): boolean {
    return numbers.lineno > 0 && numbers.columnno >= 0
}

const sourcemapLocation = '/app/build/assets'

async function sourceMapMapper(numbers: IStackLineNoColumnNo): Promise<NullableMappedPosition> {
    const sourcemapFile = fs.readdirSync(sourcemapLocation).find((file) => file.includes('.map')) ?? ''
    const rawSourceMap = fs.readFileSync(`${sourcemapLocation}/${sourcemapFile}`).toString()
    const smc = await new sourceMap.SourceMapConsumer(rawSourceMap)
    return Promise.resolve(smc.originalPositionFor({ line: numbers.lineno, column: numbers.columnno }))
}

loggerRouter.post('/', express.json(), (req, res) => {
    const logEvent = req.body as LogEvent
    const errorData = logEvent.data
    console.log('logEvent: ', logEvent)

    if (logEvent.type && logEvent.type === 'info') {
        frontendLogger.info('Frontendlogging: ', JSON.stringify(logEvent))
    } else {
        if(logEvent.stackInfo) {
            console.log('isStackInfoValid(logEvent.stackInfo): ', isStackInfoValid(logEvent.stackInfo))
        }
        if (logEvent.stackInfo && isStackInfoValid(logEvent.stackInfo)) {
            sourceMapMapper(logEvent.stackInfo!)
                    .then((position) => {
                        const message = logEvent.stackInfo?.message
                        const stackInfoError = JSON.stringify(logEvent.stackInfo?.error)
                        const component = `'${position.source}' (line: ${position.line}, col: ${position.column})`

                        frontendLogger.error({
                            message: message || 'Feil ved request',
                            stack_trace: `Error occurred in ${component}:\n${message}\n${stackInfoError}`,
                            ...mapCommonFields(logEvent.jsonContent, errorData),
                        })
                    })
                    .catch((err) => {
                        logger.error(err)

                        frontendLogger.error({
                            message: logEvent.stackInfo?.message || errorData?.msg || 'Ukjent feil oppsto (sourceMapMapper)',
                            stack_trace: errorData?.errorInfo ? JSON.stringify(errorData?.errorInfo) : JSON.stringify(logEvent),
                            ...mapCommonFields(logEvent.jsonContent, errorData),
                        })
                    })
        } else {
            frontendLogger.error({
                message: errorData?.msg || 'Ukjent feil oppsto',
                stack_trace: errorData?.errorInfo ? JSON.stringify(errorData?.errorInfo) : JSON.stringify(logEvent),
                ...mapCommonFields(logEvent.jsonContent, errorData),
            })
        }
    }
    return res.sendStatus(200)
})

const mapCommonFields = (jsonContent?: JsonContent, errorData?: ErrorData) => {
    return {
        request_uri: sanitizeUrl(jsonContent?.url),
        outbound_uri: errorData?.errorInfo?.url,
        method: errorData?.errorInfo?.method,
        user_device: stringifyUserDevice(jsonContent?.userDeviceInfo),
        user_agent: jsonContent?.userAgent,
    }
}

const stringifyUserDevice = (device?: UserDeviceInfo): string | undefined => {
    if (!device) return undefined
    else {
        try {
            const browser = `${device.browser.name} ${device.browser.version}`
            const os = `${device.os.name} ${device.os.version} (${device.os.versionName})`

            return `${browser} - ${os}`
        } catch (e) {
            logger.error(`Kunne ikke formatere userDeviceInfo til lesbar string: \n${sanitize(JSON.stringify(device))}`)
            return undefined
        }
    }
}

interface LogEvent {
    type: string
    data?: ErrorData
    stackInfo?: IStackLineNoColumnNo
    jsonContent?: JsonContent
}

interface ErrorData {
    msg: string
    errorInfo?: ErrorInfo
}

interface ErrorInfo {
    url: string
    method: string
    error?: JsonError
}

interface JsonError {
    status: number
    detail: string
    code?: string
    meta?: Record<string, unknown>
}

interface JsonContent {
    url: string
    userAgent: string
    userDeviceInfo?: UserDeviceInfo
}

interface UserDeviceInfo {
    browser: {
        name: string
        version: string
    }
    os: {
        name: string
        version: string
        versionName: string
    }
}
