import { RequestHandler, Request, Response } from 'express'
import { createClient } from '@sanity/client'
import config from './config'
import { logger } from './monitoring/logger'

const sanityClient = createClient({
    projectId: config.sanity.projectId,
    dataset: config.sanity.dataset,
    token: config.sanity.token,
    useCdn: true,
    apiVersion: '2024-06-27',
})

export default function sanityProxy(): RequestHandler {
    return async (req: Request, res: Response) => {
        try {
            // TODO legge inn håndtering for fine grained sanity spørringer i URL params
            const response = await sanityClient.fetch(`*[_type == "veiledningstekst"]`)
            // TODO se på om vi kan få mer fine grained response fra sanity API'et
            return res.status(200).send(JSON.stringify(response))
        } catch (error) {
            logger.error('Feilet i kall mot sanity', error)

            return res.status(500).send('Error')
        }
    }
}
