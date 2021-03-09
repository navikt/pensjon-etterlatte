const express = require("express");
const path = require("path");
const app = express();

app.use(express.static(path.join(__dirname, "build")));
// app.set('views', path.resolve(`${__dirname}/dist`));

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "build", "index.html"));
});
app.get("/is_alive", (req, res) => {
    res.sendStatus(200);
});

app.listen(9000);
