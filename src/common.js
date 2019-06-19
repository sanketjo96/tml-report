const csv=require('csvtojson')
const fs = require('fs');
const path = require('path');
const dataSet = [];
const MOCKFILE = path.join(__dirname, `../test/mock/data/data.csv`);

const readReportFile = (filePath) => {
    const path = filePath ? filePath : MOCKFILE;
    return new Promise((resolve, reject) => {
        var inputStream = fs.createReadStream(path, 'utf8');
        csv({
            flatKeys: true
        }).fromStream(inputStream).subscribe((json)=>{
            if (parseInt(json['No. of Complaints'], 10) > 0) {  
                dataSet.push(json);
            }
        }, 
        (err)=> {
            reject(err);
        },
        ()=>{
            resolve('Data has been fed succesfuly!!');
        });
    });
};

exports.readReportFile = readReportFile;
exports.dataSet = dataSet;