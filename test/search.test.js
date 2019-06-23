const request = require('supertest');
const app = require('../src/app');
const readReportFile = require('../src/import').readReportFile;
const descserachdata = require('./mock/descsearch.json');
const ccodeserachdata = require('./mock/ccodesearch.json');

beforeAll(async () => {
    return await readReportFile();
});

// Validating API connections
test('Connection for search API', async () => {
    const response = await request(app).get('/qsearch').expect(200);
    expect(response.body.error.shift()).toEqual("Search criteria is required");
});

test('Whether API works only with specified params', async () => {
    const response = await request(app).get('/qsearch??jkl=op').expect(200);
    expect(response.body.error.shift()).toEqual("Unknown Search criteria");
});


// Validating data for all complaints
test('To return search data for complaint code', async () => {
    const response = await request(app).get('/qsearch?cdesc=LEAF BROKEN').expect(200);
    expect(JSON.stringify(response.body)).toEqual(JSON.stringify(descserachdata));
});

test('To return search data for complaint code', async () => {
    const response = await request(app).get('/qsearch?ccode=FA32').expect(200);
    expect(JSON.stringify(response.body)).toEqual(JSON.stringify(ccodeserachdata));
});