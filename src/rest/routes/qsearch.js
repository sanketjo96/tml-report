const express = require('express');
const common = require('../../common');
const ResponseData = require('../../modals/response');
var _ = require('lodash');
const router = new express.Router();

const searchmap = {
    cdesc: 'Complaint_Code_Description',
    ccode: 'Complaint_Code'
};
const searchOn = Object.keys(searchmap);

router.get('/getModels', function (req, res) {
    const result = _.map(_.uniqBy(common.dataSet, 'Model'), (data) => {
        return data['Model'];
    });
    let responseData = new ResponseData();
    responseData.setData(result.sort());
    res.send(responseData);

});

router.get('/qsearch', function (req, res) {
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
            const results = _.unionBy(common.dataSet.reduce((acc, data) => {
                const value = data[q].toLowerCase();
                if (value.indexOf(qval.toLowerCase()) > -1) {
                    acc.push({
                       ccode: data[searchmap['ccode']],
                       cdesc: data[searchmap['cdesc']]
                    });
                }
                return acc;
            }, []), 'ccode');
            responseData.setData(results);
        } else {
            responseData.addErrors('Unknown Search criteria');
        }

    } else {
        responseData.addErrors('Search criteria is required');
    }
    res.send(responseData);
});


module.exports = router;