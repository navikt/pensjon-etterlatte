const proxy = require("express-http-proxy");

module.exports = function (app) {
    app.use("/api", proxy("http://localhost:8085"));
};
