const router = require('express').Router();
const Review = require('../models/Review');
const User = require('../models/User');
// const ensureAuth = require('../auth/ensure-auth')();
// const tokenService = require('../auth/token-service');
const bodyParser = require('body-parser').json();

const updateOptions = {
    new: true,
    runValidators: true
};

router
    .get('/movie/:id', (req, res, next) => { // by imdbId - all reviews by Id
        Review.find({ movieId: req.params.id} )
            .then(results => {
                if(!results) res.send('No Reviews with that Movie ID');
                res.send(results);
            })
            .catch(next);
    })

    .get('/user/:id', (req, res, next) => { // reviews by userId
        Review.find({ user: req.params.id })
            .then(results => res.send(results))
            .catch(next);
    })

    .post('/user/:id', bodyParser, (req, res, next) => { // post review by userId
        const { category, movieId, user } = req.body;
        Review.exists({ category, movieId, user })
            .then(exists => {
                if(exists) { throw { code: 400, error: 'Review Already Exists' }; }
                const review = new Review(req.body);
                return review.save();
            })
            .then(review => Promise.all([review, User.findById(user)]))
            .then(([review, user]) => {
                user.reviews.push(review._id);
                user.save();
            })
            .then(() => res.send('Review Added Successfully'))
            .catch(next);
    })

    .put('/user/:id', bodyParser, (req, res, next) => {
        Review.findByIdAndUpdate(req.params.id, req.body, updateOptions)
            .then(updated => res.send(updated))
            .catch(next);
    });

module.exports = router; 

// .then(user => Promise.all([user, tokenService.sign(user)]))
