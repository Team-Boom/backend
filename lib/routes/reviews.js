const router = require('express').Router();
const Review = require('../models/Review');
const Movie = require('../models/Movie');
const ensureAuth = require('../auth/ensure-auth')();
const ensureSameUser = require('../auth/ensure-same-user')();
const bodyParser = require('body-parser').json();

const updateOptions = {
    new: true,
    runValidators: true
};

router
    .get('/movie/:id/:category', ({ params: { id, category } }, res, next) => {  // all reviews by Movie ID & Category
        Review.find({ movieId: id, category })
            .then(results => res.send(results))  // returns empty array if no reviews
            .catch(next);
    })

    .get('/movie/:id', (req, res, next) => { // by imdbId - all reviews by movieId
        Review.find({ movieId: req.params.id})
            .then(results => res.send(results))  // returns empty array if no results
            .catch(next);
    })

    // Again, remove id from route if it **must** be the logged in user

    // This seems very narrow, wouldn't you want count for all categories? Will take a look at app...
    .get('/me/count/:category', ensureAuth, ensureSameUser, (req, res, next) => {  // count all reviews for category by User Id
        Review.count({ user: req.user.id, category: req.params.category })
            .then(count => res.send(count.toString())) // result is string from body.text
            .catch(next);
    })

    .get('/me/avg', ensureAuth, (req, res, next) => { // avg of all ratings by user
        Review.avgRatingByUser(req.user.id)
            .then(results => res.send(results[0]))  // returns empty object if no ratings
            .catch(next);
    })


    .get('/me', ensureAuth, (req, res, next) => { // reviews by userId
        Review.find({ user: req.user.id })
            .then(results => res.send(results))  // returns empty array if no results
            .catch(next);
    })

    .post('/', ensureAuth, bodyParser, (req, res, next) => { // post review by userId
        const { category, movieId, title, poster, description } = req.body;
        Review.exists({ category, movieId, user: req.user.id })
            .then(exists => {
                if(exists) { throw { code: 400, error: 'Review Already Exists' }; }
                const review = new Review(req.body);
                review.user = req.user.id;
                return Promise.all([
                    review.save(),
                    Movie.exists({ movieId })
                        .then(exists => {
                            if(exists) return;
                            const movie = new Movie({ title, poster, description, movieId });
                            return movie.save();
                        })
                ])
            })
            .then(([review]) => res.send(review))
            .catch(next);
    })

    .put('/me/:reviewId', ensureAuth, bodyParser, (req, res, next) => {  // update review by review id
        Review.findOneAndUpdate({
            _id: req.params.reviewId,
            user: req.user.id
        }, req.body, updateOptions)
            .then(updated => {
                // TODO: if !updated send error

                res.send(updated)
            })
            .catch(next);
    })

    .delete('/me/:reviewId', ensureAuth, (req, res, next) => { // delete by review id
        Review.findOneAndRemove({
            _id: req.params.reviewId,
            user: req.user.id
        })
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
    })

    .get('/detail/:id', (req, res, next) => {
        Review.findById(req.params.id)
            .then(results => res.send(results))
            .catch(next);
    });

module.exports = router;