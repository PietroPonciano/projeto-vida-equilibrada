const app = require('./app');
const {
    startServer
} = require('./server');

if (require.main === module) {
    startServer(app);
}

module.exports = app;