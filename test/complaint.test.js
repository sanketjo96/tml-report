const request = require('supertest');
const app = require('../src/app');
const readReportFile = require('../src/common').readReportFile;
const allcomplaints = require('./mock/getcomplaints.json');
const allcomplaintswithparams = require('./mock/getcomplaintparams.json');
const complaintpage = require('./mock/complaintpage.json')

beforeAll(async () => {
    return await readReportFile();
});

test('Connection for complaints', async () => {
    const response = await request(app).get('/getallcomplaints').expect(200);
    expect(response.body.items).toEqual(30);
    expect(JSON.stringify(response.body)).toEqual(JSON.stringify(allcomplaints));
});

test('ALl complaints with paging', async () => {
    const response = await request(app).get('/getallcomplaints?limit=10&skip=90').expect(200);
    expect(response.body.items).toEqual(10);
    expect(JSON.stringify(response.body)).toEqual(JSON.stringify(complaintpage));
});

test('To return complaint data for given models along with filters', async () => {
    const response = await request(app).get('/getcomplaints/CC25103?models=1109,407&from=JAN-2019&to=MAY-2019').expect(200);
    expect(JSON.stringify(response.body)).toEqual(JSON.stringify(allcomplaintswithparams));
});