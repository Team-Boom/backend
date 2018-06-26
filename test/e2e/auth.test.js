const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');

describe.skip('AUTH API', () => {

    beforeEach(() => dropCollection('users'));

    let token = null;

    beforeEach(() => {
        return request
            .post('/api/auth/signup')
            .send({
                email: 'foo@bar.com',
                password: 'foobar',
                name: 'Mr. Foo Bar'
            })
            .then(({ body }) => {
                token = body.token;
            });
    });

    it('Signup', () => {
        assert.ok(token);
    });

    it('Verifies', () => {
        return request
            .get('/api/auth/verify')
            .set('Authorization', token)
            .then(({ body }) => {
                assert.deepEqual(body, { valid: true });
            });
    });

    it('Signin', () => {
        return request
            .post('/api/auth/signin')
            .send({
                email: 'foo@bar.com',
                password: 'foobar'
            })
            .then(({ body }) => {
                assert.ok(body.token);
            });
    });

    it('Gives 400 Error on Signup of Same Email', () => {
        return request
            .post('/api/auth/signup')
            .send({
                email: 'foo@bar.com',
                password: 'foobar',
                name: 'Mrs. Foo Bar'
            })
            .then(res => {
                assert.equal(res.status, 400);
                assert.equal(res.body.error, 'Email In Use');
            });
    });

    it('Gives 401 Error on Non-Existent Email', () => {
        return request
            .post('/api/auth/signin')
            .send({
                email: 'bad@bar.com',
                password: 'fake'
            })
            .then(res => {
                assert.equal(res.status, 401);
                assert.equal(res.body.error, 'Invalid Login');
            });
    });

    it('Gives 401 on Bad Password', () => {
        return request
            .post('/api/auth/signin')
            .send({
                email: 'foo@bar.com',
                password: 'bad'
            })
            .then(res => {
                assert.equal(res.status, 401);
                assert.equal(res.body.error, 'Invalid Login');
            });
    });
});