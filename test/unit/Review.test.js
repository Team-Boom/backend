const { assert } = require('chai');
const { Types } = require('mongoose');
const { getErrors } = require('./helpers');
const Review = require('../../lib/models/Review');

describe.skip('Review Model', () => {

    const data = {
        user: Types.ObjectId(),
        movieId: '5555',
        text: 'A great review',
        category: 'Sound',
        rating: 3
    };


    let review = null;
    beforeEach(() => {
        review = new Review(data);
    });

    it('Valid Model', () => {
        data._id = review._id;
        assert.deepEqual(data, review.toJSON());
    });

    it('Required Fields', () => {
        const review2 = new Review({});
        const errors = getErrors(review2.validateSync(), 5);
        assert.equal(errors.movieId.kind, 'required');
    });

    it('Category Enum', () => {
        const review3 = new Review({
            user: Types.ObjectId(),
            movieId: '5555',
            text: 'A great review',
            category: 'fake',
            rating: 3
        });

        const error = getErrors(review3.validateSync(), 1);
        assert.equal(error.category.kind, 'enum');
    });
});