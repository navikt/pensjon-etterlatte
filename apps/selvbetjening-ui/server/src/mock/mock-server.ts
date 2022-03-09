import express from 'express';
import { mockApi } from './mock-api';

const app = express();

mockApi(app);

const port = process.env.PORT || 8080;
const server = app.listen(port, () => {
    console.log(`App listening on port: ${port}`);
});

module.exports = server;
