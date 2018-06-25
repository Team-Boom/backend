const router = require('express').Router();
const Review = require('../models/Review');
// const ensureAuth = require('../auth/ensure-auth')();
// const tokenService = require('../auth/token-service');
const bodyParser = require('body-parser').json();

router
    .get('/movie/:id', (req, res, next) => { // by imdbId - all reviews by Id
        Review.find({ movieId: req.params.id} )
            .then(results => {
                if(!results) res.send('No Reviews with that Movie ID');
                res.send(results);
            })
            .catch(next);
    })

    .get('/user/:id', (req, res, next) => {
        Review.find({ user: req.params.id })
            .then(results => res.send(results))
            .catch(next);
    })

    .post('/user/:id', bodyParser, (req, res, next) => { // by userId
        const { category, movieId, user } = req.body;
        Review.exists({ category, movieId, user })
            .then(exists => {
                if(exists) { throw { code: 400, error: 'Review Already Exists' }; }
                const review = new Review(req.body);
                return review.save();
            })
            .then(() => res.send({ code: 200, message: 'Review Added Successfully' }))
            .catch(next);
    });

module.exports = router; 
