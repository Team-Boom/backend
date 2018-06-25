const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');

describe.skip('User e2e', () => {

    beforeEach(() => dropCollection('users'));

    let token = null;
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
                token = body.token;
                _id = body._id;
            });
    });

    it('Updates User Info', () => {
        return request
            .put(`/api/user/${_id}/update`)
            .send({
                name: 'Mrs. Foosball'
            })
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, { updated: true});
            });
    });

});