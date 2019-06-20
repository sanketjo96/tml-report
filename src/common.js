const csv = require('csvtojson')
const fs = require('fs');
const path = require('path');
var _ = require('lodash');
const dataSet = [];
const MOCKFILE = path.join(__dirname, `../test/mock/data/data.csv`);

/**
 * Reads the given line from file
 * @param {*} file - file path to read
 * @param {*} line_no - line num to read
 */
const readFileLine = function (file, line_no) {
    return new Promise((resolve, reject) => {
        var stream = fs.createReadStream(file, {
            flags: 'r',
            encoding: 'utf-8',
            fd: null,
            mode: '0666',
            bufferSize: 64 * 1024
        });

        var fileData = '';
        stream.on('data', function (data) {
            fileData += data;

            var lines = fileData.split('\n');

            if (lines.length >= +line_no) {
                stream.destroy();
                resolve(lines[+line_no]);
            }
            // Add this else condition to remove all unnecesary data from the variable
            else {
                fileData = Array(lines.length).join('\n');
            }
        });

        stream.on('error', function () {
            reject('error')
        });
    });
};

/**
 * Reads CSV file and convert it to JSON
 * @param {*} filePath - file path to read
 */
const readReportFile = async (filePath) => {
    const path = filePath ? filePath : MOCKFILE;
    const headerData = await readFileLine(MOCKFILE, 0);
    const cols = headerData.replace(/\s/g, "_")
        .replace("_&", "")
        .replace(".", "")
        .split(",")
        ;

    return new Promise((resolve, reject) => {
        var inputStream = fs.createReadStream(path, 'utf8');
        csv({
            flatKeys: true,
            noheader: true,
            headers: cols
        }).fromStream(inputStream).subscribe((json) => {
            if (parseInt(json['No_of_Complaints'], 10) > 0) {
                dataSet.push(json);
            }
        },
            (err) => {
                reject(err);
            },
            () => {
                resolve('Data has been fed succesfuly!!');
            });
    });
};

/**
 * Returns all compalints accordig to limit args
 * @param {*} limit - limit of records per page
 * @param {*} skip - skip these many records while returning
 */
const getComplaintSlice = (limit=30, skip=0) => {
   return _.slice(dataSet, skip, limit + skip)
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
    const interestedModels = models ? models.split(',') : null;

    return _.filter(dataSet, (data) => {
        const isMpdelFits = (interestedModels && interestedModels.length)
            ? interestedModels.indexOf(data['Model'])
            : null
        ;
        const currentDate = Date.parse(data['Complaint_Month'].replace(' ', '-'));
        const isDateFits = (from && to)
            ? (from <= currentDate && to >= currentDate)
            : true
        ;

        return (
            isDateFits
            && data['Complaint_Code'] === ccode
            && (isMpdelFits === null || isMpdelFits > -1)
        )
    });
};


exports.readReportFile = readReportFile;
exports.dataSet = dataSet;
exports.getComplaintSlice = getComplaintSlice;
exports.filterComplaints = filterComplaints;
