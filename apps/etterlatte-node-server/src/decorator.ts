import { injectDecoratorServerSide, DecoratorFetchProps } from '@navikt/nav-dekoratoren-moduler/ssr'
import { Request, RequestHandler, Response } from 'express'
import logger from './monitoring/logger'
import config from './config'

const { isProdCluster } = config.env

const env = isProdCluster ? 'prod' : 'dev'

const props: DecoratorFetchProps = {
    env,
    serviceDiscovery: true,
    params: {
        urlLookupTable: false,
        context: 'privatperson',
        simple: true,
    }
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
