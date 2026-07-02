const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const SECRET = process.env.JWT_SECRET || 'change-me-please';

function createAccessToken(userId) {
    return jwt.sign({
        userId
    }, SECRET, {
        expiresIn: '12h'
    });
}

function verifyAccessToken(token) {
    try {
        return jwt.verify(token, SECRET);
    } catch (e) {
        return null;
    }
}
// refresh tokens are random strings stored in DB; helper to generate
function createRefreshToken() {
    return crypto.randomBytes(48).toString('hex');
}
module.exports = {
    createAccessToken,
    verifyToken: verifyAccessToken, // alias
    createRefreshToken,
};