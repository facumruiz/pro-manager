import { useState } from 'react';
import Navbar from '../components/Navbar';
import { formations } from '../data/formations';
import { mockPlayers } from '../data/players';
import styles from '../styles/Plantilla.module.css';

const ESTADOS = ['Titular', 'Suplente', 'Lesionado', 'Preseleccionado', 'Desafectado', 'Suspendido'];
const ESTADO_COLOR = {
  Titular: '#00e676',
  Suplente: '#3d8bff',
  Lesionado: '#ff4757',
  Preseleccionado: '#ffa502',
  Desafectado: '#8b92a8',
  Suspendido: '#a55eea',
};

const positionMap = {
  GK:'Arquero', CB:'Defensa', LB:'Defensa', RB:'Defensa', LWB:'Defensa', RWB:'Defensa',
  CDM:'Mediocampista', CM:'Mediocampista', LM:'Mediocampista', RM:'Mediocampista',
  CAM:'Mediocampista', LAM:'Mediocampista', RAM:'Mediocampista', ST:'Delantero',
};

function calcAge(dob) {
  const b = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - b.getFullYear();
  if (today.getMonth() < b.getMonth() ||
    (today.getMonth() === b.getMonth() && today.getDate() < b.getDate())) age--;
  return age;
}

function countAttr(player) {
  let total = 0, yes = 0;
  ['tecnico','fisico','mental'].forEach(cat => {
    const obj = player.atributos?.[cat] || {};
    Object.values(obj).forEach(v => { total++; if (v) yes++; });
  });
  return total ? Math.round((yes / total) * 100) : 0;
}

