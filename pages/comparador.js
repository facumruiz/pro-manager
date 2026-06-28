import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import { mockPlayers } from '../data/players';
import styles from '../styles/Comparador.module.css';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip,
} from 'recharts';

// ── CONSTANTES ───────────────────────────────────────────
const ESTADO_COLOR = {
  Titular: '#00e676', Suplente: '#3d8bff', Lesionado: '#ff4757',
  Preseleccionado: '#ffa502', Desafectado: '#8b92a8', Suspendido: '#a55eea',
};

const ATTR_CATS = [
  { key: 'tecnico', label: 'Técnico', color: '#00e676', max: 14 },
  { key: 'fisico',  label: 'Físico',  color: '#3d8bff', max: 8  },
  { key: 'mental',  label: 'Mental',  color: '#a55eea', max: 15 },
];

const RADAR_DIMS = [
  { key: 'tecnico', label: 'Técnico' },
  { key: 'fisico',  label: 'Físico'  },
  { key: 'mental',  label: 'Mental'  },
];

// ── UTILIDADES ───────────────────────────────────────────
function calcAge(dob) {
  const b = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - b.getFullYear();
  if (today.getMonth() < b.getMonth() ||
    (today.getMonth() === b.getMonth() && today.getDate() < b.getDate())) age--;
  return age;
}

function getAttrScore(player, cat) {
  const obj = player.atributos?.[cat] || {};
  const vals = Object.values(obj);
  if (!vals.length) return 0;
  return Math.round((vals.filter(Boolean).length / vals.length) * 100);
}

function getTotalScore(player) {
  let total = 0, yes = 0;
  ['tecnico', 'fisico', 'mental'].forEach(cat => {
    const obj = player.atributos?.[cat] || {};
    Object.values(obj).forEach(v => { total++; if (v) yes++; });
  });
  return total ? Math.round((yes / total) * 100) : 0;
}

// ── PICKER DE JUGADOR ────────────────────────────────────
// Dropdown con búsqueda para seleccionar un jugador del plantel
function PlayerPicker({ value, onChange, exclude, side }) {
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);

  const filtered = mockPlayers.filter(p => {
    if (p._id === exclude) return false;
    const name = `${p.datosPersonales.nombre} ${p.datosPersonales.apellido}`.toLowerCase();
    return name.includes(search.toLowerCase());
  });

  function select(p) { onChange(p); setOpen(false); setSearch(''); }

  return (
    <div className={styles.picker}>
      {value ? (
        <div className={`${styles.pickerSelected} ${side === 'b' ? styles.pickerSelectedB : ''}`}>
          <div className={styles.pickerAvatar} style={{ borderColor: side === 'b' ? '#3d8bff' : '#00e676' }}>
            {value.datosPersonales.nombre[0]}{value.datosPersonales.apellido[0]}
          </div>
          <div className={styles.pickerInfo}>
            <span className={styles.pickerName}>
              {value.datosPersonales.nombre} {value.datosPersonales.apellido}
            </span>
            <span className={styles.pickerMeta}>
              {value.perfilFutbolistico.posicionNatural} · {value.datosPersonales.primeraNacionalidad} · {calcAge(value.datosPersonales.fechaNacimiento)}a
            </span>
          </div>
          <button className={styles.pickerChange} onClick={() => { onChange(null); setOpen(true); }}>
            Cambiar
          </button>
        </div>
      ) : (
        <button
          className={`${styles.pickerEmpty} ${side === 'b' ? styles.pickerEmptyB : ''}`}
          onClick={() => setOpen(true)}
        >
          <span className={styles.pickerPlus}>+</span>
          <span>Seleccionar jugador</span>
        </button>
      )}

      {open && (
        <div className={styles.dropdown}>
          <input
            className={styles.dropdownSearch}
            placeholder="Buscar jugador..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            autoFocus
          />
          <div className={styles.dropdownList}>
            {filtered.map(p => (
              <button key={p._id} className={styles.dropdownItem} onClick={() => select(p)}>
                <span className={styles.dropdownPos}>{p.perfilFutbolistico.posicionNatural}</span>
                <span className={styles.dropdownName}>
                  {p.datosPersonales.nombre} {p.datosPersonales.apellido}
                </span>
                <span className={styles.dropdownEstado} style={{ color: ESTADO_COLOR[p.perfilFutbolistico.estado] }}>
                  {p.perfilFutbolistico.estado}
                </span>
              </button>
            ))}
          </div>
          <button className={styles.dropdownClose} onClick={() => setOpen(false)}>Cancelar</button>
        </div>
      )}
    </div>
  );
}

