const mongoose = require('mongoose');

const url = process.env.DATABASE;
mongoose.connect(url, {
    useNewUrlParser: true,
    useCreateIndex: true
});

const dropCollectionIfExists = (collectionName) => {
    return new Promise((resolve, reject) => {
        mongoose.models[collectionName].deleteMany({}, function (err) {
            if (err) {
                reject('error in deleting collection');
            } else {
                console.log(`${collectionName} collection removed`);
                resolve();
            }
        });
    });
};

exports.dropCollectionIfExists = dropCollectionIfExists;