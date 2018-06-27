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
    title: RequiredString
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
            { $group: { _id: '$movieId', title: { $first: '$title' }, avgRating: { $avg: '$rating' } } },
            { $sort: { avgRating: -1 } },
            { $limit : 10 }
        ]),
        this.aggregate([
            { $match: { category: 'Editing' } },
            { $group: { _id: '$movieId', title: { $first: '$title' }, avgRating: { $avg: '$rating' } } },
            { $sort: { avgRating: -1 } },
            { $limit : 10 }
        ]),
        this.aggregate([
            { $match: { category: 'Design' } },
            { $group: { _id: '$movieId', title: { $first: '$title' }, avgRating: { $avg: '$rating' } } },
            { $sort: { avgRating: -1 } },
            { $limit : 10 }
        ]),
        this.aggregate([
            { $match: { category: 'Lighting' } },
            { $group: { _id: '$movieId', title: { $first: '$title' }, avgRating: { $avg: '$rating' } } },
            { $sort: { avgRating: -1 } },
            { $limit : 10 }
        ]),
        this.aggregate([
            { $match: { category: 'Sound' } },
            { $group: { _id: '$movieId', title: { $first: '$title' }, avgRating: { $avg: '$rating' } } },
            { $sort: { avgRating: -1 } },
            { $limit : 10 }
        ])
    ])
        .then(([cinematography, editing, design, lighting, sound]) => {
            // console.log('cinema', cinematography);
            // console.log('editing', editing);
            // console.log('design', design);
            // console.log('lighting', lighting);
            // console.log('sound', sound);
            let results = {};
            results.cinematography = cinematography;
            results.editing = editing;
            results.design = design;
            results.lighting = lighting;
            results.sound = sound;
            return results;
        });
});

module.exports = mongoose.model('Review', schema);

// db.getCollection('reviews').aggregate([
//     { $match: { movieId: "555534465461" } },
//     { $group: { _id: "$category", avgRating: { $avg: "$rating" } } }
//         ])

// topSongs() {
//     return this.aggregate([
//         { $group: { _id: '$_id', Title: { $first: '$title' }, Plays: { $first: '$playcount' } } },
//         { $sort: { Plays: -1 } }
//     ]);
// },

// songsByAlph() {
//     return this.aggregate([
//         { $group: { _id: '$_id', Title: { $first: '$title' }, Length: { $first: '$length' }, Playcount: { $first: '$playcount' }  } },
//         { $sort: { Title: 1 } }
//     ]);
// }

// sortByUser() {
//     return this.aggregate([
//         { $lookup: { from: 'users', localField: 'user', foreignField: '_id', as: 'user' } },
//         { $group: { _id: '$_id', Name: { $first: '$name' }, Plays: { $first: '$playlistCount' }, User: { $first: '$user.name' } } },
//         { $sort: { User: 1, Plays: -1 } }
//     ]);
// }