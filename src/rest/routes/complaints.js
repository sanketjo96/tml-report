const express = require('express');
const common = require('../../common');
const ResponseData = require('../../modals/response');
const router = new express.Router();
const auth = require('../../middleware/auth');

router.get('/getallcomplaints', auth, async function (req, res) {
    let responseData = new ResponseData();
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 30;
    const skip = req.query.skip ? parseInt(req.query.skip, 10) : 0;
    const data = await common.getComplaintSlice(limit, skip)
    responseData.setData(data);
    res.send(responseData);
});

router.get('/getcomplaints/:ccode', auth, async function (req, res) {
    let responseData = new ResponseData();
    const data = await common.filterComplaints(
        req.params.ccode,
        req.query.models,
        req.query.from,
        req.query.to,
        req.query.mis
    );
    responseData.setData(data);
    res.send(responseData);
});


module.exports = router;