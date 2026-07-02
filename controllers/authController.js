const bcrypt = require('bcryptjs');

const auth = require('../middleware/auth');
const pool = require('../utils/db');
const jwtUtil = require('../utils/jwt');

async function storeRefreshToken(userId, token, daysValid = 7) {
    const expiresAt = new Date(Date.now() + daysValid * 24 * 60 * 60 * 1000);

    await pool.query(
        `INSERT INTO auth_refresh_token (user_id, token, expires_at)
         VALUES ($1, $2, $3)`,
        [userId, token, expiresAt]
    );
}

function setAuthCookies(res, access, refresh, sameSite = 'Strict') {
    res.cookie('access_token', access, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite,
        maxAge: 15 * 60 * 1000
    });

    res.cookie('refresh_token', refresh, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite,
        maxAge: 7 * 24 * 60 * 60 * 1000
    });
}

exports.register = async (req, res) => {
    const {
        username,
        password,
        salario,
        aceitou_termos,
        first_name,
        last_name,
        email
    } = req.body || {};

    if (!username || !password || salario === undefined) {
        return res.status(400).json({
            error: 'username, password e salario sao obrigatorios'
        });
    }

    try {
        const hash = await bcrypt.hash(password, 10);
        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            const userResult = await client.query(
                `INSERT INTO auth_user (username, password, first_name, last_name, email, is_active, date_joined)
                 VALUES ($1, $2, $3, $4, $5, TRUE, now())
                 RETURNING id, username`,
                [username, hash, first_name || '', last_name || '', email || '']
            );

            const userId = userResult.rows[0].id;

            await client.query(
                `INSERT INTO perfis ("userId", salario, aceitou_termos, recovery_code_1, recovery_code_2, codigos_exibidos)
                 VALUES (
                   $1,
                   $2,
                   $3,
                   lpad((floor(random()*1000000))::text, 6, '0'),
                   lpad((floor(random()*1000000))::text, 6, '0'),
                   false
                 )`,
                [userId, salario, Boolean(aceitou_termos)]
            );

            await client.query('COMMIT');

            const access = jwtUtil.createAccessToken(userId);
            const refresh = jwtUtil.createRefreshToken();
            await storeRefreshToken(userId, refresh);

            res.json({
                id: userId,
                access_token: access,
                refresh_token: refresh
            });
        } catch (e) {
            await client.query('ROLLBACK');
            console.error(e);

            res.status(400).json({
                error: String(e)
            });
        } finally {
            client.release();
        }
    } catch (e) {
        console.error(e);

        res.status(500).json({
            error: String(e)
        });
    }
};

exports.token = async (req, res) => {
    const {
        username,
        password
    } = req.body || {};

    if (!username || !password) {
        return res.status(400).json({
            error: 'username e password sao obrigatorios'
        });
    }

    try {
        const userRes = await pool.query('SELECT * FROM auth_user WHERE username = $1', [username]);
        const user = userRes.rows[0];

        if (!user) {
            return res.status(401).json({
                error: 'Credenciais invalidas'
            });
        }

        if (!user.is_active) {
            return res.status(403).json({
                error: 'Usuario inativo'
            });
        }

        const passwordMatches = await bcrypt.compare(password, user.password);

        if (!passwordMatches) {
            return res.status(401).json({
                error: 'Credenciais invalidas'
            });
        }

        const access = jwtUtil.createAccessToken(user.id);
        const refresh = jwtUtil.createRefreshToken();
        await storeRefreshToken(user.id, refresh);

        setAuthCookies(res, access, refresh);

        res.json({
            user: {
                id: user.id,
                username: user.username,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email
            }
        });
    } catch (e) {
        console.error(e);

        res.status(500).json({
            error: String(e)
        });
    }
};

