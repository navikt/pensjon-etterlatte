import session, { SessionOptions } from 'express-session'
import { createClient, RedisClient } from 'redis';
import connectRedis, { RedisStore } from 'connect-redis';
import config from './config';
import logger from './log/logger';
import { RequestHandler } from "express";

const { isLabsCluster, isProduction } = config.env;

const options: SessionOptions = {
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

const setupRedis = (): RedisStore => {
    const Store = connectRedis(session);
    const client: RedisClient = createClient({
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

    return new Store({
        client: client,
        disableTouch: true,
    });
};

const setupSession = (): RequestHandler => {
    if (isProduction && !isLabsCluster) {
        options.cookie!!.secure = true;
        options.store = setupRedis();
    }
    return session(options);
};

export const appSession = setupSession();

export const destroySessionBySid = (sid: any) => {
    logger.info(`Destroying session by SID: ${sid}`)

    return new Promise((resolve: any, reject: any) => {
        if (!options.store || !options.store.all) {
            return resolve();
        }

        options.store.all((err: any, result: any) => {
            if (err) {
                logger.error("Error during session destruction", err)
                return reject(err)
            }

            logger.info(`Found ${result.length} sessions`);

            const sessionToDestroy = result.find((session: any) => {
                return session.id && session.id === sid
            });

            logger.info("Session to destroy: ", sessionToDestroy)
            if (sessionToDestroy) {
                options.store?.destroy(sessionToDestroy.id)
                logger.info("Successfully destroyed session")
            }
            return resolve();
        });
    });
};
