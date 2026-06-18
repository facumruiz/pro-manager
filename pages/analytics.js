import { useMemo } from 'react';
import Navbar from '../components/Navbar';
import { mockPlayers } from '../data/players';
import styles from '../styles/Analytics.module.css';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend, RadarChart, Radar, PolarGrid, PolarAngleAxis,
} from 'recharts';

const ESTADO_COLOR = {
  Titular: '#00e676', Suplente: '#3d8bff', Lesionado: '#ff4757',
  Preseleccionado: '#ffa502', Desafectado: '#8b92a8', Suspendido: '#a55eea',
};
const ACCENT = '#00e676';
const POS_CATEGORY = {
  GK:'Arquero', CB:'Defensa', LB:'Defensa', RB:'Defensa', LWB:'Defensa', RWB:'Defensa',
  CDM:'Mediocampista', CM:'Mediocampista', LM:'Mediocampista', RM:'Mediocampista',
  CAM:'Mediocampista', LAM:'Mediocampista', RAM:'Mediocampista', ST:'Delantero',
};

function calcAge(dob) {
  const b = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - b.getFullYear();
  if (today.getMonth() < b.getMonth() || (today.getMonth() === b.getMonth() && today.getDate() < b.getDate())) age--;
  return age;
}

function countAttr(player, cat) {
  const obj = player.atributos?.[cat] || {};
  const vals = Object.values(obj);
  return vals.filter(Boolean).length;
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) return (
    <div style={{ background: '#1c2030', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '8px 14px', fontSize: 13 }}>
      <p style={{ color: '#8b92a8', marginBottom: 2, fontSize: 11 }}>{label}</p>
      {payload.map((p,i) => <p key={i} style={{ color: p.color || ACCENT, fontWeight: 700 }}>{p.value}</p>)}
    </div>
  );
  return null;
};

