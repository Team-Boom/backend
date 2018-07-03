const router = require('express').Router();
const User = require('../models/User');
const Movie = require('../models/Movie');
const ensureAuth = require('../auth/ensure-auth')();
const ensureSameUser = require('../auth/ensure-same-user')();
const bodyParser = require('body-parser').json();

const updateOptions = {
    new: true,
    runValidators: true
};

router
    .post('/watchlist', ensureAuth, bodyParser, (req, res, next) => {
        const { title, poster, description, movieId } = req.body;

        Promise.all([
            User.select('-hash')
                .findByIdAndUpdate(req.params.id, {
                    // This will add if not already in the list
                    $addToSet: { watchlist: movieId }
                }),
            Movie.exists({ movieId })
                .then(exists => {
                    if(exists) return;
                    const movie = new Movie({ title, poster, description, movieId });
                    return movie.save();
                })
        ])
            .then(([user]) => res.send(user))
            .catch(next);
    })

    .put('/', ensureAuth, bodyParser, (req, res, next) => {
        // make sure no funny business with update of hash
        delete req.body.hash;
        User.findByIdAndUpdate(req.params.id, req.body, updateOptions)
            .select('date email name reviews watchlist')
            .then(user => res.send(user))
            .catch(next);
    })

    .get('/watchlist', ensureAuth, (req, res, next) => {
        User.findById(req.params.id)
            .lean()
            .select('watchlist')
            // use populate! (works if movie._id is the movie id)
            .populate('watchlist')
            .then(({ watchlist }) => res.send(watchlist))
            .catch(next);

    });

module.exports = router;

