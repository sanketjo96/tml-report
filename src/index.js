const app = require('./app');
const port = process.env.PORT || 3003;

app.listen(port, () => {
    console.log(`Report API is ready to serve at ${port}`);
});