/* eslint no-console: "off" */
const mongoose = require('mongoose');
mongoose.Promise = Promise;

module.exports = function(dbUri) {

    const promise = mongoose.connect(dbUri, { useMongoClient: true });

    mongoose.connection.on('connected', function () {
        console.log('Mongoose Default Connection Open to ' + dbUri);
    });

    mongoose.connection.on('error', function (err) {
        console.log('Mongoose Default Connection Error: ' + err);
    });

    mongoose.connection.on('Disconnected', function () {
        console.log('Mongoose Default Connection Disconnected');
    });

    process.on('SIGINT', function() {
        mongoose.connection.close(function () {
            console.log('Mongoose Default Connection Disconnected Through App Termination');
            process.exit(0);
        });
    });

    return promise;
};