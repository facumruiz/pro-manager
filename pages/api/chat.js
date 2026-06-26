// pages/api/chat.js

const MODELS = [
  'nvidia/llama-3.1-nemotron-ultra-253b-v1:free',
  'nvidia/nemotron-3-ultra-550b-a55b:free',
  'openai/gpt-oss-120b:free',
];

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { messages, playersContext } = req.body;

  const SYSTEM = `Eres el asistente inteligente de Pro Manager, una app de gestión de plantilla de fútbol.
Respondé siempre en español, de forma concisa y directa como un analista deportivo.
Usá nombre y apellido al mencionar jugadores.
Los atributos listados son habilidades que el jugador POSEE.
Podés hacer rankings, comparaciones y análisis tácticos.
DATOS DE LOS JUGADORES:
${playersContext}`;

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
          messages: [{ role: 'system', content: SYSTEM }, ...messages],
          max_tokens: 800,
        }),
      });

      const data = await response.json();

      if (data.error || !data.choices?.[0]?.message?.content) {
        console.warn(`Modelo ${model} falló, probando siguiente...`);
        continue;
      }

      return res.status(200).json({ reply: data.choices[0].message.content });
    } catch (err) {
      console.warn(`Error con ${model}:`, err.message);
      continue;
    }
  }

  res.status(500).json({ reply: 'Todos los modelos están saturados, intentá en unos segundos.' });
}
