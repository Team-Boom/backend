const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');

describe.skip('Reviews e2e', () => {

    let _id = null;
    let reviewId = null;

    let review1 = {
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
            .then(({ body }) => {
                assert.deepEqual(body, {...review1, __v: 0, _id: body._id});
                reviewId = body._id;
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

    it('Updates a Review', () => {
        review1.text = 'A even greater review';
        return request
            .put(`/api/reviews/user/${reviewId}`)
            .send(review1)
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, {...review1, __v: 0, _id: reviewId });
            });
    });

    it('Deletes a Review', () => {
        return request
            .delete(`/api/reviews/user/${reviewId}`)
            .then(checkOk)
            .then(({ body }) => {
                assert.equal(body, reviewId);
            });
    });
});