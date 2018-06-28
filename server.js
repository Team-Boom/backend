const http = require('http');
const app = require('./lib/app');
const connect = require('./lib/connect');

connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/boommovies');

const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    // eslint-disable-next-line
  console.log('Server Running On', server.address().PORT);
});