const { assert } = require('chai');
const { getErrors } = require('./helpers');
const User = require('../../lib/models/User');

describe('User Model', () => {

    const data = {
        name: 'Foo Bar',
        email: 'foo@bar.com'
    };

    const password = 'foobar';

    let user = null;
    beforeEach(() => {
        user = new User(data);
        user.generateHash(password);
    });

    it('Generates Hash from Password', () => {
        assert.ok(user.hash);
        assert.notEqual(user.hash, password);
    });

    it('Compares Password to Hash', () => {
        assert.isOk(user.comparePassword(password));
    });

    it('Valid Model', () => {
        data._id = user._id;
        data.hash = user.hash;
        data.date = user.date;
        data.watchlist = [];
        assert.deepEqual(data, user.toJSON());
    });

    it('Required Fields', () => {
        const user2 = new User({});
        const errors = getErrors(user2.validateSync(), 3);
        assert.equal(errors.name.kind, 'required');
        assert.equal(errors.email.kind, 'required');
        assert.equal(errors.hash.kind, 'required');
    });
});