const express = require('express');
var cors = require('cors');
var express_graphql = require('express-graphql');

const app = express();
const addfile = require('../routes/fileupload');
const complaints = require('../routes/complaints');
const qsearch = require('../routes/qsearch');
const defaultroute = require('../routes/default');

const schema = require('../graphql/routes/complaints/schema');
const complaintresolver = require('../graphql/routes/complaints/resolver');

app.use(cors())

app.use(addfile);
app.use(qsearch);
app.use(complaints);

app.use('/gcomplaints', express_graphql({
    schema: schema,
    rootValue: complaintresolver,
    graphiql: true
}));

app.use(defaultroute);

module.exports = app;