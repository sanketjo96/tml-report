const request = require('supertest');
const app = require('../src/app');

test('Connection for upload the file', async () => {
    const response = await request(app).get('/addfile').expect(200);
    expect(response.body.message).toEqual('Data has been fed succesfuly!!')
});