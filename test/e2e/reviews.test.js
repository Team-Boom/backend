const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');

describe('Reviews e2e', () => {

    let _id = null;
    let reviewId = null;

    const review1 = {
        movieId: '555534465463',
        text: 'A great review',
        category: 'Sound',
        rating: 3,
        user: null
    };

    const checkOk = res => {
        if(!res.ok) throw res.error;
        return res;
    };

    before(() => dropCollection('users'));
    before(() => dropCollection('reviews'));
    before(() => {
        return request
            .post('/api/auth/signup')
            .send({
                email: 'foo@bar.com',
                password: 'foobar',
                name: 'Mr. Foo Bar'
            })
            .then(({ body }) => {
                // token = body.token;
                _id = body._id;
                review1.user = _id;
            });
    });

    it('Posts a Review', () => {
        return request
            .post(`/api/reviews/user/${_id}`)
            .send(review1)
            .then(checkOk)
            .then(() => {
                return request
                    .get(`/api/reviews/movie/${review1.movieId}`)
                    .then(({ body }) => {
                        reviewId = body[0]._id;
                        assert.equal(body[0].movieId, review1.movieId);
                    });
            });
    });

    it('Posting a Review that already exists fails', () => {
        return request
            .post(`/api/reviews/user/${_id}`)
            .send(review1)
            .then(res => {
                assert.equal(res.error.status, 400);
            });
    });

    it('Gets Reviews by User', () => {
        return request
            .get(`/api/reviews/user/${_id}`)
            .then(({ body }) => {
                assert.deepEqual(body[0], { ...review1, __v: 0, _id: reviewId });
            });
    });
});