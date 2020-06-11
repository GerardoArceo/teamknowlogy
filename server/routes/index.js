const express = require('express');

const app = express();

app.use(require('./mutation').app);
app.use(require('./stats').app);

module.exports = app;