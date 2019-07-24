const fs = require('fs');
const path = require('path');
const csv = require('csv-stream')
const through2 = require('through2')
const complaints = require('../src/db/schema/complaint');
const dropCollectionIfExists = require('../src/db/mongo').dropCollectionIfExists;
const MOCKFILE = path.join(__dirname, process.env.DATAFILEPATH);
const CHUNK_SIZE = 1000;

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

    // Drop if complaint collection already present
    try {
        await dropCollectionIfExists('Complaint');
    } catch (err) {
        console.log('error is dropping collection')
    }

    return new Promise((resolve, reject) => {
        let skipFirstRow = true;
        let totalInsertion = 0;
        let complaintsDocs = [];
        fs.createReadStream(path)
            .pipe(
                csv.createStream({
                    endLine: '\n',
                    columns: cols,
                    escapeChar: '"',
                    enclosedChar: '"'
                }))
            .pipe(
                through2({ objectMode: true }, (row, enc, cb) => {
                    // - `row` holds the first row of the CSV,
                    //   as: `{ Year: '1997', Make: 'Ford', Model: 'E350' }`
                    // - The stream won't process the *next* item unless you call the callback
                    //  `cb` on it.
                    // - This allows us to save the row in our database/microservice and when
                    //   we're done, we call `cb()` to move on to the *next* row.
                    if (skipFirstRow) {
                        skipFirstRow = false;
                        cb();
                    } else if (parseInt(row['No_of_Complaints'], 10) > 0) {
                        complaintsDocs.push(row);
                        if (complaintsDocs.length === CHUNK_SIZE) {
                            complaints.create(complaintsDocs, function (err, documents) {
                                if (err) {
                                    throw err;
                                } else {
                                    totalInsertion += documents.length;
                                    console.log(`\nInserted ${documents.length} documents. Total: ${totalInsertion}`)
                                    complaintsDocs = [];
                                    cb();
                                }
                            });
                        } else {
                            cb();
                        }
                    } else {
                        cb();
                    }
                })
            ).on('data', () => console.log('dara'))
            .on('end', () => {
                if (complaintsDocs && complaintsDocs.length) {
                    complaints.create(complaintsDocs, function (err, documents) {
                        if (err) {
                            throw err;
                        } else {
                            totalInsertion += documents.length;
                            console.log(`\nInserted ${documents.length} documents. Total: ${totalInsertion}`)
                            complaintsDocs = [];
                            resolve('Data has been fed succesfuly!!');
                        }
                    });
                } else {
                    resolve('Data has been fed succesfuly!!');
                }
            }).on('error', err => {
                reject(err);
                console.error(err)
            })
    });
};

exports.readReportFile = readReportFile;