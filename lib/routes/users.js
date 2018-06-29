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
    .post('/:id/watchlist', ensureAuth, ensureSameUser, bodyParser, (req, res, next) => {
        const { title, poster, description, movieId } = req.body;
        User.findById(req.params.id)
            .then(user => {
                if(user.watchlist.includes(movieId)) { throw { code: 400, error: 'Movie Already in Watchlist!' }; }
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

    .put('/:id', ensureAuth, ensureSameUser, bodyParser, (req, res, next) => {
        User.findByIdAndUpdate(req.params.id, req.body, updateOptions)
            .select('date email name reviews watchlist')
            .then(user => res.send(user))
            .catch(next);
    })

    .get('/:id/watchlist', ensureAuth, ensureSameUser, (req, res, next) => {
        User.findById(req.params.id)
            .then(user => {
                const { watchlist } = user;
                return watchlist;
            })
            .then(watchlist => {
                return Promise.all(watchlist.map(movie => { 
                    return Movie.find({ movieId: movie })
                        .then(result => { 
                            return result;
                        });
                }))
                    .then(results => {
                        let movies =[];
                        results.forEach(movie => movies.push(movie[0]));
                        res.send(movies);
                    });
            })
            .catch(next);

    });

module.exports = router;

