const router = require('express').Router();
const User = require('../models/User');
// const ensureAuth = require('../auth/ensure-auth')();
// const tokenService = require('../auth/token-service');
const bodyParser = require('body-parser').json();

router
    .put('/:id/update', bodyParser, (req, res, next) => {
        const user = req.body;
        const _id = req.params.id;

        User.exists({ _id })
            .then(exists => {
                if (!exists) { throw { code: 401, error: 'User Does Not Exist' }; }
                return User.findByIdAndUpdate(_id, user);
            })
            .then(() => res.send({ updated: true }))
            .catch(next);

    });

module.exports = router;