export default function Plantilla() {
  const [players, setPlayers] = useState(mockPlayers);
  const [formation, setFormation] = useState('4-4-2');
  const [selected, setSelected] = useState(null);
  const [filterEstado, setFilterEstado] = useState('Todos');

  const titulares = players.filter(p => p.perfilFutbolistico.estado === 'Titular');
  const suplentes = players.filter(p => p.perfilFutbolistico.estado === 'Suplente');
  const formPositions = formations[formation];

  // Map players to formation slots
  const used = new Set();
  const slotMap = formPositions.map(slot => {
    const player = titulares.find(
      p => p.perfilFutbolistico.posicionNatural === slot.label && !used.has(p._id)
    );
    if (player) used.add(player._id);
    return { slot, player: player || null };
  });

  const displayPlayers = filterEstado === 'Todos'
    ? players
    : players.filter(p => p.perfilFutbolistico.estado === filterEstado);

  function changeStatus(id, estado) {
    setPlayers(prev => prev.map(p =>
      p._id === id ? { ...p, perfilFutbolistico: { ...p.perfilFutbolistico, estado } } : p
    ));
    setSelected(prev =>
      prev?._id === id ? { ...prev, perfilFutbolistico: { ...prev.perfilFutbolistico, estado } } : prev
    );
  }

  return (
    <>
      <Navbar />
      <div className={styles.layout}>

        {/* ── PITCH PANEL ── */}
        <div className={styles.pitchPanel}>
          <div className={styles.pitchHeader}>
            <h2 className={styles.panelTitle}>FORMACIÓN</h2>
            <select
              className={styles.select}
              value={formation}
              onChange={e => setFormation(e.target.value)}
            >
              {Object.keys(formations).map(f => <option key={f}>{f}</option>)}
            </select>
          </div>

          {/* Pitch fills remaining height */}
          <div className={styles.pitchContainer}>
            <div className={styles.pitchWrap}>
              {/* SVG background — lines (viewBox 100x150, top=attack, bottom=defense) */}
              <svg
                viewBox="0 0 100 150"
                preserveAspectRatio="xMidYMid slice"
                style={{ position:'absolute', inset:0, width:'100%', height:'100%' }}
              >
                {/* alternating grass stripes */}
                {[0,1,2,3,4,5,6].map(i =>
                  <rect key={i} x={0} y={i*22} width="100" height="11" fill="rgba(0,0,0,0.05)"/>
                )}
                {/* outer border */}
                <rect x="4" y="4" width="92" height="142" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.7"/>
                {/* halfway line */}
                <line x1="4" y1="75" x2="96" y2="75" stroke="rgba(255,255,255,0.25)" strokeWidth="0.7"/>
                {/* centre circle */}
                <circle cx="50" cy="75" r="12" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="0.7"/>
                <circle cx="50" cy="75" r="1.2" fill="rgba(255,255,255,0.5)"/>
                {/* top penalty area (attack) */}
                <rect x="22" y="4" width="56" height="22" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.6"/>
                {/* top 6yd box */}
                <rect x="36" y="4" width="28" height="9" fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="0.5"/>
                {/* top penalty spot */}
                <circle cx="50" cy="20" r="0.8" fill="rgba(255,255,255,0.35)"/>
                {/* bottom penalty area (defense) */}
                <rect x="22" y="124" width="56" height="22" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.6"/>
                {/* bottom 6yd box */}
                <rect x="36" y="137" width="28" height="9" fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="0.5"/>
                {/* bottom penalty spot */}
                <circle cx="50" cy="130" r="0.8" fill="rgba(255,255,255,0.35)"/>
                {/* top goal */}
                <rect x="42" y="1" width="16" height="4" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5"/>
                {/* bottom goal */}
                <rect x="42" y="145" width="16" height="4" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5"/>
              </svg>

              {/* Player slots */}
              {slotMap.map(({ slot, player }) => (
                <button
                  key={slot.id}
                  className={`${styles.pitchSlot} ${selected?._id === player?._id ? styles.pitchSlotActive : ''}`}
                  style={{ top: slot.top, left: slot.left }}
                  onClick={() => player && setSelected(prev => prev?._id === player._id ? null : player)}
                  title={player
                    ? `${player.datosPersonales.nombre} ${player.datosPersonales.apellido}`
                    : slot.label}
                >
                  <span
                    className={styles.slotDot}
                    style={{ background: player ? ESTADO_COLOR[player.perfilFutbolistico.estado] : 'rgba(255,255,255,0.12)' }}
                  />
                  <span className={styles.slotLabel}>{slot.label}</span>
                  {player && (
                    <span className={styles.slotName}>
                      {player.datosPersonales.apellido}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Bench */}
          <div className={styles.bench}>
            <span className={styles.benchTitle}>BANCO — {suplentes.length} jugadores</span>
            <div className={styles.benchList}>
              {suplentes.map(p => (
                <button
                  key={p._id}
                  className={`${styles.benchChip} ${selected?._id === p._id ? styles.benchChipActive : ''}`}
                  onClick={() => setSelected(prev => prev?._id === p._id ? null : p)}
                >
                  <span>{p.perfilFutbolistico.posicionNatural}</span>
                  <span>{p.datosPersonales.apellido}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── PLAYER LIST ── */}
        <div className={styles.listPanel}>
          <div className={styles.listHeader}>
            <h2 className={styles.panelTitle}>
              PLANTEL <span className={styles.count}>{players.length}</span>
            </h2>
            <div className={styles.filters}>
              {['Todos', ...ESTADOS].map(e => (
                <button
                  key={e}
                  className={`${styles.filterBtn} ${filterEstado === e ? styles.filterActive : ''}`}
                  style={
                    filterEstado === e && e !== 'Todos'
                      ? { borderColor: ESTADO_COLOR[e], color: ESTADO_COLOR[e] }
                      : {}
                  }
                  onClick={() => setFilterEstado(e)}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.playerList}>
            {displayPlayers.map(p => {
              const age = calcAge(p.datosPersonales.fechaNacimiento);
              const attr = countAttr(p);
              const isSelected = selected?._id === p._id;
              const estadoColor = ESTADO_COLOR[p.perfilFutbolistico.estado];
              return (
                <button
                  key={p._id}
                  className={`${styles.playerRow} ${isSelected ? styles.playerRowActive : ''}`}
                  onClick={() => setSelected(isSelected ? null : p)}
                >
                  <span className={styles.posBadge}>{p.perfilFutbolistico.posicionNatural}</span>
                  <span className={styles.playerName}>
                    <span>{p.datosPersonales.nombre}</span>
                    <span className={styles.playerLastname}>{p.datosPersonales.apellido}</span>
                  </span>
                  <span className={styles.playerMeta}>{p.datosPersonales.primeraNacionalidad}</span>
                  <span className={styles.playerMeta}>{age}a</span>
                  <span className={styles.attrBar}>
                    <span className={styles.attrFill} style={{ width: `${attr}%` }} />
                    <span className={styles.attrVal}>{attr}%</span>
                  </span>
                  <span
                    className={styles.estadoBadge}
                    style={{ background: estadoColor + '22', color: estadoColor }}
                  >
                    {p.perfilFutbolistico.estado}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── DETAIL PANEL ── */}
        {selected && (
          <div className={styles.detailPanel}>
            <button className={styles.closeBtn} onClick={() => setSelected(null)}>✕</button>

            <div className={styles.detailTop}>
              <div className={styles.detailAvatar}>
                {selected.datosPersonales.nombre[0]}{selected.datosPersonales.apellido[0]}
              </div>
              <div>
                <div className={styles.detailName}>
                  {selected.datosPersonales.nombre} {selected.datosPersonales.apellido}
                </div>
                <div className={styles.detailMeta}>
                  {selected.perfilFutbolistico.posicionNatural}
                  {' · '}
                  {positionMap[selected.perfilFutbolistico.posicionNatural]}
                  {' · '}
                  {selected.perfilFutbolistico.perfilHabil}
                </div>
              </div>
            </div>

            <div className={styles.detailStats}>
              {[
                ['Edad', calcAge(selected.datosPersonales.fechaNacimiento) + ' años'],
                ['Nac.', selected.datosPersonales.primeraNacionalidad],
                ['Altura', selected.fisico?.altura ? selected.fisico.altura + 'm' : '—'],
                ['Peso', selected.fisico?.peso ? selected.fisico.peso + 'kg' : '—'],
              ].map(([k, v]) => (
                <div key={k} className={styles.statCell}>
                  <span className={styles.statLabel}>{k}</span>
                  <span className={styles.statValue}>{v}</span>
                </div>
              ))}
            </div>

            <div className={styles.detailSection}>
              <div className={styles.sectionLabel}>Estado</div>
              <select
                className={styles.statusSelect}
                value={selected.perfilFutbolistico.estado}
                onChange={e => changeStatus(selected._id, e.target.value)}
              >
                {ESTADOS.map(e => <option key={e}>{e}</option>)}
              </select>
            </div>

            {['tecnico', 'fisico', 'mental'].map(cat => {
              const attrs = selected.atributos?.[cat] || {};
              const entries = Object.entries(attrs);
              if (!entries.length) return null;
              const trueCount = entries.filter(([, v]) => v).length;
              return (
                <div key={cat} className={styles.detailSection}>
                  <div className={styles.sectionLabel}>
                    {cat} — {trueCount}/{entries.length}
                  </div>
                  <div className={styles.attrGrid}>
                    {entries.map(([k, v]) => (
                      <span key={k} className={`${styles.attrTag} ${v ? styles.attrTagOn : ''}`}>
                        {k}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}

            {selected.contrato?.fichajePrioritario && (
              <div className={styles.priorityBadge}>⭐ Fichaje prioritario</div>
            )}
          </div>
        )}

      </div>
    </>
  );
}
