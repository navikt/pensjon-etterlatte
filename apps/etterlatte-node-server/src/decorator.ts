import { type DecoratorFetchProps, injectDecoratorServerSide } from '@navikt/nav-dekoratoren-moduler/ssr'
import type { Request, RequestHandler, Response } from 'express'
import config from './config'
import { logger } from './monitoring/logger'

const { isProdCluster } = config.env

const env = isProdCluster ? 'prod' : 'dev'

const props: DecoratorFetchProps = {
    env,
    serviceDiscovery: true,
    params: {
        context: 'privatperson',
        simple: true,
        logoutWarning: true,
    },
}

export default function decorator(filePath: string): RequestHandler {
    return (req: Request, res: Response) => {
        injectDecoratorServerSide({ ...props, filePath })
            .then((html: any) => {
                res.send(html)
            })
            .catch((e: any) => {
                logger.error(e)
                res.status(500).send(e)
            })
    }
}
