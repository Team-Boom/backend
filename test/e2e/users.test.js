const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');
const Movie = require('../../lib/models/Movie');


describe.only('User e2e', () => {

    before(() => dropCollection('users'));
    before(() => dropCollection('movies'));

    let _id = null;

    const movie = {
        title: 'The Best Movie to Add',
        poster: 'url goes here',
        description: 'oh yeah',
        movieId: '12345'
    };

    const checkOk = res => {
        if(!res.ok) throw res.error;
        return res;
    };

    before(() => {
        return request
            .post('/api/auth/signup')
            .send({
                email: 'email@email.com',
                password: 'foobar',
                name: 'Mr. Foo Bar'
            })
            .then(({ body }) => {
                _id = body._id;
            });
    });

    it('Updates User Info', () => {
        return request
            .put(`/api/users/${_id}`)
            .send({
                name: 'Mrs. Foosball'
            })
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, { ...body, name: 'Mrs. Foosball' });
            });
    });

    it('Adds movie to watchlist and adds movie to database', () => {
        const { movieId } = movie;
        return request
            .post(`/api/users/${_id}/watchlist`)
            .send(movie)
            .then(checkOk)
            .then(({ body}) => {
                assert.deepEqual(body.watchlist, [movieId]);
            })
            .then(() => Movie.exists({ movieId }))
            .then(exists => {
                assert.isTrue(exists);
            });
    });

    it('Get watchlist', () => {
        return request
            .get(`/api/users/${_id}/watchlist`)
            .then(({ body }) => {
                assert.equal(body[0].movieId, '12345');
            });
    });

});