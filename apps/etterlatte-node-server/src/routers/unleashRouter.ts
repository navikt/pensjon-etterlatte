import express, { Request, Response } from 'express'
import { Context } from 'unleash-client'
import { logger } from '../monitoring/logger'
import { sanitize } from '../utils/sanitize'
import config from '../config'
import { unleash } from '../utils/unleash'

export const unleashRouter = express.Router()

export enum FeatureToggleStatus {
    PAA = 'PAA',
    AV = 'AV',
    UDEFINERT = 'UDEFINERT',
    HENTING_FEILET = 'HENTING_FEILET',
}

if (config.env.isSelvbetjeningUIApp) {
    unleashRouter.post('/', express.json(), (req: Request, res: Response) => {
        const featureTogglesNavn: string[] = req.body

        const statusPaaFeatureToggle = (name: string): FeatureToggleStatus => {
            const context: Context = {
                appName: config.featureToggle.applicationName,
                environment: process.env.NAIS_CLUSTER_NAME,
            }
            if (!unleash) {
                return FeatureToggleStatus.UDEFINERT
            }
            try {
                if (unleash.isEnabled(name, context)) {
                    return FeatureToggleStatus.PAA
                } else {
                    return FeatureToggleStatus.AV
                }
            } catch (e) {
                logger.error({
                    message: `Fikk feilmelding fra Unleash for toggle ${sanitize(name)}, bruker defaultverdi false`,
                    stack_trace: JSON.stringify(e),
                })
                return FeatureToggleStatus.HENTING_FEILET
            }
        }

        return res.json(
            featureTogglesNavn.map((toggle) => {
                const status = statusPaaFeatureToggle(toggle)

                logger.info(`${sanitize(toggle)} enabled: ${status}`)

                return {
                    name: toggle,
                    status,
                }
            })
        )
    })
}
