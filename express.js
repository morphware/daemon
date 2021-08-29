#!/usr/bin/env node
const bodyParser = require('body-parser');
const express    = require('express');

const app  = express();
const port = 3000;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use('/apiV0/', './router/api_v0');

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
