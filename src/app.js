const express = require('express');
require('./db/mongo');
const cors = require('cors');
const express_graphql = require('express-graphql');

const app = express();
const addfile = require('./rest/routes/fileupload');
const complaints = require('./rest/routes/complaints');
const qsearch = require('./rest/routes/qsearch');
const defaultroute = require('./rest/routes/default');
const login = require('./rest/routes/user')
const schema = require('./graphql/routes/complaints/schema');
const complaintresolver = require('./graphql/routes/complaints/resolver');
var bodyParser = require('body-parser')

app.use(cors())
app.use(bodyParser.json())

app.use(login);
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