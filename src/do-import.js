require('./db/mongo');
const { readReportFile } = require('./import');

async function DoImport() {
    try {
        const message = await readReportFile();
        console.log(message);
    } catch (e) {
        console.log(e);
    }
}
DoImport().then(() => console.log('\n\nFinished'));