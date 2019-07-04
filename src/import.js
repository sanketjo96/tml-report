const csv = require('csvtojson');
const fs = require('fs');
const path = require('path');
const complaints = require('../src/db/schema/complaint');
const dropCollectionIfExists = require('../src/db/mongo').dropCollectionIfExists;
const MOCKFILE = path.join(__dirname, process.env.DATAFILEPATH);

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
    let saveCount = 0;
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
    } catch(err) {
        console.log('error is dropping collection')
    }

    return new Promise((resolve, reject) => {
        var inputStream = fs.createReadStream(path, 'utf8');
        csv({
            flatKeys: true,
            noheader: true,
            headers: cols
        }).fromStream(inputStream).subscribe((json) => {
            if (parseInt(json['No_of_Complaints'], 10) > 0) {
                var complaint = new complaints({
                    Dealer_Code: json.Dealer_Code,
                    Dealer_Code_Description: json.Dealer_Code_Description,
                    Dealer_City: json.Dealer_City,
                    PCR_Number: json.PCR_Number,
                    PCR_Year: json.PCR_Year,
                    VC_Number: json.VC_Number,
                    VC_Description: json.VC_Description,
                    Model: json.Model,
                    Sub_Model: json.Sub_Model,
                    Chassis_No: json.Chassis_No,
                    Chassis_Type: json.Chassis_Type,
                    Production_Month: json.Production_Month,
                    Kilometers_Covered: json.Kilometers_Covered,
                    Complaint_Aggregate: json.Complaint_Aggregate,
                    Complaint_Aggregate_Description: json.Complaint_Aggregate_Description,
                    Complaint_Group: json.Complaint_Group,
                    Complaint_Group_Description: json.Complaint_Group_Description,
                    Complaint_Code: json.Complaint_Code,
                    Complaint_Code_Description: json.Complaint_Code_Description,
                    Sale_Month: json.Sale_Month,
                    Complaint_Month: json.Complaint_Month,
                    Complaint_Reported_Date: json.Complaint_Reported_Date,
                    Diff_between_Complaint_Sales_Month: json.Diff_between_Complaint_Sales_Month,
                    Claim_Category: json.Claim_Category,
                    Claim_Category_Description: json.Claim_Category_Description,
                    Claims_Indicator: json.Claims_Indicator,
                    No_of_Complaints: json.No_of_Complaints,
                    Part_Number: json.Part_Number,
                    Part_Description: json.Part_Description,
                    Part_Quantity: json.Part_Quantity,
                    Part_Rate: json.Part_Rate,
                    Actual_Labour_Charge: json.Actual_Labour_Charge,
                    Miscellaneous_Charge: json.Miscellaneous_Charge,
                    Special_Labour_Charges: json.Special_Labour_Charges,
                    Total_Expenses: json.Total_Expenses,
                    Credit_Amount: json.Credit_Amount,
                    Customer_Complaint: json.Customer_Complaint,
                    Investigation: json.Investigation,
                    Action_Taken: json.Action_Taken,
                });
                complaint.save((err) => {
                    console.log(++saveCount);
                    if (err) {
                        console.log(err);
                    }
                });
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

exports.readReportFile = readReportFile;