const session = require("express-session");
const redis = require("redis");
const config = require("./config");
const RedisStore = require("connect-redis");

export const setupSession = () => {
    const options = {
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
    if (process.env.NODE_ENV !== "development") {
        options.cookie.secure = true;
        options.store = setupRedis();
    }
    return session(options);
};

const setupRedis = () => {
    const store = RedisStore(session);
    const client = redis.createClient({
        host: config.session.redisHost,
        password: config.session.redisPassword,
        port: config.session.redisPort,
    });
    client.unref();
    client.on("debug", console.log);

    return new store({
        client: client,
        disableTouch: true,
    });
};

module.exports = {
    setupSession,
};
