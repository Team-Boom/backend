const router = require('express').Router();
const Review = require('../models/Review');
// const User = require('../models/User');
const Movie = require('../models/Movie');
// const ensureAuth = require('../auth/ensure-auth')();
// const tokenService = require('../auth/token-service');
const bodyParser = require('body-parser').json();

const updateOptions = {
    new: true,
    runValidators: true
};

router
    .get('/movie/:id/:category', (req, res, next) => {  // all reviews by Movie ID & Category
        Review.find({ movieId: req.params.id, category: req.params.category })
            .then(results => res.send(results))  // returns empty array if no reviews
            .catch(next);
    })

    .get('/movie/:id', (req, res, next) => { // by imdbId - all reviews by movieId
        Review.find({ movieId: req.params.id})
            .then(results => res.send(results))  // returns empty array if no results
            .catch(next);
    })

    .get('/user/count/:id/:category', (req, res, next) => {  // count all reviews for category by User Id
        Review.find({ user: req.params.id, category: req.params.category })
            .then(results => res.send(results.length.toString())) // result is string from body.text
            .catch(next);
    })

    .get('/user/avg/:id', (req, res, next) => { // avg of all ratings by user
        Review.avgRatingByUser(req.params.id)
            .then(results => res.send(results[0]))  // returns empty object if no ratings
            .catch(next);
    })


    .get('/user/:id', (req, res, next) => { // reviews by userId
        Review.find({ user: req.params.id })
            .then(results => res.send(results))  // returns empty array if no results
            .catch(next);
    })

    .post('/user/:id', bodyParser, (req, res, next) => { // post review by userId
        const { category, movieId, title, poster, description } = req.body;
        Review.exists({ category, movieId, user: req.params.id })
            .then(exists => {
                if(exists) { throw { code: 400, error: 'Review Already Exists' }; }
                const review = new Review(req.body);
                review.user = req.params.id;
                return review.save();
            })
            .then((review => Promise.all([review, Movie.exists({ movieId })])))
            .then(([review, exists]) => {
                if(!exists) {
                    const data = { title, poster, description, movieId };
                    const movie = new Movie(data);
                    movie.save();
                }
                res.send(review);
            })
            .catch(next);
    })

    .put('/user/:id', bodyParser, (req, res, next) => {  // update review by review id
        Review.findByIdAndUpdate(req.params.id, req.body, updateOptions)
            .then(updated => res.send(updated))
            .catch(next);
    })

    .delete('/user/:id', (req, res, next) => { // delete by review id
        Review.findByIdAndRemove(req.params.id)
            .then(deleted => res.send(deleted._id))
            .catch(next);
    })

    .get('/top10', (req, res, next) => {  // get top 10 movies for each category
        Review.top10()
            .then(results => res.send(results))
            .catch(next);
    })

    .get('/sort/:category/:page', (req, res, next) => {
        Review.sortByCategory(req.params.category, req.params.page)
            .then(results => res.send(results))
            .catch(next);
    })

    .get('/:id', (req, res, next) => {  // get category averages for a movie id
        Review.movieAvg(req.params.id)
            .then(results => res.send(results)) // returns empty object if no averages
            .catch(next);
    });

module.exports = router;