export default function Analytics() {
  const players = mockPlayers;

  // 1. Estado del plantel
  const estadoData = useMemo(() => {
    const counts = {};
    players.forEach(p => { const e = p.perfilFutbolistico.estado; counts[e] = (counts[e]||0)+1; });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, []);

  // 2. Distribución por posición
  const posData = useMemo(() => {
    const cats = {};
    players.forEach(p => {
      const c = POS_CATEGORY[p.perfilFutbolistico.posicionNatural] || 'Otro';
      cats[c] = (cats[c]||0)+1;
    });
    return Object.entries(cats).map(([name,value]) => ({ name, value }));
  }, []);

  // 3. Distribución por posición específica
  const posSpecData = useMemo(() => {
    const counts = {};
    players.forEach(p => { const pos = p.perfilFutbolistico.posicionNatural; counts[pos]=(counts[pos]||0)+1; });
    return Object.entries(counts).sort((a,b)=>b[1]-a[1]).map(([name,value])=>({name,value}));
  }, []);

  // 4. Pirámide de edades
  const ageData = useMemo(() => {
    const buckets = {'< 21': 0, '21-23': 0, '24-26': 0, '27-29': 0, '30+': 0};
    players.forEach(p => {
      const age = calcAge(p.datosPersonales.fechaNacimiento);
      if (age < 21) buckets['< 21']++;
      else if (age <= 23) buckets['21-23']++;
      else if (age <= 26) buckets['24-26']++;
      else if (age <= 29) buckets['27-29']++;
      else buckets['30+']++;
    });
    return Object.entries(buckets).map(([name,value])=>({name,value}));
  }, []);

  // 5. Perfil hábil
  const perfilData = useMemo(() => {
    const c = {Derecho:0, Izquierdo:0, Ambidiestro:0};
    players.forEach(p => { const ph = p.perfilFutbolistico.perfilHabil; if(c[ph]!==undefined) c[ph]++; });
    return Object.entries(c).map(([name,value])=>({name,value}));
  }, []);

  // 6. Atributos radar (promedio del plantel)
  const radarData = useMemo(() => {
    const titulares = players.filter(p => p.perfilFutbolistico.estado === 'Titular');
    const categories = ['tecnico','fisico','mental'];
    const labels = { tecnico: 'Técnico', fisico: 'Físico', mental: 'Mental' };
    const maxCounts = { tecnico: 14, fisico: 8, mental: 15 };
    return categories.map(cat => {
      const avg = titulares.reduce((acc,p) => acc + countAttr(p, cat), 0) / (titulares.length || 1);
      return { cat: labels[cat], value: Math.round((avg / maxCounts[cat]) * 100) };
    });
  }, []);

  // 7. Nacionalidades
  const nacData = useMemo(() => {
    const c = {};
    players.forEach(p => { const n = p.datosPersonales.primeraNacionalidad; c[n]=(c[n]||0)+1; });
    return Object.entries(c).sort((a,b)=>b[1]-a[1]).map(([name,value])=>({name,value}));
  }, []);

  // KPIs
  const titulares = players.filter(p => p.perfilFutbolistico.estado === 'Titular');
  const avgAge = Math.round(players.reduce((a,p) => a + calcAge(p.datosPersonales.fechaNacimiento), 0) / players.length);
  const avgAgeTit = Math.round(titulares.reduce((a,p) => a + calcAge(p.datosPersonales.fechaNacimiento), 0) / (titulares.length||1));
  const lesionados = players.filter(p => p.perfilFutbolistico.estado === 'Lesionado').length;
  const prioritarios = players.filter(p => p.contrato?.fichajePrioritario).length;
  const nacCount = new Set(players.map(p => p.datosPersonales.primeraNacionalidad)).size;

  return (
    <>
      <Navbar />
      <div className={styles.page}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>ANÁLISIS DE PLANTILLA</h1>
            <p className={styles.subtitle}>Datos estadísticos del plantel — {players.length} jugadores</p>
          </div>
        </div>

        {/* KPIs */}
        <div className={styles.kpis}>
          {[
            { label: 'Total jugadores', value: players.length, sub: 'en el sistema' },
            { label: 'Titulares', value: titulares.length, sub: 'formación activa', color: '#00e676' },
            { label: 'Edad promedio', value: avgAge + 'a', sub: `titulares: ${avgAgeTit}a` },
            { label: 'Lesionados', value: lesionados, sub: 'fuera de juego', color: lesionados ? '#ff4757' : undefined },
            { label: 'Prioritarios', value: prioritarios, sub: 'fichajes clave', color: '#ffa502' },
            { label: 'Nacionalidades', value: nacCount, sub: 'países distintos' },
          ].map(kpi => (
            <div key={kpi.label} className={styles.kpiCard}>
              <span className={styles.kpiValue} style={kpi.color ? { color: kpi.color } : {}}>{kpi.value}</span>
              <span className={styles.kpiLabel}>{kpi.label}</span>
              <span className={styles.kpiSub}>{kpi.sub}</span>
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className={styles.grid}>

          {/* Estado del plantel - pie */}
          <div className={`${styles.card} ${styles.cardMd}`}>
            <h3 className={styles.cardTitle}>Estado del plantel</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={estadoData} cx="50%" cy="50%" innerRadius={55} outerRadius={85}
                  dataKey="value" paddingAngle={3} strokeWidth={0}>
                  {estadoData.map((e,i) => <Cell key={i} fill={ESTADO_COLOR[e.name] || '#555'} />)}
                </Pie>
                <Tooltip content={<CustomTooltip/>}/>
                <Legend formatter={(v) => <span style={{ color: '#8b92a8', fontSize: 12 }}>{v}</span>}/>
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Perfil hábil */}
          <div className={`${styles.card} ${styles.cardSm}`}>
            <h3 className={styles.cardTitle}>Perfil hábil</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={perfilData} cx="50%" cy="50%" innerRadius={45} outerRadius={72}
                  dataKey="value" paddingAngle={4} strokeWidth={0}>
                  {perfilData.map((e,i) => <Cell key={i} fill={['#00e676','#3d8bff','#a55eea'][i]} />)}
                </Pie>
                <Tooltip content={<CustomTooltip/>}/>
                <Legend formatter={(v) => <span style={{ color: '#8b92a8', fontSize: 12 }}>{v}</span>}/>
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Radar atributos */}
          <div className={`${styles.card} ${styles.cardSm}`}>
            <h3 className={styles.cardTitle}>Perfil de atributos (titulares)</h3>
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.08)"/>
                <PolarAngleAxis dataKey="cat" tick={{ fill: '#8b92a8', fontSize: 12 }}/>
                <Radar dataKey="value" stroke={ACCENT} fill={ACCENT} fillOpacity={0.2} strokeWidth={2}/>
                <Tooltip content={<CustomTooltip/>}/>
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Distribución por posición */}
          <div className={`${styles.card} ${styles.cardLg}`}>
            <h3 className={styles.cardTitle}>Jugadores por posición específica</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={posSpecData} margin={{ left: -20 }}>
                <XAxis dataKey="name" tick={{ fill: '#8b92a8', fontSize: 11 }} axisLine={false} tickLine={false}/>
                <YAxis tick={{ fill: '#8b92a8', fontSize: 11 }} axisLine={false} tickLine={false}/>
                <Tooltip content={<CustomTooltip/>}/>
                <Bar dataKey="value" radius={[4,4,0,0]}>
                  {posSpecData.map((e,i) => <Cell key={i} fill={ACCENT} opacity={0.6 + i * 0.02}/>)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Edades */}
          <div className={`${styles.card} ${styles.cardMd}`}>
            <h3 className={styles.cardTitle}>Distribución por edad</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={ageData} margin={{ left: -20 }}>
                <XAxis dataKey="name" tick={{ fill: '#8b92a8', fontSize: 12 }} axisLine={false} tickLine={false}/>
                <YAxis tick={{ fill: '#8b92a8', fontSize: 11 }} axisLine={false} tickLine={false}/>
                <Tooltip content={<CustomTooltip/>}/>
                <Bar dataKey="value" radius={[4,4,0,0]}>
                  {ageData.map((e,i) => <Cell key={i} fill={['#3d8bff','#00e676','#00e676','#ffa502','#ff4757'][i]}/>)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Nacionalidades */}
          <div className={`${styles.card} ${styles.cardMd}`}>
            <h3 className={styles.cardTitle}>Nacionalidades</h3>
            <div className={styles.nacList}>
              {nacData.map((n, i) => (
                <div key={n.name} className={styles.nacRow}>
                  <span className={styles.nacName}>{n.name}</span>
                  <div className={styles.nacBarWrap}>
                    <div className={styles.nacBarFill} style={{ width: `${(n.value / players.length) * 100}%` }}/>
                  </div>
                  <span className={styles.nacCount}>{n.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Player attribute table */}
          <div className={`${styles.card} ${styles.cardFull}`}>
            <h3 className={styles.cardTitle}>Resumen de atributos por jugador (titulares)</h3>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Jugador</th>
                    <th>Pos.</th>
                    <th>Edad</th>
                    <th>Técnico</th>
                    <th>Físico</th>
                    <th>Mental</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {titulares.map(p => {
                    const tec = countAttr(p, 'tecnico');
                    const fis = countAttr(p, 'fisico');
                    const men = countAttr(p, 'mental');
                    const total = tec + fis + men;
                    const maxT = 14, maxF = 8, maxM = 15, maxTotal = 37;
                    return (
                      <tr key={p._id}>
                        <td className={styles.tdName}>{p.datosPersonales.nombre} {p.datosPersonales.apellido}</td>
                        <td><span className={styles.tdPos}>{p.perfilFutbolistico.posicionNatural}</span></td>
                        <td>{calcAge(p.datosPersonales.fechaNacimiento)}</td>
                        <td>
                          <div className={styles.miniBar}>
                            <div style={{ width: `${(tec/maxT)*100}%`, background: '#00e676' }}/>
                          </div>
                          <span className={styles.miniVal}>{tec}/{maxT}</span>
                        </td>
                        <td>
                          <div className={styles.miniBar}>
                            <div style={{ width: `${(fis/maxF)*100}%`, background: '#3d8bff' }}/>
                          </div>
                          <span className={styles.miniVal}>{fis}/{maxF}</span>
                        </td>
                        <td>
                          <div className={styles.miniBar}>
                            <div style={{ width: `${(men/maxM)*100}%`, background: '#a55eea' }}/>
                          </div>
                          <span className={styles.miniVal}>{men}/{maxM}</span>
                        </td>
                        <td>
                          <span style={{ fontWeight: 700, color: total > 22 ? '#00e676' : total > 15 ? '#ffa502' : '#ff4757' }}>
                            {total}/{maxTotal}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
