import session from 'express-session';
import { createClient } from 'redis';
import config from './config';
import logger from './log/logger';
import RedisStore from 'connect-redis';


const { isLabsCluster, isProduction } = config.env;

const options: any = {
    cookie: {
        maxAge: config.session.maxAgeMs,
        sameSite: "lax",
        httpOnly: true,
    },
    secret: config.session.secret,
    name: "selvbetjening-ui",
    resave: false,
    saveUninitialized: false,
    unset: "destroy",
};

const setupSession = () => {
    if (isProduction && !isLabsCluster) {
        options.cookie.secure = true;
        options.store = setupRedis();
    }
    return session(options);
};

const setupRedis = async () => {
    const store = RedisStore(session);
    const client = createClient({
        host: config.session.redisHost,
        password: config.session.redisPassword,
        port: Number(config.session.redisPort),
    });
    client.unref();

    client.on("error", (err: any) => {
        logger.error("Unable to establish connection with Redis: ", err);
    });

    client.on("connect", () => {
        logger.info("Successfully connected to Redis!");
    });

    return new store({
        client: client,
        disableTouch: true,
    });
};

const appSession: any = setupSession();

appSession.destroySessionBySid = (sid: any) => {
    console.log(`Destroying session by SID: ${sid}`)

    return new Promise((resolve: any, reject: any) => {
        options.store.all((err: any, result: any) => {
            if (err) {
                console.error("Error during session destruction", err)
                return reject(err)
            }

            console.log(`Found ${result.length} sessions`);

            const sessionToDestroy = result.find((session: any) => {
                return session.id && session.id === sid
            });

            console.log("Session to destroy: ", sessionToDestroy)
            if (sessionToDestroy) {
                options.store.destroy(sessionToDestroy.id)
                console.log("Successfully destroyed session")
            }
            return resolve()
        })
    })
}

export default appSession;
