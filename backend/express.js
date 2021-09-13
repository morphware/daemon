'use strict';

const bodyParser = require('body-parser');
const express    = require('express');
const conf       = require('./conf');

const app  = express();

// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api/V0/', require('./routes/api_v0'));

app.listen(conf.httpPort, () => {
    console.log(`Server running at http://localhost:${conf.httpPort}`);
});

// Catch 404 and forward to error handler. If none of the above routes are
// used, this is what will be called.
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.message = 'Page not found'
  err.status = 404;
  next(err);
});

// Error handler. This is where `next()` will go on error
app.use(function(err, req, res, next) {
  console.error(err.status || res.status, err.name, req.method, req.url);
  if(![401, 404].includes(err.status || res.status)){
    console.error(err.message || err);
    console.error(err.stack);
    console.error('=========================================');
  }

  res.status(err.status || 500);
  res.json({error: err});
});

module.exports = app;
