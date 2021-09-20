const session = require("express-session");
const redis = require("redis");
const config = require("./config");
const RedisStore = require("connect-redis");

const { isLabs, isProduction } = config.env;

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

const setupSession = () => {
    if (isProduction && !isLabs) {
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

    client.on("error", (err) => {
        console.error("Unable to establish connection with Redis: ", err);
    });

    client.on("connect", () => {
        console.log("Successfully connected to Redis!");
    });

    return new store({
        client: client,
        disableTouch: true,
    });

};

const appSession = setupSession();

appSession.destroySessionBySid = (sid) => {
    console.log(`Destroying session by SID: ${sid}`)

    return new Promise((resolve, reject) => {
        options.store.all((err, result) => {
            if (err) {
                console.error("Error during session destruction", err)
                return reject(err)
            }

            console.log(`Found ${result.length} sessions`);

            const sessionToDestroy = result.find((session) => {
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

module.exports = {
    appSession,
};
