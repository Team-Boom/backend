const router = require('express').Router();
const User = require('../models/User');
const Movie = require('../models/Movie');
// const ensureAuth = require('../auth/ensure-auth')();
// const tokenService = require('../auth/token-service');
const bodyParser = require('body-parser').json();

const updateOptions = {
    new: true,
    runValidators: true
};

router
    .post('/:id/watchlist', bodyParser, (req, res, next) => {
        const { title, poster, description, movieId } = req.body;
        User.findById(req.params.id)
            .then(user => {
                user.watchlist.push(req.body.movieId);
                return user.save();
            })
            .then((user => Promise.all([user, Movie.exists({ movieId })])))
            .then(([user, exists]) => {
                if(!exists) {
                    const data = { title, poster, description, movieId };
                    const movie = new Movie(data);
                    movie.save();
                }
                res.send(user);
            })
            .catch(next);
    })

    .put('/:id', bodyParser, (req, res, next) => {
        User.findByIdAndUpdate(req.params.id, req.body, updateOptions)
            .select('date email name reviews watchlist')
            .then(user => res.send(user))
            .catch(next);
    });

module.exports = router;