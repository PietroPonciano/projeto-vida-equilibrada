const axios = require('axios');

const CACHE_TTL = 1000 * 60 * 60; // 1 hora
const cache = {};

//  normaliza valores da API
function normalizarValor(valor) {
    let v = Number(valor || 0);

    if (v > 0 && v < 0.01) {
        v = v * 100;
    }

    if (!v || v < 0.01) {
        v = 5; // fallback
    }

    return v;
}

//  fetch base com cache
async function fetchIPEA(codigo) {
    const now = Date.now();

    if (cache[codigo] && now - cache[codigo].timestamp < CACHE_TTL) {
        return cache[codigo].value;
    }

    try {
        const response = await axios.get(
            `http://ipeadata.gov.br/api/odata4/ValoresSerie(SERCODIGO='${codigo}')?$top=1&$orderby=DATA desc`
        );

        const raw = response.data.value[0]?.VALVALOR;
        const valor = normalizarValor(raw);

        cache[codigo] = {
            value: valor,
            timestamp: now
        };

        return valor;

    } catch (e) {
        console.error(`Erro IPEA (${codigo}):`, e.message);
        return 5;
    }
}

// -----------------------------
//  INDICADORES BASE
// -----------------------------

async function getInflacao() {
    return fetchIPEA('PRECOS12_IPCA12');
}

// (placeholder - depois você troca por códigos reais)
async function getCombustivel() {
    return fetchIPEA('PRECOS12_IPCA12');
}

async function getEnergia() {
    return fetchIPEA('PRECOS12_IPCA12');
}

// -----------------------------
//  NOVO: IMPACTO INTELIGENTE
// -----------------------------

async function getImpactoPorGasto(gasto) {
    let impacto = 0;

    //  impacto por categoria
    switch (gasto.categoria) {
        case 'Transporte':
            impacto = await getCombustivel();
            break;

        case 'Moradia':
            impacto = await getEnergia();
            break;

        default:
            impacto = await getInflacao();
    }

    //  ajuste por tipo (seu novo modelo)
    let fatorTipo = 1;

    switch (gasto.tipo) {
        case 'RECORRENTE':
            fatorTipo = 1.0;
            break;

        case 'VARIAVEL':
            fatorTipo = 0.8;
            break;

        case 'OCASIONAL':
            fatorTipo = 0.5;
            break;

        case 'SAZONAL':
            fatorTipo = 1.2;
            break;
    }

    return impacto * fatorTipo;
}

module.exports = {
    getInflacao,
    getCombustivel,
    getEnergia,
    getImpactoPorGasto
};