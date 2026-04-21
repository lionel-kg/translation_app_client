"use client";
import React, { useState, useEffect } from "react";
import styles from "./review.module.scss";
import { getDueWords, submitReview } from "@/services/api/review";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import PageHeader from "@/app/components/PageHeader";
import Confetti from "@/app/components/Confetti";

export default function ReviewPage() {
  const [dueWords, setDueWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [rated, setRated] = useState(false);
  const [finished, setFinished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reviewed, setReviewed] = useState(0);

  useEffect(() => {
    loadDueWords();
  }, []);

  const loadDueWords = async () => {
    try {
      const words = await getDueWords();
      setDueWords(words);
    } catch (error) {
      console.error("Error loading due words:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRate = async (quality) => {
    const word = dueWords[currentIndex];
    try {
      await submitReview(word.id, quality);
      setReviewed((prev) => prev + 1);
    } catch (error) {
      console.error("Error submitting review:", error);
    }

    setRated(true);
    setTimeout(() => {
      setRated(false);
      setIsFlipped(false);
      if (currentIndex + 1 < dueWords.length) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        setFinished(true);
      }
    }, 900);
  };

  const total = dueWords.length;
  const word = dueWords[currentIndex];

  return (
    <ProtectedRoute>
      <PageHeader title="Review" subtitle="Keep it in memory" />
      <div className={styles.content} style={{ position: "relative" }}>
        <Confetti show={rated} />

        {loading ? (
          <div className={styles.emptyState}>Loading...</div>
        ) : total === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>{"\u{1F389}"}</div>
            <h2>All caught up!</h2>
            <p>No words due for review today.</p>
          </div>
        ) : finished ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>{"\u{1F3C6}"}</div>
            <h2>Session complete!</h2>
            <p>You reviewed {reviewed} word{reviewed !== 1 ? "s" : ""}.</p>
            <button
              className={styles.restartBtn}
              onClick={() => {
                setCurrentIndex(0);
                setFinished(false);
                setReviewed(0);
                setLoading(true);
                loadDueWords();
              }}
            >
              Start New Session
            </button>
          </div>
        ) : (
          <>
            {/* Progress bar */}
            <div className={styles.progressRow}>
              <div className={styles.progressTrack}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${((currentIndex + 1) / total) * 100}%` }}
                />
              </div>
              <span className={styles.progressText}>
                {currentIndex + 1}/{total}
              </span>
            </div>

            {/* Card */}
            <div
              className={styles.cardOuter}
              onClick={() => !isFlipped && setIsFlipped(true)}
              style={{ cursor: isFlipped ? "default" : "pointer" }}
            >
              <div className={`${styles.cardInner} ${isFlipped ? styles.flipped : ""}`}>
                {/* Front */}
                <div className={styles.cardFront}>
                  <div className={styles.frontTop}>
                    <span className={styles.chip}>{word?.type}</span>
                    <span className={styles.dueLabel}>DUE TODAY</span>
                  </div>
                  <div className={styles.frontExpr}>{word?.expression}</div>
                  <div className={styles.frontHint}>tap to reveal &darr;</div>
                </div>
                {/* Back */}
                <div className={styles.cardBack}>
                  <div className={styles.backLabel}>Definition</div>
                  <div className={styles.backDef}>{word?.definition}</div>
                  <div className={styles.backExample}>
                    &ldquo;{word?.example}&rdquo;
                  </div>
                </div>
              </div>
            </div>

            {/* Rating buttons */}
            {isFlipped && !rated && (
              <>
                <div className={styles.rateLabel}>How well did you know it?</div>
                <div className={styles.rateGrid}>
                  {[
                    { q: 0, label: "Again", emoji: "\u{1FAE0}", color: "stamp" },
                    { q: 2, label: "Hard", emoji: "\u{1F62C}", color: "gold" },
                    { q: 4, label: "Good", emoji: "\u{1F642}", color: "sage" },
                    { q: 5, label: "Easy", emoji: "\u{1F60E}", color: "blue" },
                  ].map((b) => (
                    <button
                      key={b.label}
                      className={`${styles.rateBtn} ${styles[`rateBtn_${b.color}`]}`}
                      onClick={() => handleRate(b.q)}
                    >
                      <span className={styles.rateEmoji}>{b.emoji}</span>
                      {b.label}
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* Rated feedback */}
            {rated && (
              <div className={styles.ratedFeedback}>
                <div style={{ fontSize: 44 }}>{"\u{1F98A}"}</div>
                <div className={styles.ratedText}>Excellent !</div>
              </div>
            )}
          </>
        )}
      </div>
    </ProtectedRoute>
  );
}
