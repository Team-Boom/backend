const router = require('express').Router();
const User = require('../models/User');
const ensureAuth = require('../auth/ensure-auth')();
const tokenService = require('../auth/token-service');
const bodyParser = require('body-parser').json();

function hasEmailAndPassword(req, res, next) {
    const user = req.body;
    if(!user || !user.email || !user.password) {
        return next({
            code: 400,
            error: 'Name, Email, and Password Must Be Supplied'
        });
    }
    next();
}

router
    .get('/verify', ensureAuth, (req, res) => {
        res.send({ valid: true});
    })

    .post('/signup', bodyParser, hasEmailAndPassword, (req, res, next) => {
        const { name, email, password } = req.body;
        delete req.body.password;

        User.exists({ email })
            .then(exists => {
                if (exists) { throw { code: 400, error: 'Email In Use' }; }
                const user = new User({ name, email });
                user.generateHash(password);
                return user.save();
            })
            .then(user => Promise.all([user, tokenService.sign(user)]))
            .then(([user, token]) => res.send({
                token,
                name: user.name
            }))
            .catch(next);
    })

    .post('/signin', bodyParser, hasEmailAndPassword, (req, res, next) => {
        const { email, password } = req.body;
        delete req.body.password;

        User.findOne({ email })
            .then(user => {
                if (!user || !user.comparePassword(password)) {
                    throw { code: 401, error: 'Invalid Login' };
                }
                return user;
            })
            .then(user => Promise.all([user, tokenService.sign(user)]))
            .then(([user, token]) => res.send({
                token,
                name: user.name
            }))
            .catch(next);
    });

module.exports = router;