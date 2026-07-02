const axios = require('axios');

function validarTransacao(t) {

    if (!t) return false;

    if (!t.data) return false;

    if (!t.descricao) return false;

    if (typeof t.valor !== 'number') return false;

    return true;
}

async function extrairTransacoesPDF(texto) {

    const prompt = `
Você é um extrator EXTREMAMENTE preciso de extratos bancários.

Extraia todas as transações financeiras presentes no texto abaixo.

REGRAS:
- Retorne SOMENTE JSON
- Não explique nada
- Não escreva texto adicional
- Ignore saldos
- Ignore cabeçalhos
- Ignore rodapés
- Ignore páginas
- Ignore linhas sem valor financeiro
- Valores negativos representam despesas
- Valores positivos representam entradas

Formato obrigatório:

[
  {
    "data": "YYYY-MM-DD",
    "descricao": "",
    "valor": 0
  }
]

TEXTO DO PDF:

${texto}
`;

    const response = await axios.post(
        'http://localhost:11434/api/generate', {
            model: 'llama3',
            prompt,
            stream: false
        }
    );

    try {

        const respostaIA = response.data.response;

        const jsonMatch = respostaIA.match(/\[[\s\S]*\]/);

        if (!jsonMatch) {
            throw new Error('JSON não encontrado');
        }

        const transacoes = JSON.parse(jsonMatch[0]);

        if (!Array.isArray(transacoes)) {
            throw new Error('Formato inválido');
        }

        return transacoes.filter(validarTransacao);

    } catch (e) {

        console.log('Erro ao extrair transações PDF');
        console.log(response.data.response);

        return [];
    }
}

module.exports = {
    extrairTransacoesPDF
};