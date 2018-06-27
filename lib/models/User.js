const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcryptjs');

const RequiredString = {
    type: String,
    required: true
};

const schema = new Schema({
    name: RequiredString,
    email: RequiredString,
    hash: RequiredString,
    date: { type: Date, default: Date.now },
    watchlist: [String]
});

schema.static('exists', function (query) {
    return this.find(query)
        .count()
        .then(count => (count > 0));
});

schema.method('generateHash', function (password) {
    this.hash = bcrypt.hashSync(password, 8);
});

schema.method('comparePassword', function (password) {
    return bcrypt.compareSync(password, this.hash);
});

module.exports = mongoose.model('User', schema);