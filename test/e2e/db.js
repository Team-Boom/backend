// require('dotenv').config({ path: './test/e2e/.env' });
const connect = require('../../lib/connect');
const mongoose = require('mongoose');
const request = require('./request');

before(() => connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/boommovies'));    
after(() => mongoose.connection.close());

module.exports = {
    dropCollection(name) {
        return mongoose.connection.dropCollection(name)
            .catch(err => {
                if(err.codeName !== 'NamespaceNotFound') throw err;
            });
    },
    createToken(data = { }) {
        return request
            .post('/auth/signup')
            .send(data)
            .then(res => res.body.token);
    }
};