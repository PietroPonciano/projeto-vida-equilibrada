const bcrypt = require('bcryptjs');

const auth = require('../middleware/auth');
const pool = require('../utils/db');

exports.getPerfil = async (req, res) => {
    auth(req, res, async () => {
        try {
            if (!req.user?.id) {
                return res.status(401).json({
                    error: 'Usuario nao autenticado'
                });
            }

            const userId = req.user.id;

            const gastosRes = await pool.query(
                `SELECT
                   SUM(CASE WHEN "dataGasto" >= DATE_TRUNC('month', CURRENT_DATE) THEN valor ELSE 0 END) AS atual,
                   SUM(
                     CASE
                       WHEN "dataGasto" >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
                       AND "dataGasto" < DATE_TRUNC('month', CURRENT_DATE)
                       THEN valor
                       ELSE 0
                     END
                   ) AS anterior
                 FROM gastos
                 WHERE "userId" = $1`,
                [userId]
            );

            const totalAtual = parseFloat(gastosRes.rows[0].atual || 0);
            const totalAnterior = parseFloat(gastosRes.rows[0].anterior || 0);
            const diffValor = totalAnterior > 0 ? totalAtual - totalAnterior : 0;
            const diffPercentual = totalAnterior > 0 ? (diffValor / totalAnterior) * 100 : 0;

            const result = await pool.query(
                `UPDATE perfis
                 SET diff_valor_mensal = $1, diff_percentual_mensal = $2
                 WHERE "userId" = $3
                 RETURNING *`,
                [diffValor, diffPercentual.toFixed(2), userId]
            );

            res.json({
                user: req.user,
                perfil: result.rows[0] || null,
                stats: {
                    totalMesAtual: totalAtual,
                    totalMesAnterior: totalAnterior,
                    isFirstMonth: totalAnterior === 0
                }
            });
        } catch (e) {
            console.error('Erro ao buscar perfil:', e);

            res.status(500).json({
                error: String(e)
            });
        }
    });
};

exports.confirmarCodigos = async (req, res) => {
    auth(req, res, async () => {
        try {
            if (!req.user?.id) {
                return res.status(401).json({
                    error: 'Usuario nao autenticado'
                });
            }

            const result = await pool.query(
                'SELECT * FROM perfis WHERE "userId" = $1',
                [req.user.id]
            );

            const perfil = result.rows[0];

            if (!perfil) {
                return res.status(404).json({
                    error: 'Perfil nao encontrado'
                });
            }

            if (perfil.codigos_exibidos) {
                return res.json({
                    detail: 'Codigos ja haviam sido exibidos.'
                });
            }

            await pool.query(
                'UPDATE perfis SET codigos_exibidos = true WHERE "userId" = $1',
                [req.user.id]
            );

            res.json({
                detail: 'Codigos marcados como exibidos.'
            });
        } catch (e) {
            console.error('Erro ao confirmar codigos:', e);

            res.status(500).json({
                error: String(e)
            });
        }
    });
};

exports.updatePerfil = async (req, res) => {
    auth(req, res, async () => {
        try {
            const {
                salario
            } = req.body || {};

            if (salario === undefined) {
                return res.status(400).json({
                    error: 'salario obrigatorio'
                });
            }

            const result = await pool.query(
                'UPDATE perfis SET salario = $1 WHERE "userId" = $2 RETURNING *',
                [salario, req.user.id]
            );

            res.json({
                detail: 'Salario atualizado',
                perfil: result.rows[0]
            });
        } catch (e) {
            console.error(e);

            res.status(500).json({
                error: String(e)
            });
        }
    });
};

exports.deactivatePerfil = async (req, res) => {
    auth(req, res, async () => {
        try {
            if (!req.user?.id) {
                return res.status(401).json({
                    error: 'Usuario nao autenticado'
                });
            }

            const {
                password
            } = req.body;

            if (!password) {
                return res.status(400).json({
                    error: 'Senha obrigatoria'
                });
            }

            const userQuery = await pool.query(
                'SELECT password FROM auth_user WHERE id = $1',
                [req.user.id]
            );

            if (!userQuery.rowCount) {
                return res.status(404).json({
                    error: 'Usuario nao encontrado'
                });
            }

            const senhaHash = userQuery.rows[0].password;

            if (!senhaHash) {
                return res.status(500).json({
                    error: 'Senha nao cadastrada'
                });
            }

            const passwordMatches = bcrypt.compareSync(password, senhaHash);

            if (!passwordMatches) {
                return res.status(401).json({
                    error: 'Senha incorreta'
                });
            }

            const result = await pool.query(
                'UPDATE auth_user SET is_active = false WHERE id = $1 RETURNING *',
                [req.user.id]
            );

            if (!result.rowCount) {
                return res.status(404).json({
                    error: 'Perfil nao encontrado'
                });
            }

            res.json({
                message: 'Conta desativada com sucesso!'
            });
        } catch (err) {
            console.error('Erro ao desativar conta:', err);

            res.status(500).json({
                error: 'Erro ao desativar conta'
            });
        }
    });
};