const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');

describe.only('User e2e', () => {

    beforeEach(() => dropCollection('users'));

    let _id = null;

    const checkOk = res => {
        if(!res.ok) throw res.error;
        return res;
    };

    beforeEach(() => {
        return request
            .post('/api/auth/signup')
            .send({
                email: 'foo@bar.com',
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

});