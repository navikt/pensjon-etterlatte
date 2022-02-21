import { injectDecoratorServerSide, Props } from '@navikt/nav-dekoratoren-moduler/ssr';
import { RequestHandler, Request, Response } from "express";
import logger from "./monitoring/logger";
import config from './config';

const { isLabsCluster, isProdCluster } = config.env;

const env = isProdCluster ? "prod" : "dev";

const props: Props = {
    env,
    urlLookupTable: false,
    context: "privatperson",
    simple: true
};

export default function decorator(filePath: string): RequestHandler {
    return async (req: Request, res: Response) => {
        if (isLabsCluster) {
            res.sendFile(filePath)
        } else {
            await injectDecoratorServerSide({ ...props, filePath })
                .then((html: any) => {
                    res.send(html)
                })
                .catch((e: any) => {
                    logger.error(e)

                    res.status(500).send(e)
                });
        }
    }
};
