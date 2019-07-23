const express = require('express');
const ResponseData = require('../../modals/response');
const complaints = require('../../db/schema/complaint');
var _ = require('lodash');
const router = new express.Router();
const auth = require('../../middleware/auth');

const searchmap = {
    cdesc: 'Complaint_Group_Description',
    ccode: 'Complaint_Group'
};
const searchOn = Object.keys(searchmap);

router.get('/getModels', auth, async function (req, res) {
    const query = complaints.find({}).select('Model -_id').distinct('Model');
    const result = await query.exec();
    let responseData = new ResponseData();
    responseData.setData(result.sort());
    res.send(responseData);
});

router.get('/qsearch', auth, async function (req, res) {
    let q;
    let qval;
    let responseData = new ResponseData();
    const searchParam = req.query;
    if (Object.keys(searchParam).length) {
        for (let i = 0; i < searchOn.length; i++) {
            if (searchParam[searchOn[i]]) {
                q = searchmap[searchOn[i]];
                qval = searchParam[searchOn[i]];
                break;
            }
        }

        if (q && qval) {
            let selector = {};
            if (process.env.TESTENV) {
                selector['_id'] = 0;
            }
            const pattern = new RegExp(qval, "gi");
            const obj = {[q]: pattern};
            const query = complaints
                .find(obj, selector)
                .select('Complaint_Group Complaint_Group_Description');
            const results = await query.exec();
            responseData.setData(_.uniqBy(results, 'Complaint_Group'));
        } else {
            responseData.addErrors('Unknown Search criteria');
        }

    } else {
        responseData.addErrors('Search criteria is required');
    }
    res.send(responseData);
});


module.exports = router;