const express = require('express');
const common = require('../src/common');
const ResponseData = require('../modals/response');
const router = new express.Router();

router.get('/getallcomplaints', function (req, res) {
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 30;
    const skip = req.query.skip ? parseInt(req.query.skip, 10) : 0;
    let responseData = new ResponseData();
    responseData.setData(common.getComplaintSlice(limit, skip));
    res.send(responseData);
});

router.get('/getcomplaints/:ccode', function (req, res) {
    let responseData = new ResponseData();
    responseData.setData(common.filterComplaints(
        req.params.ccode,
        req.query.models,
        req.query.from,
        req.query.to
    ));
    res.send(responseData);
});


module.exports = router;