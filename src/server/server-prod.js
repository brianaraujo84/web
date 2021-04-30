const express = require('express');
const compression = require('compression');
const helmet = require('helmet');
const initExpress = require('./express');

const app = express();
app.use(compression());
app.use(helmet());

initExpress(app);
