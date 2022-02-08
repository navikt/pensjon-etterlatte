import { injectDecoratorServerSide } from '@navikt/nav-dekoratoren-moduler/ssr'
import config from './config'

const { isProdCluster } = config.env

const env = isProdCluster ? 'prod' : 'dev'

const props: any = {
    env,
    urlLookupTable: false,
    context: 'privatperson',
    simple: true,
}

const inject = (res: any, filePath: string) => {
    injectDecoratorServerSide({ ...props, filePath })
        .then((html: any) => {
            res.send(html)
        })
        .catch((e: any) => {
            console.error(e)
            res.status(500).send(e)
        })
}

const setup = (app: any, filePath: string) => {
    // Match everything except internal and static
    app.use(/^(?!.*\/(internal|static)\/).*$/, (req: any, res: any) => {
        inject(res, filePath)
    })
}

export default {
    setup,
}
