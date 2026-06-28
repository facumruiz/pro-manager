import { useState, useRef, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { mockPlayers } from '../data/players';
import ReactMarkdown from 'react-markdown';
import styles from '../styles/Asistente.module.css';

// ── CONTEXTO ────────────────────────────────────────────
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
    // Incluye _id entre corchetes para que la IA pueda generar links de comparación
    return `[${p._id}] ${p.datosPersonales.nombre} ${p.datosPersonales.apellido}|${p.perfilFutbolistico.posicionNatural}|${p.perfilFutbolistico.estado}|${age}a|${p.datosPersonales.primeraNacionalidad}|${p.perfilFutbolistico.perfilHabil}|${p.fisico?.altura}m|attrs(${allAttrs.length}/${totalAttrs}):${allAttrs.join(',')}|club:${p.contrato?.clubActual}|prior:${p.contrato?.fichajePrioritario ? 'si' : 'no'}`;
  }).join('\n');
}

// ── MENSAJES DE CARGA ROTATIVOS ──────────────────────────
const LOADING_MSGS = [
  '⚽ Analizando la plantilla...',
  '🔍 Revisando atributos...',
  '📊 Procesando estadísticas...',
  '🧠 Consultando al asistente...',
  '📋 Comparando jugadores...',
  '⏱️ Calculando rendimiento...',
  '🎯 Buscando la respuesta...',
];

function useRotatingMsg(active, interval = 2200) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (!active) { setIdx(0); return; }
    const timer = setInterval(() => {
      setIdx(i => (i + 1) % LOADING_MSGS.length);
    }, interval);
    return () => clearInterval(timer);
  }, [active]);
  return LOADING_MSGS[idx];
}

// ── SUGERENCIAS RÁPIDAS ──────────────────────────────────
const SUGERENCIAS = [
  '¿Quién es el jugador más viejo?',
  '¿Quién tiene más atributos técnicos?',
  '¿Quiénes son los fichajes prioritarios?',
  '¿Qué delanteros están disponibles?',
  '¿Cuál es el más rápido del plantel?',
  '¿Quién es el jugador más joven?',
  'Comparame al mejor delantero con el mejor mediocampista',
];

// ── LINK MARKDOWN — abre comparador en pestaña nueva ────
const MarkdownLink = ({ href, children }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    style={{ color: '#3d8bff', textDecoration: 'underline', fontWeight: 600 }}
  >
    {children}
  </a>
);

// ── COMPONENTE PRINCIPAL ─────────────────────────────────
export default function Asistente() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const loadingMsg = useRotatingMsg(loading);

  // Construir contexto una sola vez para no recalcular en cada render
  const playersContext = useRef(buildContext(mockPlayers)).current;

  // Auto-scroll al último mensaje
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // ── ENVÍO DE MENSAJE ───────────────────────────────────
  async function sendMessage(text) {
    const userText = (text || input).trim();
    if (!userText || loading) return;
    setInput('');

    const newMessages = [...messages, { role: 'user', content: userText }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, playersContext }),
      });

      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply || 'Sin respuesta.' }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: '❌ Error al conectar con el asistente.' }]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }

  // Enter para enviar, Shift+Enter para nueva línea
  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  }

  // ── RENDER ─────────────────────────────────────────────
  return (
    <>
      <Navbar />
      <div className={styles.page}>

        {/* ── HEADER ── */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.headerIcon}>🤖</span>
            <div>
              <h1 className={styles.title}>ASISTENTE IA</h1>
              <p className={styles.subtitle}>
                Consultá tu plantilla en lenguaje natural — {mockPlayers.length} jugadores cargados
              </p>
            </div>
          </div>
          <div className={styles.badge}>
            <span className={styles.badgeDot} />
            IA Activa
          </div>
        </div>

        {/* ── CHAT ── */}
        <div className={styles.chatWrapper}>
          <div className={styles.messages}>

            {/* Estado vacío con sugerencias rápidas */}
            {messages.length === 0 && (
              <div className={styles.empty}>
                <div className={styles.emptyIcon}>⚽</div>
                <p className={styles.emptyTitle}>¿Qué querés saber de tu plantilla?</p>
                <p className={styles.emptySub}>
                  Preguntá en lenguaje natural — el asistente conoce a los {mockPlayers.length} jugadores
                </p>
                <div className={styles.sugerencias}>
                  {SUGERENCIAS.map(s => (
                    <button key={s} className={styles.sugerencia} onClick={() => sendMessage(s)}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Lista de mensajes */}
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`${styles.msg} ${msg.role === 'user' ? styles.msgUser : styles.msgBot}`}
              >
                {msg.role === 'assistant' && <span className={styles.msgAvatar}>🤖</span>}
                <div className={styles.msgBubble}>
                  {msg.role === 'assistant' ? (
                    // Renderiza markdown — los links abren el comparador en pestaña nueva
                    <div className={styles.msgText}>
                      <ReactMarkdown components={{ a: MarkdownLink }}>
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <p className={styles.msgText}>{msg.content}</p>
                  )}
                </div>
                {msg.role === 'user' && <span className={styles.msgAvatar}>👤</span>}
              </div>
            ))}

            {/* Indicador de carga con mensaje rotativo */}
            {loading && (
              <div className={`${styles.msg} ${styles.msgBot}`}>
                <span className={styles.msgAvatar}>🤖</span>
                <div className={`${styles.msgBubble} ${styles.loadingBubble}`}>
                  <div className={styles.loadingInner}>
                    <span className={styles.loadingText}>{loadingMsg}</span>
                    <div className={styles.typing}>
                      <span /><span /><span />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* ── INPUT ── */}
          <div className={styles.inputRow}>
            <textarea
              ref={inputRef}
              className={styles.input}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ej: ¿Quién tiene más velocidad? ¿Comparamos dos jugadores?"
              rows={1}
              disabled={loading}
            />
            <button
              className={styles.sendBtn}
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
            >
              {/* Spinner mientras carga, flecha cuando está listo */}
              {loading ? <span className={styles.sendSpinner} /> : '↑'}
            </button>
          </div>
        </div>

      </div>
    </>
  );
}
