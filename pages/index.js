import Link from 'next/link';
import Navbar from '../components/Navbar';
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.hero}>
          <div className={styles.badge}>● DISPONIBLE PARA GESTIÓN</div>
          <h1 className={styles.heading}>
            TU ASISTENTE<br />
            <span className={styles.green}>PRO MANAGER</span>
          </h1>
          <p className={styles.sub}>
            Gestioná jugadores, formaciones y análisis de rendimiento en un solo lugar.
          </p>
          <div className={styles.actions}>
            <Link href="/plantilla" className={styles.btnPrimary}>Ver plantilla →</Link>
            <Link href="/comparador" className={styles.btnSecondary}>Comparador</Link>
            <Link href="/analytics" className={styles.btnSecondary}>Ver análisis</Link>
          </div>
        </div>

        <div className={styles.pitch}>
          <svg viewBox="0 0 320 480" className={styles.pitchSvg}>
            <rect width="320" height="480" rx="4" fill="#1a6b35"/>
            {/* stripes */}
            {[0,1,2,3,4,5].map(i => (
              <rect key={i} x={i*54} width="27" height="480" fill="rgba(0,0,0,0.06)"/>
            ))}
            {/* border */}
            <rect x="16" y="16" width="288" height="448" rx="2" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2"/>
            {/* halfway */}
            <line x1="16" y1="240" x2="304" y2="240" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5"/>
            {/* center circle */}
            <circle cx="160" cy="240" r="50" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5"/>
            <circle cx="160" cy="240" r="3" fill="rgba(255,255,255,0.5)"/>
            {/* penalty areas */}
            <rect x="80" y="16" width="160" height="70" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5"/>
            <rect x="80" y="394" width="160" height="70" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5"/>
            {/* goal areas */}
            <rect x="120" y="16" width="80" height="28" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5"/>
            <rect x="120" y="436" width="80" height="28" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5"/>
            {/* player dots */}
            {[
              [160,430],[100,370],[130,370],[190,370],[220,370],
              [100,260],[145,260],[175,260],[220,260],
              [130,150],[190,150]
            ].map(([x,y],i) => (
              <g key={i}>
                <circle cx={x} cy={y} r="10" fill="#00e676" opacity="0.9"/>
                <circle cx={x} cy={y} r="10" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"/>
              </g>
            ))}
          </svg>
        </div>

        <div className={styles.cards}>
          {[
            { icon: '👥', title: 'Plantilla', desc: 'Gestión completa de titulares, suplentes y estados', href: '/plantilla' },
            { icon: '⚖️', title: 'Comparador', desc: 'Enfrentá dos jugadores atributo por atributo', href: '/comparador' },
            { icon: '📊', title: 'Análisis', desc: 'Distribución por posición, edad, atributos y más', href: '/analytics' },
          ].map(c => (
            <Link key={c.title} href={c.href} className={styles.card}>
              <span className={styles.cardIcon}>{c.icon}</span>
              <h3 className={styles.cardTitle}>{c.title}</h3>
              <p className={styles.cardDesc}>{c.desc}</p>
              <span className={styles.cardArrow}>→</span>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
