const mongoose = require('mongoose');
const { Schema } = mongoose;

const RequiredString = {
    type: String,
    required: true
};

const schema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    movieId: RequiredString,
    text: RequiredString,
    category: {
        type: String,
        enum: ['Cinematography', 'Editing', 'Design', 'Lighting', 'Sound'],
        required: true
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        required: true
    }
});

schema.static('exists', function (query) {
    return this.find(query)
        .count()
        .then(count => (count > 0));
});

module.exports = mongoose.model('Review', schema);