const {
    getInflacao,
    getCombustivel,
    getEnergia
} = require('../utils/ipea');

// 🔥 pesos mais realistas
function getPesoTipo(tipo) {
    switch (tipo) {
        case 'RECORRENTE':
            return 1.0;
        case 'VARIAVEL':
            return 0.9;
        case 'OCASIONAL':
            return 0.6;
        case 'SAZONAL':
            return 0.8;
        default:
            return 1.0;
    }
}

// 🔥 sensibilidade por categoria
function getSensibilidadeCategoria(categoria) {
    switch (categoria) {
        case 'Transporte':
            return 1.2;
        case 'Alimentação':
            return 1.1;
        case 'Moradia':
            return 1.0;
        case 'Lazer':
            return 0.8;
        default:
            return 1.0;
    }
}

// 🔥 impacto por categoria
async function getImpactosPorCategoria(gastos) {
    const categoriasUnicas = [...new Set(gastos.map(g => g.categoria))];
    const impactos = {};

    await Promise.all(
        categoriasUnicas.map(async (categoria) => {
            try {
                switch (categoria) {
                    case 'Transporte':
                        impactos[categoria] = await getCombustivel();
                        break;

                    case 'Moradia':
                        impactos[categoria] = await getEnergia();
                        break;

                    case 'Alimentação':
                        impactos[categoria] = await getInflacao();
                        break;

                    default:
                        impactos[categoria] = await getInflacao();
                }

                if (!impactos[categoria] || impactos[categoria] < 0.01) {
                    impactos[categoria] = 5;
                }

            } catch (e) {
                console.error('Erro impacto categoria:', categoria, e.message);
                impactos[categoria] = 5;
            }
        })
    );

    return impactos;
}

// 🔥 cálculo principal
async function calcularPrevisao(gastos) {

    if (!gastos || gastos.length === 0) {
        return {
            gastosPrevistos: [],
            impactosPorCategoria: {}
        };
    }

    const impactos = await getImpactosPorCategoria(gastos);

    const resultado = gastos.map((gasto) => {
        const impacto = impactos[gasto.categoria] || 5;
        const peso = getPesoTipo(gasto.tipo);
        const sensibilidade = getSensibilidadeCategoria(gasto.categoria);

        const valor = Number(gasto.valor);

        const base = valor * peso;
        const impactoAjustado = (impacto / 100) * sensibilidade;

        const valorPrevisto = base * (1 + impactoAjustado);

        return {
            ...gasto,
            impacto_percentual: Number(impacto.toFixed(2)),
            valor_previsto: Number(valorPrevisto.toFixed(2))
        };
    });

    return {
        gastosPrevistos: resultado,
        impactosPorCategoria: impactos
    };
}

module.exports = {
    calcularPrevisao
};