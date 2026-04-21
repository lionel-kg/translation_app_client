"use client";
import React, { useState, useEffect } from "react";
import styles from "./words.module.scss";
import { getWords } from "@/services/api/words";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import PageHeader from "@/app/components/PageHeader";

const FlipCard = ({ word }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const color = word.type?.toLowerCase() === "idiom" ? "terra" : "blue";

  return (
    <div className={styles.cardOuter} onClick={() => setIsFlipped(!isFlipped)}>
      <div className={`${styles.cardInner} ${isFlipped ? styles.flipped : ""}`}>
        {/* Front */}
        <div className={styles.cardFront}>
          <span className={`${styles.chip} ${styles[`chip_${color}`]}`}>{word.type}</span>
          <div className={styles.expression}>{word.expression}</div>
          <div className={styles.flipHint}>flip &rarr;</div>
        </div>
        {/* Back */}
        <div className={`${styles.cardBack} ${styles[`back_${color}`]}`}>
          <div className={styles.backLabel}>Definition</div>
          <div className={styles.definition}>{word.definition}</div>
          <div className={styles.example}>&ldquo;{word.example}&rdquo;</div>
        </div>
      </div>
    </div>
  );
};

export default function VocabularyPage() {
  const [words, setWords] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    getWords().then(setWords).catch(() => {});
  }, []);

  const totalPages = Math.ceil((words?.length || 0) / itemsPerPage);
  const currentWords = words?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <ProtectedRoute>
      <PageHeader title="Vocabulary" subtitle="Pocket dictionary" />
      <div className={styles.content}>
        <div className={styles.meta}>
          {words?.length || 0} words &middot; tap to flip
        </div>

        <div className={styles.grid}>
          {currentWords?.map((word) => (
            <FlipCard key={word.id} word={word} />
          ))}
        </div>

        {totalPages > 1 && (
          <div className={styles.pagination}>
            <button
              className={styles.pageBtn}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              &larr; Prev
            </button>
            <span className={styles.pageInfo}>
              {currentPage} / {totalPages}
            </span>
            <button
              className={styles.pageBtn}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next &rarr;
            </button>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
