const express = require('express');
const { readReportFile } = require('../../import');
const ResponseData = require('../../modals/response');
const router = new express.Router();


router.get('/addfile', async (req, res) => {

    let responseData = new ResponseData();
        /*
    try {
        const message = await readReportFile();
        responseData.setData([], message);
    } catch(e) {
        responseData.setData(e);
    }
*/

    responseData.message = 'Out of order. contact sanket joshi'
    res.send(responseData);
});

module.exports = router;