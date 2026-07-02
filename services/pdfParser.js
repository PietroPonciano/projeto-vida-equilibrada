const pdf = require('pdf-parse');

function extrairTransacoes(texto) {

    const linhas = texto.split('\n');

    const transacoes = [];

    for (let linha of linhas) {

        linha = linha.trim();

        if (!linha) continue;

        // ignora saldo
        if (
            linha.includes('SALDO DO DIA')
        ) {
            continue;
        }

        // precisa começar com data
        const dataMatch =
            linha.match(
                /^(\d{2}\/\d{2}\/\d{4})/
            );

        if (!dataMatch) continue;

        const data = dataMatch[1];

        // pega último valor da linha
        const valorMatch =
            linha.match(
                /(-?[\d\.]+,\d{2})$/
            );

        if (!valorMatch) continue;

        const valorStr =
            valorMatch[1];

        const valor = Number(

            valorStr
            .replace(/\./g, '')
            .replace(',', '.')
        );

        // remove data do início
        let descricao = linha.replace(
            data,
            ''
        );

        // remove valor do final
        descricao = descricao.replace(
            valorStr,
            ''
        );

        descricao = descricao.trim();

        transacoes.push({
            data,
            descricao,
            valor
        });
    }

    return transacoes;
}

async function parsePDF(buffer) {

    const data =
        await pdf(buffer);

    const texto = data.text;

    return extrairTransacoes(texto);
}

module.exports = {
    parsePDF
};