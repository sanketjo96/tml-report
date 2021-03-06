const common = require('../../../common');
var _ = require('lodash');

const getallcomplaints = function(args) {
    if (common.dataSet && (args.skip || args.skip ===0) && args.limit) {
        return common.getComplaintSlice(args.limit, args.skip);
    } else {
        return 'error';
    }
}

const filtercomplaints = function(args) {
    return common.filterComplaints(args.ccode, args.models, args.from, args.to, args.mis)
}

module.exports = {
    complaints: getallcomplaints,
    filtercomplaints: filtercomplaints
};