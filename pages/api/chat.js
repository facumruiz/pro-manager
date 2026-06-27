// pages/api/chat.js

const MODELS = [
  'poolside/laguna-m.1:free',
  'nvidia/nemotron-3-ultra-550b-a55b:free',
];

function buildSystem(playersContext) {
  return `Sos el asistente de Pro Manager, app de gestión de fútbol.
REGLAS ESTRICTAS:
- Respondé SIEMPRE en español rioplatense, sin excepciones
- Respuestas MUY cortas: 1 a 3 líneas máximo
- Respondé SOLO lo que te preguntaron, nada más
- Al final podés agregar UNA sola sugerencia corta tipo "¿Querés ver sus atributos físicos?" o "¿Comparamos con otro jugador?"
- Nunca des explicaciones de cómo llegaste al resultado
- Nunca pienses en voz alta ni expliques tu razonamiento
- Nunca devuelvas datos crudos del contexto, siempre reformateá la info en lenguaje natural
- Usá nombre y apellido al mencionar jugadores
- Los atributos listados son habilidades que el jugador POSEE
- Si no tenés el dato en la plantilla, decí "No tengo ese dato" — NUNCA inventes información
- Solo podés usar datos que estén explícitamente en la plantilla
- Los únicos datos físicos disponibles son: altura, peso y atributos físicos del array (velocidad, fuerza, resistencia, agilidad, aceleracion, equilibrio, alcanceDeSalto)
- No existe información de color de pelo, ojos, ni ningún dato físico fuera de los mencionados

PLANTILLA (${new Date().getFullYear()}):
${playersContext}`;
}

function cleanReply(text) {
  return text
    .replace(/<think>[\s\S]*?<\/think>/gi, '')
    .replace(/^(Let me|First,|I need to|The user is|Looking at|I'll|To answer)[^\n]*\n?/gim, '')
    .trim();
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { messages, playersContext } = req.body;
  if (!messages?.length || !playersContext) return res.status(400).json({ reply: 'Datos inválidos.' });

  const systemPrompt = buildSystem(playersContext);
  const trimmedMessages = messages.slice(-6);

  for (const model of MODELS) {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: systemPrompt },
            ...trimmedMessages,
          ],
          max_tokens: 400,
          temperature: 0.4,
          top_p: 0.85,
        }),
      });

      const data = await response.json();

      if (data.error || !data.choices?.[0]?.message?.content) {
        console.warn(`[chat] falló:`, data.error?.message || 'sin contenido');
        continue;
      }

      return res.status(200).json({ reply: cleanReply(data.choices[0].message.content) });
    } catch (err) {
      console.warn(`[chat] Error:`, err.message);
      continue;
    }
  }

  res.status(500).json({ reply: 'El asistente no está disponible ahora. Intentá en unos segundos.' });
}
