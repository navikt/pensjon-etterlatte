import { Request, RequestHandler, Response } from 'express'
import { injectDecoratorServerSide, Props } from '@navikt/nav-dekoratoren-moduler/ssr'
import config from './config'

const { isProdCluster } = config.env

const env = isProdCluster ? 'prod' : 'dev'

const props: Props = {
    env,
    urlLookupTable: false,
    context: 'privatperson',
    simple: true,
}

export default function decorator(filePath: string): RequestHandler {
    return async (req: Request, res: Response) => {
        await injectDecoratorServerSide({ ...props, filePath })
            .then((html: any) => {
                res.send(html)
            })
            .catch((e: any) => {
                console.error(e)
                res.status(500).send(e)
            })
    }
}
