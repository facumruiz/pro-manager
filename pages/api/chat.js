// pages/api/chat.js

const MODELS = [
  'nvidia/llama-3.1-nemotron-ultra-253b-v1:free',
  'nvidia/nemotron-3-ultra-550b-a55b:free',
  'openai/gpt-oss-120b:free',
  'meta-llama/llama-3.1-8b-instruct:free',
];

// System prompt compacto — menos tokens = respuesta más rápida
function buildSystem(playersContext) {
  return `Sos el asistente de Pro Manager, app de gestión de fútbol.
REGLAS ESTRICTAS:
- Respondé SIEMPRE en español rioplatense, sin excepciones
- Respuestas cortas y directas (máximo 5 líneas salvo que pidan un ranking)
- Nunca traduzcas nombres de atributos (ya están en español)
- Usá nombre y apellido al mencionar jugadores
- Los atributos listados son habilidades que el jugador POSEE
- No expliques cómo llegaste a la respuesta, solo dá el resultado

PLANTILLA (${new Date().getFullYear()}):
${playersContext}`;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { messages, playersContext } = req.body;
  if (!messages?.length || !playersContext) return res.status(400).json({ reply: 'Datos inválidos.' });

  const systemPrompt = buildSystem(playersContext);

  for (const model of MODELS) {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages,
          ],
          max_tokens: 600,        // reducido para respuestas más rápidas
          temperature: 0.4,       // menos temperatura = menos "pensamiento"
          top_p: 0.85,
        }),
      });

      const data = await response.json();

      if (data.error || !data.choices?.[0]?.message?.content) {
        console.warn(`[chat] ${model} falló:`, data.error?.message || 'sin contenido');
        continue;
      }

      return res.status(200).json({ reply: data.choices[0].message.content });
    } catch (err) {
      console.warn(`[chat] Error con ${model}:`, err.message);
      continue;
    }
  }

  res.status(500).json({ reply: 'Todos los modelos están ocupados ahora. Intentá en unos segundos.' });
}
