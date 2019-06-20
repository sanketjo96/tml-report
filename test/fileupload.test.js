const request = require('supertest');
const app = require('../src/app');

test('file is not present initially', async () => {
    const response = await request(app).get('/checkfile').expect(200);
    expect(response.body.message).toEqual('File upload is required')
});

test('Connection for upload the file', async () => {
    const response = await request(app).get('/addfile').expect(200);
    expect(response.body.message).toEqual('Data has been fed succesfuly!!')
});
