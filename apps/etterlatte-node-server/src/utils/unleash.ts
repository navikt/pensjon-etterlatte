import config from '../config'
import { destroy, getFeatureToggleDefinitions, initialize } from 'unleash-client'
import GradualRolloutRandomStrategy from 'unleash-client/lib/strategy/gradual-rollout-random'
import GradualRolloutUserIdStrategy from 'unleash-client/lib/strategy/gradual-rollout-user-id'
import { logger } from '../monitoring/logger'

export const unleash =
    config.featureToggle.host !== ''
        ? initialize({
              url: config.featureToggle.host + '/api',
              customHeaders: {
                  Authorization: config.featureToggle.token,
              },
              appName: config.featureToggle.applicationName,

              strategies: [new GradualRolloutRandomStrategy(), new GradualRolloutUserIdStrategy()],
          })
        : null

unleash?.on('synchronized', () => {
    logger.info(`Unleash synchronized`)

    const definitions = getFeatureToggleDefinitions()

    definitions?.map((definition) => {
        if (definition.name.includes('etterlatte')) {
            logger.info(`Toggle ${definition.name} is enabled: ${definition.enabled}`)
            logger.info('Strategies:')

            definition.strategies?.map((strategi) => {
                logger.info(strategi.name, { ...strategi.parameters })
            })
        }
    })
})

unleash?.on('error', (err: Error) => {
    logger.error({
        message: err.message || 'Feil oppsto i unleash: ',
        stack_trace: err.stack,
    })
})

unleash?.on('warn', (msg: string) => {
    logger.error(msg)
})

process.on('SIGTERM', () => {
    logger.info('App is shutting down – destroying unleash client')
    destroy()
})
