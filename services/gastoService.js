const pool = require('../utils/db');
const {
    definirTransacaoInteligente
} = require('./classificadorService');

async function criarGastoIA({
    userId,
    valor,
    estabelecimento,
    dataGasto,
    hash,
    cacheIA
}) {
    let resultado;

    if (cacheIA.has(estabelecimento)) {
        resultado = cacheIA.get(estabelecimento);
    } else {
        resultado = await definirTransacaoInteligente(estabelecimento, valor);
        cacheIA.set(estabelecimento, resultado);
    }

    const res = await pool.query(
        `INSERT INTO gastos 
    ("userId", categoria, tipo, valor, estabelecimento, "dataGasto", "dataCriacao", hash)
     VALUES ($1,$2,$3,$4,$5,$6,NOW(),$7)
     ON CONFLICT (hash) DO NOTHING
     RETURNING id`,
        [
            userId,
            resultado.categoria,
            resultado.tipo,
            valor,
            estabelecimento,
            dataGasto,
            hash
        ]
    );

    return res.rowCount > 0;
}

module.exports = {
    criarGastoIA
};