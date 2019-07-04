require('./db/mongo');

const { readReportFile } = require('./import');

async function DoImport() {
    try {
        const message = await readReportFile();
        console.log('done ' + message);
    } catch (e) {
        responseData.setData(e);
    }
}
DoImport();