exports.refresh = async (req, res) => {
    const refreshToken = req.cookies.refresh_token;

    if (!refreshToken) {
        return res.status(401).json({
            error: 'Missing refresh token'
        });
    }

    try {
        const tokenResult = await pool.query(
            `SELECT * FROM auth_refresh_token
             WHERE token = $1 AND revoked = false AND (expires_at IS NULL OR expires_at > now())`,
            [refreshToken]
        );

        const storedToken = tokenResult.rows[0];

        if (!storedToken) {
            return res.status(401).json({
                error: 'Token invalido ou expirado'
            });
        }

        await pool.query(
            'UPDATE auth_refresh_token SET revoked = true WHERE token = $1',
            [refreshToken]
        );

        const newAccess = jwtUtil.createAccessToken(storedToken.user_id);
        const newRefresh = jwtUtil.createRefreshToken();
        await storeRefreshToken(storedToken.user_id, newRefresh);

        setAuthCookies(res, newAccess, newRefresh, 'Lax');

        res.sendStatus(204);
    } catch (e) {
        console.error(e);

        res.status(500).json({
            error: String(e)
        });
    }
};

exports.revoke = async (req, res) => {
    const refreshToken = req.cookies.refresh_token;

    try {
        if (refreshToken) {
            await pool.query(
                'UPDATE auth_refresh_token SET revoked = true WHERE token = $1',
                [refreshToken]
            );
        }

        res.clearCookie('access_token');
        res.clearCookie('refresh_token');
        res.sendStatus(204);
    } catch (e) {
        console.error(e);

        res.status(500).json({
            error: String(e)
        });
    }
};

exports.me = async (req, res) => {
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
        const userRes = await pool.query(
            `SELECT id, username, first_name, last_name, email
             FROM auth_user
             WHERE id = $1`,
            [payload.userId]
        );

        const user = userRes.rows[0];

        if (!user) {
            return res.status(401).json({
                error: 'Invalid token (user not found)'
            });
        }

        res.json(user);
    } catch (e) {
        console.error(e);

        res.status(500).json({
            error: String(e)
        });
    }
};

exports.changePassword = async (req, res) => {
    auth(req, res, async () => {
        const {
            old_password,
            new_password
        } = req.body || {};

        if (!old_password || !new_password) {
            return res.status(400).json({
                error: 'old_password e new_password sao obrigatorios'
            });
        }

        try {
            const userResult = await pool.query('SELECT * FROM auth_user WHERE id = $1', [req.user.id]);
            const user = userResult.rows[0];
            const passwordMatches = await bcrypt.compare(old_password, user.password);

            if (!passwordMatches) {
                return res.status(400).json({
                    error: 'Senha antiga incorreta'
                });
            }

            const hash = await bcrypt.hash(new_password, 10);
            await pool.query('UPDATE auth_user SET password = $1 WHERE id = $2', [hash, req.user.id]);

            res.json({
                status: 'ok'
            });
        } catch (e) {
            console.error(e);

            res.status(500).json({
                error: String(e)
            });
        }
    });
};

exports.resetPassword = async (req, res) => {
    const {
        username,
        recovery_code,
        new_password
    } = req.body || {};

    if (!username || !recovery_code || !new_password) {
        return res.status(400).json({
            error: 'Campos obrigatorios: username, recovery_code, new_password'
        });
    }

    try {
        const userResult = await pool.query('SELECT * FROM auth_user WHERE username = $1', [username]);
        const user = userResult.rows[0];

        if (!user) {
            return res.status(404).json({
                error: 'Usuario nao encontrado'
            });
        }

        const perfilResult = await pool.query(
            'SELECT recovery_code_1, recovery_code_2 FROM perfis WHERE "userId" = $1',
            [user.id]
        );

        const perfil = perfilResult.rows[0];

        if (!perfil) {
            return res.status(404).json({
                error: 'Perfil do usuario nao encontrado'
            });
        }

        if (perfil.recovery_code_1 !== recovery_code && perfil.recovery_code_2 !== recovery_code) {
            return res.status(400).json({
                error: 'Codigo de recuperacao invalido'
            });
        }

        const hash = await bcrypt.hash(new_password, 10);
        await pool.query('UPDATE auth_user SET password = $1 WHERE username = $2', [hash, username]);

        res.json({
            status: 'ok',
            message: 'Senha redefinida com sucesso'
        });
    } catch (err) {
        console.error(err);

        res.status(500).json({
            error: 'Erro interno do servidor'
        });
    }
};