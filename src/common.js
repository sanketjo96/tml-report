const complaints = require('../src/db/schema/complaint');

let selector = {};
if (process.env.TESTENV) {
    selector['_id'] = 0;
}

/**
 * Returns all compalints accordig to limit args
 * @param {*} limit - limit of records per page
 * @param {*} skip - skip these many records while returning
 */
const getComplaintSlice = (limit = 30, skip = 0) => {
    const query = complaints.find({}, selector, { limit, skip });
    return query.exec();
}

/**
 * Returns filtered complaints
 * @param {*} ccode - complaint code
 * @param {*} models - required models
 * @param {*} fromDate - start date from which we want list of compalints 
 * @param {*} toDate - end date till which we want list of compalints 
 */
const filterComplaints = (ccode, models, fromDate, toDate) => {
    const from = fromDate ? Date.parse(fromDate) : null;
    const to = toDate ? Date.parse(toDate) : null;
    const interestedModels = models ? models.split(',').map(String) : null;
    const query = complaints.find({ Complaint_Group: ccode }, selector);
    if (interestedModels && interestedModels.length) {
        query.find({
            Model: {
                "$in": interestedModels
            }
        });
    }

    if (from && to) {
        query.find({ 
            Complaint_Month: { 
                "$gte": from,
                "$lte": to 
            } 
        });
    }

    return query.exec();
};

exports.getComplaintSlice = getComplaintSlice;
exports.filterComplaints = filterComplaints;
