const express = require('express');

const app = express();
const addfile = require('../routes/fileupload');
const complaints = require('../routes/complaints');
const qsearch = require('../routes/qsearch');
const defaultroute = require('../routes/default');

app.use(addfile);
app.use(qsearch);
app.use(complaints);
app.use(defaultroute);

module.exports = app;