const axios = require("axios");

function normalizarTipo(tipoIA) {

    if (!tipoIA) return null;

    const t = tipoIA.toUpperCase();

    if (t.includes('RECOR')) {
        return 'RECORRENTE';
    }

    if (t.includes('VAR')) {
        return 'VARIAVEL';
    }

    if (t.includes('OCAS')) {
        return 'OCASIONAL';
    }

    if (t.includes('SAZON')) {
        return 'SAZONAL';
    }

    return null;
}

async function classificarTransacao(
    descricao,
    valor
) {

    const prompt = `
Você é um classificador financeiro.

Classifique a transação abaixo.

DESCRIÇÃO:
"${descricao}"

VALOR:
${valor}

REGRAS IMPORTANTES:

- Faculdade, escola, curso -> Educação
- Uber, 99, combustível -> Transporte
- Ifood, restaurante -> Alimentação
- Netflix, Spotify -> Lazer
- Farmácia, hospital -> Saúde
- Salário -> Outros
- PIX para pessoas -> Outros
- Fatura cartão -> Outros

TIPOS:

- RECORRENTE:
contas mensais, assinaturas, aluguel

- VARIAVEL:
alimentação, transporte diário

- OCASIONAL:
compras incomuns

- SAZONAL:
impostos, matrícula, viagens

Responda SOMENTE JSON:

{
  "categoria": "",
  "tipo": "",
  "confianca": 0
}
`;

    try {

        const response = await axios.post(
            "http://localhost:11434/api/generate", {
                model: "llama3",
                prompt,
                stream: false
            }
        );

        const texto = response.data.response;

        const jsonMatch =
            texto.match(/\{[\s\S]*?\}/);

        if (!jsonMatch) {
            throw new Error("JSON inválido");
        }

        const data =
            JSON.parse(jsonMatch[0]);

        return {
            categoria: data.categoria || 'Outros',

            tipo: normalizarTipo(data.tipo) ||
                'VARIAVEL',

            confianca: Number(data.confianca) || 70
        };

    } catch (e) {

        console.log(
            "Erro IA:",
            e.message
        );

        return {
            categoria: "Outros",
            tipo: "VARIAVEL",
            confianca: 50
        };
    }
}

module.exports = {
    classificarTransacao
};