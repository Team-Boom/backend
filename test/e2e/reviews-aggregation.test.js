const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');

const { 
    review1,
    review2,
    review3,
    review4,
    review5,
    review6,
    review7
} = require('./staticReviewData');
let {
    user1,
    user2,
    user3,
    user4,
    user5,
    user6,
    user7,
    user8
} = require('./staticUserData');

describe('Aggregation', () => {

    let userIds = [];

    before(() => dropCollection('users'));
    before(() => dropCollection('reviews'));

    const postUser = user => {
        return request.post('/api/auth/signup')
            .send(user)
            .then(({ body }) => {
                userIds.push(body._id);
            });
    };

    const checkOk = res => {
        if(!res.ok) throw res.error;
        return res;
    };

    const postReview = (review, user) => {
        return request
            .post(`/api/reviews/user/${user}`)
            .send(review)
            .then(checkOk)
            .then(() => {return null;});
    };

    before(() => postUser(user1));
    before(() => postUser(user2));
    before(() => postUser(user3));
    before(() => postUser(user4));
    before(() => postUser(user5));
    before(() => postUser(user6));
    before(() => postUser(user7));
    before(() => postUser(user8));

    before(() => postReview(review1[0], userIds[0]));
    before(() => postReview(review1[1], userIds[0]));
    before(() => postReview(review1[2], userIds[0]));
    before(() => postReview(review1[3], userIds[0]));
    before(() => postReview(review1[4], userIds[0]));
    before(() => postReview(review1[5], userIds[0]));
    before(() => postReview(review1[6], userIds[0]));
    before(() => postReview(review1[7], userIds[0]));
    before(() => postReview(review1[8], userIds[0]));
    before(() => postReview(review1[9], userIds[0]));

    before(() => postReview(review2[0], userIds[1]));
    before(() => postReview(review2[1], userIds[1]));
    before(() => postReview(review2[2], userIds[1]));
    before(() => postReview(review2[3], userIds[1]));
    before(() => postReview(review2[4], userIds[1]));
    before(() => postReview(review2[5], userIds[1]));
    before(() => postReview(review2[6], userIds[1]));
    before(() => postReview(review2[7], userIds[1]));
    before(() => postReview(review2[8], userIds[1]));
    before(() => postReview(review2[9], userIds[1]));

    before(() => postReview(review3[0], userIds[2]));
    before(() => postReview(review3[1], userIds[2]));
    before(() => postReview(review3[2], userIds[2]));
    before(() => postReview(review3[3], userIds[2]));
    before(() => postReview(review3[4], userIds[2]));
    before(() => postReview(review3[5], userIds[2]));
    before(() => postReview(review3[6], userIds[2]));
    before(() => postReview(review3[7], userIds[2]));
    before(() => postReview(review3[8], userIds[2]));
    before(() => postReview(review3[9], userIds[2]));

    before(() => postReview(review4[0], userIds[3]));
    before(() => postReview(review4[1], userIds[3]));
    before(() => postReview(review4[2], userIds[3]));
    before(() => postReview(review4[3], userIds[3]));
    before(() => postReview(review4[4], userIds[3]));
    before(() => postReview(review4[5], userIds[3]));
    before(() => postReview(review4[6], userIds[3]));
    before(() => postReview(review4[7], userIds[3]));
    before(() => postReview(review4[8], userIds[3]));
    before(() => postReview(review4[9], userIds[3]));

    before(() => postReview(review5[0], userIds[4]));
    before(() => postReview(review5[1], userIds[4]));
    before(() => postReview(review5[2], userIds[4]));
    before(() => postReview(review5[3], userIds[4]));
    before(() => postReview(review5[4], userIds[4]));
    before(() => postReview(review5[5], userIds[4]));
    before(() => postReview(review5[6], userIds[4]));
    before(() => postReview(review5[7], userIds[4]));
    before(() => postReview(review5[8], userIds[4]));
    before(() => postReview(review5[9], userIds[4]));

    before(() => postReview(review6[0], userIds[5]));
    before(() => postReview(review6[1], userIds[5]));
    before(() => postReview(review6[2], userIds[5]));
    before(() => postReview(review6[3], userIds[5]));
    before(() => postReview(review6[4], userIds[5]));
    before(() => postReview(review6[5], userIds[5]));
    before(() => postReview(review6[6], userIds[5]));
    before(() => postReview(review6[7], userIds[5]));
    before(() => postReview(review6[8], userIds[5]));
    before(() => postReview(review6[9], userIds[5]));

    before(() => postReview(review7[0], userIds[6]));
    before(() => postReview(review7[1], userIds[6]));
    before(() => postReview(review7[2], userIds[6]));
    before(() => postReview(review7[3], userIds[6]));
    before(() => postReview(review7[4], userIds[6]));
    before(() => postReview(review7[5], userIds[6]));

    it('Avg Ratings by MovieId', () => {
        return request
            .get(`/api/reviews/${review1[0].movieId}`)
            .then(({ body }) => {
                assert.deepEqual(body, { Lighting: 5, Editing: 0, Cinematography: 2, Design: 3, Sound: 3 });
            });
    });

    it('Load all Top 10s by Category', () => {
        return request
            .get('/api/reviews/top10')
            .then(({ body }) => {
                assert.isObject(body);
                assert.isArray(body.cinematography);
                assert.isArray(body.editing);
                assert.isArray(body.sound);
                assert.isArray(body.design);
                assert.isArray(body.lighting);
                assert.lengthOf(body.editing, 10);
                assert.lengthOf(body.cinematography, 10);
                assert.lengthOf(body.sound, 10);
                assert.lengthOf(body.design, 10);
                assert.lengthOf(body.lighting, 10);
                assert.isObject(body.editing[0]);
                assert.equal(body.editing[0].avgRating, 5.0);
                assert.equal(body.editing[9].avgRating, 0.0);
            });
    });

    it('Sort By Category', () => {
        return request
            .get('/api/reviews/sort/Sound/2')
            .then(({ body }) => {
                assert.lengthOf(body, 1);
                assert.equal(body[0].avgRating, 1.5);
            });
    });

    it('Gets average rating by User', () => {
        return request
            .get(`/api/reviews/user/avg/${userIds[0]}`)
            .then(({ body }) => {
                assert.equal(body.avgRating, 3.0);
            });
    });

    it('Response from zero reviews', () => {
        return request
            .get(`/api/reviews/user/avg/${userIds[7]}`)
            .then(({ body }) => {
                assert.deepEqual(body, {});
            });
    });

});