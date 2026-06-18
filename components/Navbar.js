import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from './Navbar.module.css';

const NAV = [
  { href: '/', label: 'Inicio' },
  { href: '/plantilla', label: 'Plantilla' },
  { href: '/comparador', label: 'Comparador' },
  { href: '/analytics', label: 'Análisis' },
];

export default function Navbar() {
  const router = useRouter();
  return (
    <nav className={styles.nav}>
      <Link href="/" className={styles.brand}>
        <span className={styles.brandMark}>PM</span>
        <span className={styles.brandName}>PRO MANAGER</span>
      </Link>
      <ul className={styles.links}>
        {NAV.map(({ href, label }) => (
          <li key={href}>
            <Link href={href} className={`${styles.link} ${router.pathname === href ? styles.active : ''}`}>
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
