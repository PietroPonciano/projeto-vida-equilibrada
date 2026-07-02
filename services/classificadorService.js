const {
    classificarTransacao
} = require('./ia');

const regras = [

    {
        match: [
            'uber',
            '99',
            'combustivel'
        ],
        categoria: 'Transporte'
    },

    {
        match: [
            'ifood',
            'restaurante',
            'lanchonete'
        ],
        categoria: 'Alimentação'
    },

    {
        match: [
            'farmacia',
            'hospital'
        ],
        categoria: 'Saúde'
    },

    {
        match: [
            'netflix',
            'spotify'
        ],
        categoria: 'Lazer'
    },

    {
        match: [
            'fiap',
            'faculdade',
            'universidade'
        ],
        categoria: 'Educação'
    }
];

async function definirTransacaoInteligente(
    descricao,
    valor
) {

    const desc =
        descricao.toLowerCase();

    // regras rápidas
    for (const r of regras) {

        const encontrou =
            r.match.some(p =>
                desc.includes(p)
            );

        if (encontrou) {

            return {
                categoria: r.categoria,
                tipo: 'VARIAVEL',
                fonte: 'regra',
                confianca: 100
            };
        }
    }

    // IA
    console.log(
        "IA classificando:",
        descricao
    );

    const ia =
        await classificarTransacao(
            descricao,
            valor
        );

    return {
        categoria: ia.categoria,
        tipo: ia.tipo,
        fonte: 'ia',
        confianca: ia.confianca
    };
}

module.exports = {
    definirTransacaoInteligente
};