const pool = require('../utils/db');
const auth = require('../middleware/auth');
const {
    definirTransacaoInteligente
} = require('../services/classificadorService');

//  LISTAR
exports.listGastos = async (req, res) => {
    auth(req, res, async () => {
        try {
            const gastos = await pool.query(
                `SELECT id, categoria, tipo, valor, estabelecimento, "dataGasto", "dataCriacao"
         FROM gastos
         WHERE "userId" = $1
         ORDER BY "dataGasto" DESC`,
                [req.user.id]
            );

            res.json(gastos.rows);
        } catch (e) {
            console.error(e);
            res.status(500).json({
                error: String(e)
            });
        }
    });
};

//  CRIAR
exports.createGastoManual = async (req, res) => {
    auth(req, res, async () => {
        const {
            valor,
            estabelecimento,
            dataGasto,
            categoria,
            tipo
        } = req.body || {};

        if (
            valor === undefined ||
            !estabelecimento ||
            !dataGasto ||
            !categoria ||
            !tipo
        ) {
            return res.status(400).json({
                error: 'Todos os campos são obrigatórios (categoria e tipo inclusos)'
            });
        }

        try {
            const info = await pool.query(
                `INSERT INTO gastos ("userId", categoria, tipo, valor, estabelecimento, "dataGasto", "dataCriacao")
         VALUES ($1, $2, $3, $4, $5, $6, NOW())
         RETURNING id, categoria, tipo, valor, estabelecimento, "dataGasto", "dataCriacao"`,

                [
                    req.user.id,
                    categoria,
                    tipo,
                    valor,
                    estabelecimento,
                    dataGasto
                ]
            );

            res.json(info.rows[0]);
        } catch (e) {
            console.error(e);
            res.status(500).json({
                error: String(e)
            });
        }
    });
};


exports.createGastoIA = async (req, res) => {
    auth(req, res, async () => {
        const {
            valor,
            estabelecimento,
            dataGasto
        } = req.body || {};

        if (valor === undefined || !estabelecimento || !dataGasto) {
            return res.status(400).json({
                error: 'valor, estabelecimento e dataGasto são obrigatórios'
            });
        }

        try {
            const resultado = await definirTransacaoInteligente(
                estabelecimento,
                valor
            );

            const info = await pool.query(
                `INSERT INTO gastos ("userId", categoria, tipo, valor, estabelecimento, "dataGasto", "dataCriacao")
         VALUES ($1, $2, $3, $4, $5, $6, NOW())
         RETURNING id, categoria, tipo, valor, estabelecimento, "dataGasto", "dataCriacao"`,

                [
                    req.user.id,
                    resultado.categoria,
                    resultado.tipo,
                    valor,
                    estabelecimento,
                    dataGasto
                ]
            );

            res.json({
                ...info.rows[0],
                ia: resultado //  opcional (debug / UX)
            });

        } catch (e) {
            console.error(e);
            res.status(500).json({
                error: String(e)
            });
        }
    });
};


//  BUSCAR POR ID
exports.getGasto = async (req, res) => {
    auth(req, res, async () => {
        try {
            const gasto = await pool.query(
                `SELECT id, categoria, tipo, valor, estabelecimento, "dataGasto", "dataCriacao"
         FROM gastos
         WHERE id = $1 AND "userId" = $2`,
                [req.params.id, req.user.id]
            );

            if (!gasto.rows[0]) {
                return res.status(404).json({
                    error: 'Not found'
                });
            }

            res.json(gasto.rows[0]);
        } catch (e) {
            console.error(e);
            res.status(500).json({
                error: String(e)
            });
        }
    });
};

exports.getGastosMesAtual = async (req, res) => {
    auth(req, res, async () => {
        try {
            const gastos = await pool.query(
                `
        SELECT id, categoria, tipo, valor, estabelecimento, "dataGasto", "dataCriacao"
        FROM gastos
        WHERE "userId" = $1
        AND DATE_TRUNC('month', "dataGasto") = DATE_TRUNC('month', CURRENT_DATE)
        ORDER BY "dataGasto" DESC
        `,
                [req.user.id]
            );

            res.json(gastos.rows);
        } catch (e) {
            console.error(e);
            res.status(500).json({
                error: String(e)
            });
        }
    });
};

//  ATUALIZAR
exports.updateGasto = async (req, res) => {
    auth(req, res, async () => {
        const {
            categoria,
            tipo,
            valor,
            estabelecimento,
            dataGasto
        } = req.body || {};

        try {
            const gastoRow = await pool.query(
                'SELECT * FROM gastos WHERE id = $1 AND "userId" = $2',
                [req.params.id, req.user.id]
            );

            if (!gastoRow.rows[0]) {
                return res.status(404).json({
                    error: 'Not found'
                });
            }

            const atual = gastoRow.rows[0];

            const newCategoria = categoria || atual.categoria;
            const newTipo = tipo || atual.tipo;
            const newValor = (valor === undefined) ? atual.valor : valor;
            const newEstabelecimento = estabelecimento || atual.estabelecimento;
            const newDataGasto = dataGasto || atual.dataGasto;

            await pool.query(
                `UPDATE gastos
         SET categoria = $1,
             tipo = $2,
             valor = $3,
             estabelecimento = $4,
             "dataGasto" = $5
         WHERE id = $6`,
                [newCategoria, newTipo, newValor, newEstabelecimento, newDataGasto, req.params.id]
            );

            const gasto = await pool.query(
                `SELECT id, categoria, tipo, valor, estabelecimento, "dataGasto", "dataCriacao"
         FROM gastos
         WHERE id = $1`,
                [req.params.id]
            );

            res.json(gasto.rows[0]);
        } catch (e) {
            console.error(e);
            res.status(500).json({
                error: String(e)
            });
        }
    });
};

//  DELETAR
exports.deleteGasto = async (req, res) => {
    auth(req, res, async () => {
        try {
            const gastoRow = await pool.query(
                'SELECT * FROM gastos WHERE id = $1 AND "userId" = $2',
                [req.params.id, req.user.id]
            );

            if (!gastoRow.rows[0]) {
                return res.status(404).json({
                    error: 'Not found'
                });
            }

            await pool.query('DELETE FROM gastos WHERE id = $1', [req.params.id]);

            res.json({
                status: 'deleted'
            });
        } catch (e) {
            console.error(e);
            res.status(500).json({
                error: String(e)
            });
        }
    });
};