const { assert } = require('chai');
// const { Types } = require('mongoose');
const { getErrors } = require('./helpers');
const Movie = require('../../lib/models/Movie');

describe.skip('Movie Model', () => {

    const data = {
        title: 'Great Movie Title',
        movieId: '5555',
        poster: 'link goes here',
        description: 'The greatest movie'
    };


    let movie = null;
    beforeEach(() => {
        movie = new Movie(data);
    });

    it('Valid Model', () => {
        data._id = movie._id;
        assert.deepEqual(data, movie.toJSON());
    });

    it('Required Fields', () => {
        const movie2 = new Movie({});
        const errors = getErrors(movie2.validateSync(), 2);
        assert.equal(errors.movieId.kind, 'required');
    });

});