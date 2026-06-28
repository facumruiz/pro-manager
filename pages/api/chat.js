// pages/api/chat.js
// ── MODELOS CON FALLBACK AUTOMÁTICO ─────────────────────
// Si el primero falla o está saturado, se prueba el siguiente
const MODELS = [
  'poolside/laguna-m.1:free',
  'nvidia/nemotron-3-ultra-550b-a55b:free',
];

// ── SYSTEM PROMPT ────────────────────────────────────────
// Contexto compacto para reducir tokens y mejorar velocidad
function buildSystem(playersContext) {
  return `Sos el asistente de Pro Manager, app de gestión de fútbol.
REGLAS ESTRICTAS:
- Respondé SIEMPRE en español rioplatense, sin excepciones
- Respuestas MUY cortas: 1 a 3 líneas máximo
- Respondé SOLO lo que te preguntaron, nada más
- Al final podés agregar UNA sola sugerencia corta
- Nunca des explicaciones de cómo llegaste al resultado
- Nunca pienses en voz alta ni expliques tu razonamiento
- Nunca devuelvas datos crudos del contexto, siempre reformateá en lenguaje natural
- Usá nombre y apellido al mencionar jugadores
- Los atributos listados son habilidades que el jugador POSEE
- Si no tenés el dato en la plantilla, decí "No tengo ese dato" — NUNCA inventes información
- Solo podés usar datos que estén explícitamente en la plantilla
- Los únicos datos físicos disponibles son: altura, peso y atributos físicos del array
- No existe información de color de pelo, ojos, ni ningún dato fuera de la plantilla

COMPARACIÓN DE JUGADORES:
- Cuando el usuario quiera comparar dos jugadores, generá un link Markdown así:
  [Ver comparación →](/comparador?a=ID_A&b=ID_B)
- Usá los _id exactos que aparecen entre corchetes al inicio de cada línea, ej: [p1], [p9]
- El link debe ir en una línea separada al final de tu respuesta

PLANTILLA (${new Date().getFullYear()}):
${playersContext}`;
}

// ── LIMPIEZA DE RESPUESTA ────────────────────────────────
// Elimina razonamiento interno que algunos modelos muestran en voz alta
function cleanReply(text) {
  return text
    .replace(/<think>[\s\S]*?<\/think>/gi, '')
    .replace(/^(Let me|First,|I need to|The user is|Looking at|I'll|To answer)[^\n]*\n?/gim, '')
    .trim();
}

// ── HANDLER PRINCIPAL ────────────────────────────────────
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { messages, playersContext } = req.body;
  if (!messages?.length || !playersContext) return res.status(400).json({ reply: 'Datos inválidos.' });

  const systemPrompt = buildSystem(playersContext);

  // Solo los últimos 6 mensajes para mantener el foco del system prompt
  const trimmedMessages = messages.slice(-6);

  // ── FALLBACK ENTRE MODELOS ─────────────────────────────
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
          max_tokens: 400,      // respuestas cortas = más rápido
          temperature: 0.4,     // menos creatividad = más preciso
          top_p: 0.85,
        }),
      });

      const data = await response.json();

      if (data.error || !data.choices?.[0]?.message?.content) {
        console.warn(`[chat] ${model} falló:`, data.error?.message || 'sin contenido');
        continue;
      }

      return res.status(200).json({ reply: cleanReply(data.choices[0].message.content) });
    } catch (err) {
      console.warn(`[chat] Error con ${model}:`, err.message);
      continue;
    }
  }

  // Todos los modelos fallaron
  res.status(500).json({ reply: 'El asistente no está disponible ahora. Intentá en unos segundos.' });
}
