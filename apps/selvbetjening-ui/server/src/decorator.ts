import config from './config';
import { injectDecoratorServerSide } from '@navikt/nav-dekoratoren-moduler/ssr';

// TODO: Ta i bruk <EnforceLoginLoader />
// https://github.com/navikt/nav-dekoratoren-moduler#-enforceloginloader--

const { isLabsCluster, isProdCluster } = config.env;

const env = isProdCluster ? "prod" : "dev";

const authProps = {
    enforceLogin: !isLabsCluster,
    redirectToApp: true,
    level: "Level4",
    logoutUrl: `${config.app.basePath}/logout`
};

const props: any = {
    ...authProps,
    env,
    urlLookupTable: false,
    context: "privatperson",
    simple: true
};

const inject = (res: any, filePath: string) => {
    injectDecoratorServerSide({...props, filePath})
            .then((html: any) => {
                res.send(html);
            })
            .catch((e: any) => {
                console.error(e);
                res.status(500).send(e);
            });
};

const setup = (app: any, filePath: string) => {
    // Match everything except internal and static
    // Ikke bruke dekoratøren i labs-gcp
    app.use(/^(?!.*\/(internal|static)\/).*$/, (req: any, res: any) => {
        if (isLabsCluster) res.sendFile(filePath);
        else inject(res, filePath);
    });
};

export default {
    setup
};
