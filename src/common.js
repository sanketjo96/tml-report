const complaints = require('../src/db/schema/complaint');
const misBuckets = [
    {
        min: 0,
        max: 3,
        label: 3
    },
    {
        min: 4,
        max: 12,
        label: 12
    },
    {
        min: 13,
        max: 24,
        label: 24
    }
]

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
const filterComplaints = (ccode, models, fromDate, toDate, mis) => {
    const misdata = mis ? parseInt(mis, 10) : null;
    const from = fromDate ? parseInt(fromDate, 10) : null;
    const to = toDate ? parseInt(toDate, 10) : null;
    const interestedModels = models ? models.split(',').map(String) : null;
    const query = complaints.find({ Complaint_Group: ccode }, selector);
    if (interestedModels && interestedModels.length) {
        query.find({
            Model: {
                "$in": interestedModels
            }
        });
    }

    if (misdata) {
        const selectedBucket = misBuckets.filter(item => item.label === misdata)[0];
        query.find({
            Diff_between_Complaint_Sales_Month: {
                "$gte": selectedBucket.min,
                "$lte": selectedBucket.max
            }
        });
    }

    if (from && to) {
        query.find({
            PCR_Year: {
                "$gte": from,
                "$lte": to
            }
        });
    }

    return query.exec();
};

exports.getComplaintSlice = getComplaintSlice;
exports.filterComplaints = filterComplaints;
