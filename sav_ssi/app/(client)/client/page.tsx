"use client";

import Link from "next/link"; // Importer Link pour la navigation
import styles from "./client.module.css"; // Importer les styles

export default function Home() {
  // Obtenez la date actuelle
  const currentDate = new Date().toLocaleDateString();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>
          BIENVENUE DANS L'APPLICATION DE MAINTENANCE DE VOS SSI
        </h1>
        <p className={styles.subtitle}>
          Gérez vos équipements en toute simplicité
        </p>
      </header>

      <nav className={styles.navbar}>
        <Link href="/request-maintenance" className={styles.link}>
          DEMANDE DE MAINTENANCE
        </Link>
        <Link href="/equipment" className={styles.link}>
          EQUIPEMEMNT
        </Link>
        <Link href="/status" className={styles.link}>
          STATUT DES EQUIPEMENTS
        </Link>
        <div className={styles.lastInstallation}>
          <span className={styles.link}>DERNIERE INSTALLATION</span>
          <p className={styles.date}>{currentDate}</p>
        </div>
      </nav>
    </div>
  );
}
