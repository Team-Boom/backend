const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const errorHandler = require('./utils/error-handler');
const cors = require('cors');

app.use(morgan('dev'));
app.use(cors());
app.use((req, res, next) => {
    if(process.env.NODE_ENV !== 'production') return next();
    if(req.headers['x-forwarded-proto'] === 'https') next();
    else res.redirect(`https://${req.hostname}${req.url}`);
});
app.use(express.static('./public'));
app.use(bodyParser.json());

const auth = require('./routes/auth');
const users = require('./routes/users');
const reviews = require('./routes/reviews');

app.use('/api/auth', auth);
app.use('/api/users', users);
app.use('/api/reviews', reviews);

app.use((req, res) => {
    res.sendFile('index.html', { root: './public'});
});

app.use(errorHandler());

module.exports = app;