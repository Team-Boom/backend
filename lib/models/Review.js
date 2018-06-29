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
    },
    title: RequiredString,
    userName: RequiredString,
    poster: String,
    description: String
});

schema.static('exists', function (query) {
    return this.find(query)
        .count()
        .then(count => (count > 0));
});

schema.static('movieAvg', function (movieId) {
    return this.aggregate([
        { $match: { movieId: movieId } },
        { $group: { _id: '$category', avgRating: { $avg: '$rating' } } }
    ])
        .then(results => {
            let movie = {};
            results.map(category => {
                movie[category._id] = category.avgRating;
            });
            return movie;
        });
});

schema.static('top10', function () {
    return Promise.all([
        this.aggregate([
            { $match: { category: 'Cinematography' } },
            { $group: { _id: '$movieId', title: { $first: '$title' }, description: { $first: '$description'}, 
                poster: { $first: '$poster'}, avgRating: { $avg: '$rating' } } },
            { $sort: { avgRating: -1 } },
            { $limit : 10 }
        ]),
        this.aggregate([
            { $match: { category: 'Editing' } },
            { $group: { _id: '$movieId', title: { $first: '$title' }, description: { $first: '$description'}, 
                poster: { $first: '$poster'}, avgRating: { $avg: '$rating' } } },
            { $sort: { avgRating: -1 } },
            { $limit : 10 }
        ]),
        this.aggregate([
            { $match: { category: 'Design' } },
            { $group: { _id: '$movieId', title: { $first: '$title' }, description: { $first: '$description'}, 
                poster: { $first: '$poster'}, avgRating: { $avg: '$rating' } } },
            { $sort: { avgRating: -1 } },
            { $limit : 10 }
        ]),
        this.aggregate([
            { $match: { category: 'Lighting' } },
            { $group: { _id: '$movieId', title: { $first: '$title' }, description: { $first: '$description'}, 
                poster: { $first: '$poster'}, avgRating: { $avg: '$rating' } } },
            { $sort: { avgRating: -1 } },
            { $limit : 10 }
        ]),
        this.aggregate([
            { $match: { category: 'Sound' } },
            { $group: { _id: '$movieId', title: { $first: '$title' }, description: { $first: '$description'}, 
                poster: { $first: '$poster'}, avgRating: { $avg: '$rating' } } },
            { $sort: { avgRating: -1 } },
            { $limit : 10 }
        ])
    ])
        .then(([cinematography, editing, design, lighting, sound]) => {
            let results = {};
            results.cinematography = cinematography;
            results.editing = editing;
            results.design = design;
            results.lighting = lighting;
            results.sound = sound;
            return results;
        });
});

schema.static('sortByCategory', function (category, page) {
    return this.aggregate([
        { $match: { category: category } },
        { $group: { _id: '$movieId', title: { $first: '$title' }, avgRating: { $avg: '$rating' } } },
        { $sort: { avgRating: -1 } },
        { $skip: ((page * 10) - 10) },
        { $limit: 10 }
    ]);
});

schema.static('avgRatingByUser', function (userId) {
    userId = mongoose.Types.ObjectId(userId);
    return this.aggregate([
        { $match: { user: userId } },
        { $group: { _id: '$user', avgRating: { $avg: '$rating' } } }
    ]);
});

module.exports = mongoose.model('Review', schema);