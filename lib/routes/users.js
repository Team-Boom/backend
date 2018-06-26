const router = require('express').Router();
const User = require('../models/User');
// const ensureAuth = require('../auth/ensure-auth')();
// const tokenService = require('../auth/token-service');
const bodyParser = require('body-parser').json();

const updateOptions = {
    new: true,
    runValidators: true
};

router
    .put('/:id/update', bodyParser, (req, res, next) => {
        User.findByIdAndUpdate(req.params.id, req.body, updateOptions)
            .select('date email name reviews watchlist')
            .then(user => res.send(user))
            .catch(next);
    });

module.exports = router;