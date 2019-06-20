const express = require('express');
const readReportFile = require('../src/common').readReportFile;
const dataSet = require('../src/common').dataSet;
const ResponseData = require('../modals/response');
const router = new express.Router();

router.get('/checkfile', async (req, res) => {
    let responseData = new ResponseData();
    const records = dataSet.length;
    let message = 'File upload is required';
    if (records) {
        message = `File exists with ${records} records`;
    }
    responseData.setData([], message);
    res.send(responseData);
});


router.get('/addfile', async (req, res) => {
    let responseData = new ResponseData();
    try {
        const message = await readReportFile();
        responseData.setData([], message);
    } catch(e) {
        responseData.setData(e);
    }

    res.send(responseData);
});

module.exports = router;