"use client";
import React, { useState, useEffect } from "react";
import { clsx } from "clsx";
import styles from "./words.module.scss";
import { getWords } from "@/services/api/words";
import ProtectedRoute from "@/app/components/ProtectedRoute";

const FlipCard = ({ word }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className={clsx(styles.cardContainer, styles[word.size || "normal"])}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className={clsx(styles.cardInner, isFlipped && styles.isFlipped)}>
        {/* RECTO */}
        <div className={clsx(styles.cardFace, styles.cardFront)}>
          <div className="flex justify-between">
            <span
              className={clsx(styles.badge, styles[word.type?.toLowerCase()])}
            >
              {word.type}
            </span>
          </div>
          <div
            className={clsx(
              styles.expression,
              word.size === "large" && styles.largeText,
            )}
          >
            {word.expression}
          </div>
          <div className={styles.hint}>Click to reveal 👇</div>
        </div>

        {/* VERSO */}
        <div className={clsx(styles.cardFace, styles.cardBack)}>
          <div>
            <h4
              style={{
                textTransform: "uppercase",
                fontSize: "0.7rem",
                color: "#64748b",
                marginBottom: "5px",
              }}
            >
              Definition
            </h4>
            <p className={styles.definition}>{word.definition}</p>
          </div>
          <div className={styles.exampleBox}>"{word.example}"</div>
        </div>
      </div>
    </div>
  );
};

const VocabularyBento = () => {
  const [words, setWords] = useState([]);

  // --- ÉTATS POUR LA PAGINATION ---
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12); // Nombre de cartes par page

  useEffect(() => {
    const getData = async () => {
      const data = await getWords();
      setWords(data);
    };
    getData();
  }, []);

  // --- LOGIQUE DE CALCUL ---
  const indexOfLastWord = currentPage * itemsPerPage;
  const indexOfFirstWord = indexOfLastWord - itemsPerPage;
  // On découpe le tableau complet pour n'afficher que la page actuelle
  const currentWords = words?.slice(indexOfFirstWord, indexOfLastWord);

  const totalPages = Math.ceil(words?.length / itemsPerPage);

  // --- HANDLERS ---
  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
      scrollToTop();
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
      scrollToTop();
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <ProtectedRoute>
      <div className={styles.pageContainer}>
        <div className={clsx(styles.orb, styles.orb1)}></div>
        <div className={clsx(styles.orb, styles.orb2)}></div>

        <div className={styles.contentWrapper}>
          <header className={styles.header}>
            <div className="p-2">
              <h1>Daily vocabulary</h1>
            </div>
            {/* Petit indicateur du total */}
            <div style={{ textAlign: "right", color: "#64748b" }}>
              {words?.length} Words Total
            </div>
          </header>

          {/* GRILLE (Affiche uniquement currentWords) */}
          <div className={styles.grid}>
            {currentWords?.map((word) => (
              <FlipCard key={word.id} word={word} />
            ))}
          </div>

          {/* --- CONTRÔLES DE PAGINATION --- */}
          {words?.length > itemsPerPage && (
            <div className={styles.paginationContainer}>
              <button
                className={styles.pageBtn}
                onClick={handlePrev}
                disabled={currentPage === 1}
              >
                ← Previous
              </button>

              <span className={styles.pageInfo}>
                Page {currentPage} of {totalPages}
              </span>

              <button
                className={styles.pageBtn}
                onClick={handleNext}
                disabled={currentPage === totalPages}
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default VocabularyBento;
