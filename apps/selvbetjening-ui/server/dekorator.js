const jsdom = require("jsdom");
const request = require("request");
const NodeCache = require("node-cache");
const { JSDOM } = jsdom;

const HOUR_IN_SECONDS = 3600;
const MINUTE_IN_SECONDS = 60;

const cache = new NodeCache({
    stdTTL: HOUR_IN_SECONDS,
    checkperiod: MINUTE_IN_SECONDS,
});

const getDecorator = () =>
    new Promise((resolve, reject) => {
        const decorator = cache.get("main-cache");
        if (decorator) {
            resolve(decorator);
        } else {
            request(process.env.DECORATOR_URL, (error, response, body) => {
                if (!error && response.statusCode >= 200 && response.statusCode < 400) {
                    const { document } = new JSDOM(body).window;
                    const prop = "innerHTML";
                    const data = {
                        NAV_SKIPLINKS: document.getElementById("skiplinks")[prop],
                        NAV_SCRIPTS: document.getElementById("scripts")[prop],
                        NAV_STYLES: document.getElementById("styles")[prop],
                        NAV_HEADING: document.getElementById("header-withmenu")[prop],
                        NAV_FOOTER: document.getElementById("footer-withmenu")[prop],
                        MEGAMENU_RESOURCES: document.getElementById("megamenu-resources")[prop],
                    };
                    cache.set("main-cache", data);
                    resolve(data);
                } else {
                    reject(new Error(error));
                }
            });
        }
    });

module.exports = getDecorator;
