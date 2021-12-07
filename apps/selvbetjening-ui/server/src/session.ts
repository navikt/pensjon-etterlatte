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

const setupSession = (): RequestHandler => {
    if (isProduction && !isLabsCluster) {
        options.cookie!!.secure = true;
        options.store = setupRedis();
    }
    return session(options);
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

const appSession: RequestHandler = setupSession();

export default appSession;
