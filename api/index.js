const app = require('../app');
const {
    initDB
} = require('../server');

initDB();

module.exports = app;