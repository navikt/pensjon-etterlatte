import express, { Request, Response } from 'express'
import { Context } from 'unleash-client'
import { logger } from '../monitoring/logger'
import { sanitize } from '../utils/sanitize'
import config from '../config'
import { unleash } from '../utils/unleash'

export const unleashRouter = express.Router()

export enum FeatureStatus {
    PAA = 'PAA',
    AV = 'AV',
    UDEFINERT = 'UDEFINERT',
    HENTING_FEILET = 'HENTING_FEILET',
}
if (config.env.isSelvbetjeningUIApp) {
    unleashRouter.post('/', express.json(), (req: Request, res: Response) => {
        const toggles: string[] = req.body.features

        const isEnabled = (toggle: string): string => {
            const context: Context = {
                appName: config.featureToggle.applicationName,
                environment: process.env.NAIS_CLUSTER_NAME,
            }
            if (!unleash) {
                return FeatureStatus.UDEFINERT
            }
            try {
                if (unleash.isEnabled(toggle, context)) {
                    return FeatureStatus.PAA
                } else {
                    return FeatureStatus.AV
                }
            } catch (e) {
                logger.error({
                    message: `Fikk feilmelding fra Unleash for toggle ${sanitize(toggle)}, bruker defaultverdi false`,
                    stack_trace: JSON.stringify(e),
                })
                return FeatureStatus.HENTING_FEILET
            }
        }

        return res.json(
            toggles.map((toggle) => {
                const enabled = isEnabled(toggle)

                logger.info(`${sanitize(toggle)} enabled: ${enabled}`)

                return {
                    toggle: toggle,
                    enabled: enabled,
                }
            })
        )
    })
}
