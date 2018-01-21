require('dotenv').load();
const express = require('express');
const path = require('path');
const fs = require('fs');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const routesApiV1 = require('./src/v1/routes/index');
const device = require('express-device');
const mcache = require('memory-cache');
const config = require('config');
// const favicon = require('serve-favicon');

const app = express();

// In memory cache to cache response for a given duration
const cache = duration => (req, res, next) => {
  const key = `__express__${req.originalUrl}` || req.url;
  const cachedBody = mcache.get(key);
  if (cachedBody) {
    res.send(JSON.parse(cachedBody));
    return;
  }
  res.sendResponse = res.send;
  res.send = (body) => {
    mcache.put(key, body, duration * 1000);
    res.sendResponse(body);
  };
  next();
};

// capture the device of the incoming request
app.use(device.capture());

const logStream = fs.createWriteStream(path.join(__dirname, 'app.log'), { flags: 'a' });
app.use(logger('combined', { stream: logStream }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Response is cached for the duration in CacheExpirationTime(given in seconds)
app.use('/api/v1/', cache(config.get('cacheExpirationTime')), routesApiV1);

// API docs
app.get('/api/docs', (req, res) => {
  res.sendFile(path.join(`${__dirname}/api.html`));
});

module.exports = app;
