const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');
const { verify } = require('../../lib/auth/token-service');

describe('User e2e', () => {

    before(() => dropCollection('users'));
    before(() => dropCollection('movies'));

    let _id = null;
    let token = null;
    let user = null;

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
                user = body;
                token = body.token;
                return verify(body.token);
            })
            .then(payload => {
                _id = payload.id;
            });
    });

    it('Updates User Info', () => {
        return request
            .put(`/api/users/${_id}`)
            .set('Authorization', token)
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
            .set('Authorization', token)
            .send(movie)
            .then(checkOk)
            .then(({ body }) => {
                user = body;
                assert.deepEqual(body.watchlist, [movieId]);
            });
    });

    it('Attempts to add same movie to watchlist, returns same user info for frontend', () => {
        return request
            .post(`/api/users/${_id}/watchlist`)
            .set('Authorization', token)
            .send(movie)
            .then(({ body }) => {
                assert.deepEqual(body, user);
            });
    });

    it('Get watchlist', () => {
        return request
            .get(`/api/users/${_id}/watchlist`)
            .set('Authorization', token)
            .then(({ body }) => {
                assert.equal(body[0].movieId, '12345');
            });
    });

    it('Get without token', () => {
        return request
            .get(`/api/users/${_id}/watchlist`)
            .then(({ body }) => {
                assert.equal(body.error, 'No Authorization Found');
            });
    });

    it('Get with bad id', () => {
        return request
            .get(`/api/users/${_id}5/watchlist`)
            .set('Authorization', token)
            .then(({ body }) => {
                assert.equal(body.error, 'Must Be Authorized User');
            });
    });

});