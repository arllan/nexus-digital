// Netlify Function — Proxy seguro para OpenAI API
// A chave de API fica no servidor (variável de ambiente), nunca exposta no frontend

const SYSTEM_PROMPT = `Você é o Assistente Virtual da Nexus Digital, uma agência de serviços digitais brasileira.
Responda SEMPRE em português do Brasil. Seja simpático, profissional e objetivo. Use emojis com moderação.
Serviços: Criação de Sites, Marketing Digital, Gestão de Redes Sociais, Automação com IA, Automação de Processos, Consultoria Digital.
Contato: (11) 99999-0000 | contato@nexusdigital.com.br. Atendimento remoto em todo o Brasil.
Prazos: sites simples 7-10 dias, e-commerce 15-25 dias, automações 5-15 dias.
Não invente preços — diga que variam por projeto e incentive o contato.
Mantenha respostas curtas (máximo 5 linhas) a menos que o usuário peça mais detalhes.`;

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Método não permitido.' }) };
  }

  const API_KEY = process.env.OPENAI_API_KEY;
  if (!API_KEY) {
    return { statusCode: 500, body: JSON.stringify({ error: 'API Key não configurada no servidor.' }) };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Body inválido.' }) };
  }

  const { message, history } = body;
  if (!message) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Mensagem não informada.' }) };
  }

  // Monta o histórico no formato OpenAI
  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...(history || []).map(({ role, text }) => ({
      role: role === 'model' ? 'assistant' : 'user',
      content: text,
    })),
    { role: 'user', content: message },
  ];

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        max_tokens: 512,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI error:', errorData);
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: 'Erro ao chamar a API da OpenAI.', details: errorData }),
      };
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content ?? 'Não consegui gerar uma resposta. Tente novamente!';

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    };
  } catch (err) {
    console.error('Erro interno:', err);
    return { statusCode: 500, body: JSON.stringify({ error: 'Erro interno do servidor.' }) };
  }
};
