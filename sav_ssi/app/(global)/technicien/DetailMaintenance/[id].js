"use client";

import React from "react";
import Head from "next/head";
import styles from "./detailMaintenance.module.css"; // Assurez-vous que le chemin CSS est correct

const MaintenancePage = ({ id }) => {
  return (
    <>
      <Head>
        <title>Maintenance - {id}</title>
      </Head>

      <div className={styles.container}>
        <header className={styles.header}>
          <h1>Détails de l'intervention {id}</h1>
        </header>

        <main className={styles.mainContent}>
          <section className={styles.details}>
            <h2>Détails de l'intervention</h2>
            <p>
              <strong>ID de l'intervention :</strong> {id}
            </p>
            {/* Vous pouvez ajouter plus d'informations dynamiques ici */}
          </section>

          <section className={styles.status}>
            <h2>État de l'intervention</h2>
            <span className={`${styles.etat} ${styles["en-cours"]}`}>
              En cours
            </span>
          </section>

          <section className={styles.actions}>
            {/* Afficher des boutons d'action si nécessaire */}
            <button className={styles.button}>Terminer l'Intervention</button>
            <a href="/technicien/Rapport" className={styles.button}>
              Rédiger le rapport d'Intervention
            </a>
          </section>
        </main>

        <footer className={styles.footer}>
          <p>© 2024 Système de maintenance - Tous droits réservés</p>
        </footer>
      </div>
    </>
  );
};

// Utilisation de getServerSideProps pour récupérer l'ID depuis l'URL
export async function getServerSideProps(context) {
  const { id } = context.params; // On récupère l'ID à partir des params de l'URL

  return {
    props: {
      id, // On passe l'ID en tant que prop à la page
    },
  };
}

export default MaintenancePage;
