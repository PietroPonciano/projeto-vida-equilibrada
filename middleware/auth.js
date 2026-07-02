const jwtUtil = require('../utils/jwt');
const User = require('../models/User');

async function authMiddleware(req, res, next) {
    const token = req.cookies?.access_token;

    if (!token) {
        return res.status(401).json({
            error: 'Missing token'
        });
    }

    const payload = jwtUtil.verifyToken(token);
    if (!payload) {
        return res.status(401).json({
            error: 'Invalid token'
        });
    }

    try {
        const user = await User.findByPk(payload.userId, {
            attributes: ['id', 'username', 'first_name', 'last_name', 'email'],
        });

        if (!user) {
            return res.status(401).json({
                error: 'Invalid token (user not found)'
            });
        }

        req.user = user;
        next();
    } catch (e) {
        console.error(e);
        res.status(500).json({
            error: 'DB error'
        });
    }
}

module.exports = authMiddleware;