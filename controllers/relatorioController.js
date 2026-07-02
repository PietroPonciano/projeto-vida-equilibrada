const auth = require('../middleware/auth');
const {
    analisarFinanceiro
} = require('../services/analiseFinanceiraIA');
const {
    calcularPrevisao
} = require('../services/previsaoService');
const pool = require('../utils/db');
const pdfUtil = require('../utils/pdf');

function normalizarLista(lista, chave) {
    if (!Array.isArray(lista)) return [];

    return lista
        .map((item) => {
            if (typeof item === 'string') return item;
            if (typeof item === 'object' && item[chave]) return item[chave];
            return null;
        })
        .filter(Boolean);
}

function getMesRange(ano, mes) {
    const start = new Date(ano, mes - 1, 1).toISOString().slice(0, 10);
    const end = new Date(ano, mes, 0).toISOString().slice(0, 10);

    return {
        start,
        end
    };
}

function gerarAlerta(stats) {
    const {
        total,
        recorrente,
        variavel,
        sazonal,
        maiorCategoria,
        maiorLocal
    } = stats;

    const mensagens = [];
    const percentualRecorrente = total > 0 ? (recorrente / total) * 100 : 0;

    if (percentualRecorrente > 50) {
        mensagens.push('Seus gastos recorrentes estao altos e merecem atencao.');
    }

    if (variavel > recorrente) {
        mensagens.push('Voce esta gastando mais em despesas variaveis do que fixas.');
    }

    if (sazonal > 0 && sazonal / total > 0.3) {
        mensagens.push('Grande parte dos gastos foi sazonal, isso nao deve se repetir no proximo mes.');
    }

    if (maiorCategoria) {
        mensagens.push(`Sua maior categoria de gasto foi ${maiorCategoria}.`);
    }

    if (maiorLocal) {
        mensagens.push(`O local onde voce mais gastou foi ${maiorLocal}.`);
    }

    return mensagens.join(' ');
}

function somarRelatorio(gastosPrevistos) {
    const totais = {
        total: 0,
        totalPrevisto: 0,
        recorrente: 0,
        variavel: 0,
        ocasional: 0,
        sazonal: 0,
        maiorCategoria: null,
        maiorLocal: null
    };

    const categoriaMap = {};
    const localMap = {};
    let maiorGastoCategoria = 0;

    for (const gasto of gastosPrevistos) {
        const valor = Number(gasto.valor);
        const previsto = Number(gasto.valor_previsto || 0);

        totais.total += valor;
        totais.totalPrevisto += previsto;

        if (gasto.tipo === 'RECORRENTE') totais.recorrente += valor;
        if (gasto.tipo === 'VARIAVEL') totais.variavel += valor;
        if (gasto.tipo === 'OCASIONAL') totais.ocasional += valor;
        if (gasto.tipo === 'SAZONAL') totais.sazonal += valor;

        categoriaMap[gasto.categoria] = (categoriaMap[gasto.categoria] || 0) + valor;
        localMap[gasto.estabelecimento] = (localMap[gasto.estabelecimento] || 0) + valor;

        if (categoriaMap[gasto.categoria] > maiorGastoCategoria) {
            maiorGastoCategoria = categoriaMap[gasto.categoria];
            totais.maiorCategoria = gasto.categoria;
        }
    }

    let maiorLocalValor = 0;

    for (const [local, valor] of Object.entries(localMap)) {
        if (valor > maiorLocalValor) {
            maiorLocalValor = valor;
            totais.maiorLocal = local;
        }
    }

    const categorias = Object.entries(categoriaMap).map(([categoria, valor]) => ({
        categoria,
        total: valor,
        percentual: (totais.total > 0 ? (valor / totais.total) * 100 : 0).toFixed(2)
    }));

    return {
        ...totais,
        categorias
    };
}

async function gerarRelatorio(userId, ano, mes) {
    const {
        start,
        end
    } = getMesRange(ano, mes);

    const gastosRes = await pool.query(
        `SELECT categoria, tipo, estabelecimento, valor
         FROM gastos
         WHERE "userId" = $1 AND "dataGasto" BETWEEN $2 AND $3`,
        [userId, start, end]
    );

    const {
        gastosPrevistos,
        impactosPorCategoria
    } = await calcularPrevisao(gastosRes.rows);

    const resumo = somarRelatorio(gastosPrevistos);
    const alerta = gerarAlerta(resumo);

    return {
        ano,
        mes,
        ...resumo,
        alerta,
        gastosPrevistos,
        impactosPorCategoria
    };
}

exports.getRelatorio = async (req, res) => {
    auth(req, res, async () => {
        try {
            const ano = parseInt(req.query.ano, 10) || new Date().getFullYear();
            const mes = parseInt(req.query.mes, 10) || new Date().getMonth() + 1;
            const relatorio = await gerarRelatorio(req.user.id, ano, mes);

            res.json(relatorio);
        } catch (e) {
            console.error(e);

            res.status(500).json({
                error: String(e)
            });
        }
    });
};

exports.getPrevisao = async (req, res) => {
    auth(req, res, async () => {
        try {
            const ano = new Date().getFullYear();
            const mes = new Date().getMonth() + 1;
            const relatorio = await gerarRelatorio(req.user.id, ano, mes);

            const totalAtual = Number(relatorio.total.toFixed(2));
            const totalPrevisto = Number(relatorio.totalPrevisto.toFixed(2));
            const diferenca = totalPrevisto - totalAtual;
            const percentual = totalAtual > 0 ? (diferenca / totalAtual) * 100 : 0;
            const percentualFinal = Number(percentual.toFixed(2));

            const contextoIA = {
                totalAtual,
                totalPrevisto,
                diferenca,
                percentual: percentualFinal,
                maiorCategoria: relatorio.maiorCategoria,
                maiorLocal: relatorio.maiorLocal,
                categorias: relatorio.categorias,
                tipos: {
                    recorrente: relatorio.recorrente,
                    variavel: relatorio.variavel,
                    ocasional: relatorio.ocasional,
                    sazonal: relatorio.sazonal
                },
                impactos: relatorio.impactosPorCategoria,
                distribuicaoVariavel: totalAtual > 0 ?
                    Number((relatorio.variavel / totalAtual).toFixed(2)) : 0
            };

            const analiseIA = await analisarFinanceiro(contextoIA);
            const insights = normalizarLista(analiseIA?.insights, 'insight');
            const sugestoes = normalizarLista(analiseIA?.sugestoes, 'sugestao');

            res.json({
                totalAtual,
                totalPrevisto,
                resumo: analiseIA?.resumo || {
                    situacao: diferenca > 0 ? 'alta' : diferenca < 0 ? 'queda' : 'estavel',
                    mensagem: 'Nao foi possivel gerar analise detalhada.',
                    impacto_percentual: percentualFinal
                },
                insights: insights.length ? insights : [
                    'Nao foi possivel gerar insights no momento.'
                ],
                sugestoes: sugestoes.length ? sugestoes : [
                    'Tente revisar seus gastos manualmente.'
                ]
            });
        } catch (e) {
            console.error(e);

            res.status(500).json({
                error: String(e)
            });
        }
    });
};

exports.getRelatorioPdf = async (req, res) => {
    auth(req, res, async () => {
        try {
            const ano = parseInt(req.params.ano, 10);
            const mes = parseInt(req.params.mes, 10);
            const relatorio = await gerarRelatorio(req.user.id, ano, mes);

            pdfUtil.createRelatorioPdf(res, ano, mes, req.user, relatorio);
        } catch (e) {
            console.error(e);

            res.status(500).json({
                error: String(e)
            });
        }
    });
};