// ── FILA DE ESTADÍSTICA ──────────────────────────────────
// Barra comparativa entre jugador A (verde) y jugador B (azul)
function StatRow({ label, valA, valB, maxA, maxB, colorA = '#00e676', colorB = '#3d8bff' }) {
  const pctA = Math.round((valA / (maxA || 100)) * 100);
  const pctB = Math.round((valB / (maxB || 100)) * 100);
  const winA = pctA > pctB;
  const winB = pctB > pctA;
  return (
    <div className={styles.statRow}>
      <span className={`${styles.statVal} ${styles.statValLeft} ${winA ? styles.statWin : ''}`}>{valA}</span>
      <div className={styles.barLeft}>
        <div className={styles.barFillLeft} style={{ width: `${pctA}%`, background: colorA }} />
      </div>
      <span className={styles.statLabel}>{label}</span>
      <div className={styles.barRight}>
        <div className={styles.barFillRight} style={{ width: `${pctB}%`, background: colorB }} />
      </div>
      <span className={`${styles.statVal} ${styles.statValRight} ${winB ? styles.statWin : ''}`}>{valB}</span>
    </div>
  );
}

// ── COMPONENTE PRINCIPAL ─────────────────────────────────
export default function Comparador() {
  const router = useRouter();
  const [playerA, setPlayerA] = useState(mockPlayers[0]);
  const [playerB, setPlayerB] = useState(mockPlayers[6]);

  // ── URL PARAMS — carga jugadores desde el asistente IA ─
  // Soporta /comparador?a=p1&b=p9 generado por el chatbot
  useEffect(() => {
    const { a, b } = router.query;
    if (a) {
      const pA = mockPlayers.find(p => p._id === a);
      if (pA) setPlayerA(pA);
    }
    if (b) {
      const pB = mockPlayers.find(p => p._id === b);
      if (pB) setPlayerB(pB);
    }
  }, [router.query]);

  // Datos para el radar chart — recalcula solo cuando cambian los jugadores
  const radarData = useMemo(() => {
    if (!playerA || !playerB) return [];
    return RADAR_DIMS.map(d => ({
      dim: d.label,
      A: getAttrScore(playerA, d.key),
      B: getAttrScore(playerB, d.key),
    }));
  }, [playerA, playerB]);

  const scoreA = playerA ? getTotalScore(playerA) : 0;
  const scoreB = playerB ? getTotalScore(playerB) : 0;
  const empty = !playerA || !playerB;

  // ── RENDER ─────────────────────────────────────────────
  return (
    <>
      <Navbar />
      <div className={styles.page}>

        {/* ── HEADER ── */}
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>COMPARADOR</h1>
            <p className={styles.subtitle}>Enfrentá dos jugadores atributo por atributo</p>
          </div>
        </div>

        {/* ── SELECTORES DE JUGADOR ── */}
        <div className={styles.pickers}>
          <PlayerPicker value={playerA} onChange={setPlayerA} exclude={playerB?._id} side="a" />
          <div className={styles.vsLabel}>VS</div>
          <PlayerPicker value={playerB} onChange={setPlayerB} exclude={playerA?._id} side="b" />
        </div>

        {empty && <div className={styles.emptyState}>Seleccioná dos jugadores para comparar</div>}

        {!empty && (
          <div className={styles.content}>

            {/* ── SCORE GENERAL ── */}
            <div className={styles.scoreRow}>
              <div className={`${styles.scoreCard} ${scoreA >= scoreB ? styles.scoreCardWin : ''}`}>
                <span className={styles.scoreNum} style={{ color: '#00e676' }}>{scoreA}%</span>
                <span className={styles.scoreLabel}>Puntuación general</span>
                <span className={styles.scoreName}>{playerA.datosPersonales.nombre} {playerA.datosPersonales.apellido}</span>
              </div>
              <div className={styles.scoreMiddle}>
                <div className={styles.diffBadge}>{Math.abs(scoreA - scoreB)}pts</div>
                <span className={styles.diffLabel}>diferencia</span>
              </div>
              <div className={`${styles.scoreCard} ${styles.scoreCardRight} ${scoreB >= scoreA ? styles.scoreCardWin : ''}`}>
                <span className={styles.scoreNum} style={{ color: '#3d8bff' }}>{scoreB}%</span>
                <span className={styles.scoreLabel}>Puntuación general</span>
                <span className={styles.scoreName}>{playerB.datosPersonales.nombre} {playerB.datosPersonales.apellido}</span>
              </div>
            </div>

            {/* ── BARRAS + RADAR ── */}
            <div className={styles.mainGrid}>

              {/* Barras comparativas por categoría */}
              <div className={styles.barsCard}>
                <div className={styles.infoSection}>
                  <StatRow label="Edad" valA={calcAge(playerA.datosPersonales.fechaNacimiento)} valB={calcAge(playerB.datosPersonales.fechaNacimiento)} maxA={40} maxB={40} />
                  <StatRow label="Altura (cm)" valA={Math.round((playerA.fisico?.altura || 1.75) * 100)} valB={Math.round((playerB.fisico?.altura || 1.75) * 100)} maxA={200} maxB={200} />
                  <StatRow label="Peso (kg)" valA={playerA.fisico?.peso || 70} valB={playerB.fisico?.peso || 70} maxA={100} maxB={100} />
                </div>
                <div className={styles.divider} />
                {ATTR_CATS.map(cat => {
                  const aScore = getAttrScore(playerA, cat.key);
                  const bScore = getAttrScore(playerB, cat.key);
                  const aRaw = Object.values(playerA.atributos?.[cat.key] || {}).filter(Boolean).length;
                  const bRaw = Object.values(playerB.atributos?.[cat.key] || {}).filter(Boolean).length;
                  return (
                    <div key={cat.key} className={styles.catSection}>
                      <div className={styles.catHeader}>
                        <span className={styles.catDot} style={{ background: cat.color }} />
                        <span className={styles.catLabel}>{cat.label}</span>
                      </div>
                      <StatRow label={`${cat.label} (%)`} valA={aScore} valB={bScore} maxA={100} maxB={100} colorA="#00e676" colorB="#3d8bff" />
                      <StatRow label={`Atributos (/${cat.max})`} valA={aRaw} valB={bRaw} maxA={cat.max} maxB={cat.max} colorA="#00e676" colorB="#3d8bff" />
                    </div>
                  );
                })}
              </div>

              {/* Radar chart + veredicto */}
              <div className={styles.radarCard}>
                <h3 className={styles.cardTitle}>Perfil de atributos</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <RadarChart data={radarData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
                    <PolarGrid stroke="rgba(255,255,255,0.08)" />
                    <PolarAngleAxis dataKey="dim" tick={{ fill: '#8b92a8', fontSize: 12 }} />
                    <Radar name={playerA.datosPersonales.apellido} dataKey="A" stroke="#00e676" fill="#00e676" fillOpacity={0.18} strokeWidth={2} />
                    <Radar name={playerB.datosPersonales.apellido} dataKey="B" stroke="#3d8bff" fill="#3d8bff" fillOpacity={0.18} strokeWidth={2} />
                    <Tooltip contentStyle={{ background: '#1c2030', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, fontSize: 12 }} labelStyle={{ color: '#8b92a8' }} />
                  </RadarChart>
                </ResponsiveContainer>

                {/* Leyenda */}
                <div className={styles.radarLegend}>
                  <span className={styles.legendDot} style={{ background: '#00e676' }} />
                  <span className={styles.legendName}>{playerA.datosPersonales.nombre} {playerA.datosPersonales.apellido}</span>
                  <span className={styles.legendDot} style={{ background: '#3d8bff', marginLeft: '1rem' }} />
                  <span className={styles.legendName}>{playerB.datosPersonales.nombre} {playerB.datosPersonales.apellido}</span>
                </div>

                {/* Veredicto automático */}
                <div className={styles.veredicto}>
                  {scoreA === scoreB ? (
                    <span className={styles.veredictoTie}>Empate técnico</span>
                  ) : (
                    <>
                      <span className={styles.veredictoWinner} style={{ color: scoreA > scoreB ? '#00e676' : '#3d8bff' }}>
                        {scoreA > scoreB
                          ? `${playerA.datosPersonales.nombre} ${playerA.datosPersonales.apellido}`
                          : `${playerB.datosPersonales.nombre} ${playerB.datosPersonales.apellido}`}
                      </span>
                      <span className={styles.veredictoLabel}> tiene mejor perfil general</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* ── DETALLE DE ATRIBUTOS ── */}
            {/* Grilla por categoría mostrando qué atributos tiene cada jugador */}
            <div className={styles.attrDetail}>
              {ATTR_CATS.map(cat => {
                const keysA = Object.keys(playerA.atributos?.[cat.key] || {});
                const keysB = Object.keys(playerB.atributos?.[cat.key] || {});
                const allKeys = [...new Set([...keysA, ...keysB])];
                return (
                  <div key={cat.key} className={styles.attrCard}>
                    <h3 className={styles.cardTitle}>
                      <span className={styles.catDot} style={{ background: cat.color }} />
                      {cat.label}
                    </h3>
                    <div className={styles.attrGrid}>
                      {allKeys.map(k => {
                        const a = playerA.atributos?.[cat.key]?.[k];
                        const b = playerB.atributos?.[cat.key]?.[k];
                        return (
                          <div key={k} className={styles.attrItem}>
                            <span className={styles.attrName}>{k}</span>
                            <span className={`${styles.attrDot} ${a ? styles.attrDotOn : ''}`} style={a ? { background: '#00e676' } : {}} />
                            <span className={`${styles.attrDot} ${b ? styles.attrDotOn : ''}`} style={b ? { background: '#3d8bff' } : {}} />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}
      </div>
    </>
  );
}
