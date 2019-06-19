const express = require('express');
const common = require('../src/common');
const ResponseData = require('../modals/response');
var _ = require('lodash');
const router = new express.Router();

router.get('/getallcomplaints', function (req, res) {
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 30;
    const skip = req.query.skip ? parseInt(req.query.skip, 10) : 0;
    let responseData = new ResponseData();
    responseData.setData(_.slice(common.dataSet, skip, limit + skip));
    res.send(responseData);
});

router.get('/getcomplaints/:ccode', function (req, res) {
    const ccode = req.params.ccode;
    let responseData = new ResponseData();
    const from = req.query.from ? Date.parse(req.query.from) : null;
    const to = req.query.to ? Date.parse(req.query.to) : null;
    const interestedModels = req.query.models ? req.query.models.split(',') : null;

    const filteredset = _.filter(common.dataSet, (data) => {
        const isMpdelFits = (interestedModels && interestedModels.length)
            ? interestedModels.indexOf(data['Model'])
            : null
        ;
        const currentDate = Date.parse(data['Complaint Month'].replace(' ', '-'));
        const isDateFits = (from && to)
            ? (from <= currentDate && to >= currentDate)
            : true
        ;

        return (
            isDateFits
            && data['Complaint Code'] === ccode
            && (isMpdelFits === null || isMpdelFits > -1)
        )
    });

    responseData.setData(filteredset);
    res.send(responseData);
});


module.exports = router;