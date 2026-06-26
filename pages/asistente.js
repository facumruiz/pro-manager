import { useState, useRef, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { mockPlayers } from '../data/players';
import ReactMarkdown from 'react-markdown';
import styles from '../styles/Asistente.module.css';

function calcAge(dob) {
  const b = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - b.getFullYear();
  if (today.getMonth() < b.getMonth() ||
    (today.getMonth() === b.getMonth() && today.getDate() < b.getDate())) age--;
  return age;
}

function buildContext(players) {
  return players.map(p => {
    const age = calcAge(p.datosPersonales.fechaNacimiento);
    const allAttrs = [];
    ['tecnico', 'fisico', 'mental'].forEach(cat => {
      Object.entries(p.atributos?.[cat] || {}).forEach(([k, v]) => { if (v) allAttrs.push(k); });
    });
    const totalAttrs = ['tecnico', 'fisico', 'mental'].reduce((acc, cat) =>
      acc + Object.values(p.atributos?.[cat] || {}).length, 0);
    return `- ${p.datosPersonales.nombre} ${p.datosPersonales.apellido} | Pos: ${p.perfilFutbolistico.posicionNatural} | Estado: ${p.perfilFutbolistico.estado} | Edad: ${age}a (nac: ${p.datosPersonales.fechaNacimiento}) | Nac: ${p.datosPersonales.primeraNacionalidad} | Perfil: ${p.perfilFutbolistico.perfilHabil} | Altura: ${p.fisico?.altura}m | Atributos (${allAttrs.length}/${totalAttrs}): ${allAttrs.join(', ')} | Club: ${p.contrato?.clubActual} | Prioritario: ${p.contrato?.fichajePrioritario ? 'Sí' : 'No'}`;
  }).join('\n');
}

const SUGERENCIAS = [
  '¿Quién es el jugador más viejo?',
  '¿Quién tiene más atributos técnicos?',
  '¿Cuáles son los jugadores más rápidos?',
  '¿Quiénes son los fichajes prioritarios?',
  '¿Qué delanteros tenemos disponibles?',
  '¿Quién es el jugador más joven?',
];

export default function Asistente() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const playersContext = buildContext(mockPlayers);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  async function sendMessage(text) {
    const userText = text || input.trim();
    if (!userText || loading) return;
    setInput('');

    const newMessages = [...messages, { role: 'user', content: userText }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, playersContext }),
      });

      const data = await response.json();
      const reply = data.reply || 'Sin respuesta.';
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: '❌ Error al conectar con el asistente.' }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <>
      <Navbar />
      <div className={styles.page}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.headerIcon}>🤖</span>
            <div>
              <h1 className={styles.title}>ASISTENTE IA</h1>
              <p className={styles.subtitle}>Consultá tu plantilla en lenguaje natural — {mockPlayers.length} jugadores cargados</p>
            </div>
          </div>
          <div className={styles.badge}>
            <span className={styles.badgeDot} />
            IA Activa
          </div>
        </div>

        <div className={styles.chatWrapper}>
          <div className={styles.messages}>
            {messages.length === 0 && (
              <div className={styles.empty}>
                <div className={styles.emptyIcon}>⚽</div>
                <p className={styles.emptyTitle}>¿Qué querés saber de tu plantilla?</p>
                <p className={styles.emptySub}>Hacé preguntas en lenguaje natural sobre tus jugadores</p>
                <div className={styles.sugerencias}>
                  {SUGERENCIAS.map(s => (
                    <button key={s} className={styles.sugerencia} onClick={() => sendMessage(s)}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`${styles.msg} ${msg.role === 'user' ? styles.msgUser : styles.msgBot}`}>
                {msg.role === 'assistant' && <span className={styles.msgAvatar}>🤖</span>}
                <div className={styles.msgBubble}>
                  {msg.role === 'assistant' ? (
                    <div className={styles.msgText}>
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  ) : (
                    <p className={styles.msgText}>{msg.content}</p>
                  )}
                </div>
                {msg.role === 'user' && <span className={styles.msgAvatar}>👤</span>}
              </div>
            ))}

            {loading && (
              <div className={`${styles.msg} ${styles.msgBot}`}>
                <span className={styles.msgAvatar}>🤖</span>
                <div className={styles.msgBubble}>
                  <div className={styles.typing}><span /><span /><span /></div>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          <div className={styles.inputRow}>
            <textarea
              ref={inputRef}
              className={styles.input}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ej: ¿Quién tiene más velocidad? ¿Cuáles son los jugadores lesionados?"
              rows={1}
              disabled={loading}
            />
            <button
              className={styles.sendBtn}
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
            >
              {loading ? '…' : '↑'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
