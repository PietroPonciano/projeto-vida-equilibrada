const crypto = require('crypto');

const auth = require('../middleware/auth');
const {
    parseCSV
} = require('../services/csvParser');
const {
    parsePDF
} = require('../services/pdfParser');
const {
    criarGastoIA
} = require('../services/gastoService');

function gerarHash(gasto) {
    return crypto
        .createHash('md5')
        .update(`${gasto.userId}-${gasto.valor}-${gasto.dataGasto}-${gasto.estabelecimento}`)
        .digest('hex');
}

function parseData(data) {
    if (!data) return null;
    if (data.includes('-')) return data;

    const [dia, mes, ano] = data.split('/');
    return `${ano}-${mes}-${dia}`;
}

function limparDescricao(desc) {
    if (!desc) return '';

    return desc
        .toLowerCase()
        .replace(/[^a-z0-9 ]/gi, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

async function extrairTransacoes(file) {
    const ext = file.originalname.split('.').pop().toLowerCase();

    if (ext === 'csv') {
        return parseCSV(file.buffer);
    }

    if (ext === 'pdf') {
        return parsePDF(file.buffer);
    }

    return null;
}

exports.importarExtrato = async (req, res) => {
    auth(req, res, async () => {
        try {
            const file = req.file;
            const userId = req.user.id;

            if (!file) {
                return res.status(400).json({
                    erro: 'Arquivo nao enviado'
                });
            }

            const transacoes = await extrairTransacoes(file);

            if (!transacoes) {
                return res.status(400).json({
                    erro: 'Formato nao suportado'
                });
            }

            let inseridos = 0;
            const cacheIA = new Map();

            for (const transacao of transacoes) {
                if (transacao.valor == null || transacao.valor >= 0) {
                    continue;
                }

                const valor = Math.abs(transacao.valor);
                const dataGasto = parseData(transacao.data);
                const estabelecimento = limparDescricao(transacao.descricao);

                if (!dataGasto || !estabelecimento) {
                    continue;
                }

                const hash = gerarHash({
                    userId,
                    valor,
                    dataGasto,
                    estabelecimento
                });

                const inserido = await criarGastoIA({
                    userId,
                    valor,
                    estabelecimento,
                    dataGasto,
                    hash,
                    cacheIA
                });

                if (inserido) {
                    inseridos++;
                }
            }

            res.json({
                total: transacoes.length,
                novos: inseridos
            });
        } catch (err) {
            console.error(err);

            res.status(500).json({
                erro: err.message,
                stack: err.stack
            });
        }
    });
};