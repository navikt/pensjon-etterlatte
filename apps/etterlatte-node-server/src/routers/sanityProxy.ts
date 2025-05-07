import { RequestHandler, Request, Response } from 'express'
import { createClient } from '@sanity/client'
import config from '../config'
import { logger } from '../monitoring/logger'

export const sanityClient = createClient({
    projectId: config.sanity.projectId,
    dataset: config.sanity.dataset,
    token: config.sanity.token,
    useCdn: true,
    apiVersion: '2024-06-27',
})

export default function sanityProxy(): RequestHandler {
    return async (req: Request, res: Response) => {
        try {
            const sanityQuery = req.query.sanityQuery
            const response = await sanityClient.fetch(sanityQuery?.toString() || '')
            // TODO se på om vi kan få mer fine grained response fra sanity API'et
            res.status(200).send(JSON.stringify(response))
        } catch (error) {
            logger.error('Feilet i kall mot sanity', error)

            res.status(500).send('Error')
        }
    }
}
