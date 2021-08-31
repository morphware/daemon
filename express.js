'use strict';

const bodyParser = require('body-parser');
const express    = require('express');
const conf       = require('./conf');

const app  = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api/V0/', require('./routes/api_v0'));

app.listen(conf.httpPort, () => {
    console.log(`Server running at http://localhost:${conf.httpPort}`);
});

module.exports = app;
