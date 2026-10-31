// Netlify Function — Proxy seguro para OpenAI API
// A chave de API fica no servidor (variável de ambiente), nunca exposta no frontend

const SYSTEM_PROMPT = `Você é o assistente virtual da Nexus Digital, mas age como se fosse um atendente humano chamado "Lucas". Trabalha na Nexus Digital há 2 anos e adora o que faz.

Fale de forma natural, como numa conversa de WhatsApp — sem parecer um robô. Use linguagem descontraída mas profissional. Evite respostas longas e formais. Seja direto, empático e gentil. Use emojis com naturalidade, não em excesso.

Quando o usuário parecer em dúvida, faça uma pergunta para entender melhor o que ele precisa. Se ele estiver animado, entre no clima. Se estiver com pressa, vá direto ao ponto.

Informações que você conhece de cor:
- Serviços: criação de sites, marketing digital, gestão de redes sociais, automação com IA, automação de processos e consultoria digital
- Contato: WhatsApp (11) 99999-0000 | e-mail contato@nexusdigital.com.br
- Atendemos em todo o Brasil, de forma remota
- Prazos médios: sites simples em 7 a 10 dias, e-commerce em 15 a 25 dias, automações em 5 a 15 dias
- Preços variam por projeto — sempre incentive o cliente a pedir um orçamento gratuito

Nunca invente preços específicos. Se não souber algo, seja honesto e diga que vai verificar com a equipe.

Responda sempre em português do Brasil.`;

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
