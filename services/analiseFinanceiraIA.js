const axios = require("axios");

// 🔥 extrai JSON mesmo se vier sujo
function extrairJSON(texto) {
    try {
        const first = texto.indexOf('{');
        const last = texto.lastIndexOf('}');

        if (first === -1 || last === -1) return null;

        const jsonString = texto.slice(first, last + 1);
        return JSON.parse(jsonString);
    } catch {
        return null;
    }
}

// 🔥 valida estrutura mínima e regras de negócio
function validarResposta(json) {
    if (!json || !json.resumo || !json.insights || !json.sugestoes) return false;

    // Valida limites de estrutura (Regra 8)
    if (json.insights.length < 1 || json.insights.length > 4) return false;
    if (json.sugestoes.length < 2 || json.sugestoes.length > 3) return false;

    return true;
}

async function analisarFinanceiro(contexto) {
    const prompt = `
Você é um Analista Financeiro de Alta Performance. Sua tarefa é gerar uma análise técnica e ultra-específica.

--- 🧠 REGRAS DE OURO (CONTROLE DE QUALIDADE) ---
1. PROIBIDO: Frases vagas ("é importante"), conselhos óbvios ("economize"), ou repetição de números sem contexto.
2. OBRIGATÓRIO: Cada frase deve trazer informação nova e densa.
3. EXPLICAÇÃO: Nunca diga apenas "subiu" ou "desceu". Explique o PORQUÊ (comportamento, impacto de inflação/combustível ou sazonalidade).
4. TOM: Profissional, analítico e direto. Sem linguagem motivacional ou tom de coach.
5. DADOS: Use explicitamente as categorias, impactos econômicos e tipos de gasto (recorrente vs variável).

--- 📊 CAMADA DE INTELIGÊNCIA FINANCEIRA ---
- Identifique concentração excessiva em categorias únicas (risco).
- Avalie a instabilidade gerada por excesso de gastos variáveis.
- Identifique dependência de locais específicos ou padrões de consumo.

--- 🚫 RESTRIÇÕES TÉCNICAS CRÍTICAS ---
- Responda APENAS o JSON.
- NÃO use markdown (\`\`\`json).
- NÃO escreva explicações antes ou depois.
- Use frases curtas e densas (máximo 2 linhas por insight).
- NÃO sugira valores numéricos ou percentuais que não estejam nos dados

--- 🏗️ ESTRUTURA FORÇADA ---
- "insights": entre 2 e 4 itens (focados em padrões e riscos).
- "sugestoes": entre 2 e 3 itens (práticos, aplicáveis e diferentes entre si).

INTERPRETAÇÃO DOS TIPOS:
- RECORRENTE: gasto fixo e previsível
- VARIAVEL: gasto instável e sensível a comportamento
- SAZONAL: gasto pontual, não recorrente
- OCASIONAL: evento isolado

Não confundir tipo com valor numérico.

FORMATO OBRIGATÓRIO:
{
  "resumo": {
    "situacao": "alta | queda | estavel",
    "mensagem": "Explicação técnica da causa raiz",
    "impacto_percentual": número
  },
  "insights": ["string simples", "string simples"],
  "sugestoes": ["string simples", "string simples"]
}

DADOS DE ENTRADA:
${JSON.stringify(contexto, null, 2)}
`;

    try {
        const response = await axios.post("http://localhost:11434/api/generate", {
            model: "llama3",
            prompt,
            stream: false,
            options: {
                temperature: 0.1, // Reduzido para 0.1 para máxima precisão e aderência ao JSON
                num_predict: 1000
            }
        });

        const texto = response.data.response;
        console.log("🧠 IA BRUTA:", texto);

        const json = extrairJSON(texto);

        if (!validarResposta(json)) {
            throw new Error("Resposta fora dos padrões de qualidade ou estrutura");
        }

        return json;

    } catch (e) {
        console.error("Erro IA análise:", e.message);
        return {
            resumo: {
                situacao: "erro",
                mensagem: "Falha na análise técnica",
                impacto_percentual: 0
            },
            insights: ["Análise indisponível no momento"],
            sugestoes: ["Verificar logs do sistema"]
        };
    }
}

module.exports = {
    analisarFinanceiro
};