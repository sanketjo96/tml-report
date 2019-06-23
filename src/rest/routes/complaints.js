const express = require('express');
const common = require('../../common');
const ResponseData = require('../../modals/response');
const router = new express.Router();

router.get('/getallcomplaints', async function (req, res) {
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 30;
    const skip = req.query.skip ? parseInt(req.query.skip, 10) : 0;
    let responseData = new ResponseData();
    const data = await common.getComplaintSlice(limit, skip)
    responseData.setData(data);
    res.send(responseData);
});

router.get('/getcomplaints/:ccode', async function (req, res) {
    let responseData = new ResponseData();
    const data = await common.filterComplaints(
        req.params.ccode,
        req.query.models,
        req.query.from,
        req.query.to
    );
    responseData.setData(data);
    res.send(responseData);
});


module.exports = router;