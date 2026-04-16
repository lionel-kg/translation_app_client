"use client";
import React, { useState, useEffect } from "react";
import { clsx } from "clsx";
import styles from "./review.module.scss";
import { getDueWords, submitReview } from "@/services/api/review";
import RatingModal from "@/app/components/RatingModal";
import ProtectedRoute from "@/app/components/ProtectedRoute";

const FlipCard = ({ word, isFlipped, onFlip }) => {
  const handleClick = () => {
    if (!isFlipped) onFlip();
  };

  return (
    <div className={styles.cardContainer} onClick={handleClick}>
      <div className={clsx(styles.cardInner, isFlipped && styles.isFlipped)}>
        <div className={clsx(styles.cardFace, styles.cardFront)}>
          <span className={styles.badge}>{word.type}</span>
          <div className={styles.expression}>{word.expression}</div>
          <div className={styles.hint}>Click to reveal</div>
        </div>
        <div className={clsx(styles.cardFace, styles.cardBack)}>
          <div>
            <h4 className={styles.sectionLabel}>Definition</h4>
            <p className={styles.definition}>{word.definition}</p>
          </div>
          <div className={styles.exampleBox}>&ldquo;{word.example}&rdquo;</div>
        </div>
      </div>
    </div>
  );
};

const ReviewPage = () => {
  const [dueWords, setDueWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showRating, setShowRating] = useState(false);
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

  const handleFlip = () => {
    setIsFlipped(true);
  };

  const handleNext = () => {
    setShowRating(true);
  };

  const handleRate = async (quality) => {
    const word = dueWords[currentIndex];
    try {
      await submitReview(word.id, quality);
      setReviewed((prev) => prev + 1);
    } catch (error) {
      console.error("Error submitting review:", error);
    }

    setShowRating(false);
    setIsFlipped(false);

    if (currentIndex + 1 < dueWords.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setFinished(true);
    }
  };

  const currentWord = dueWords[currentIndex];

  return (
    <ProtectedRoute>
      <div className={styles.container}>
        <div className={styles.orb1}></div>
        <div className={styles.orb2}></div>

        <div className={styles.contentWrapper}>
          <header className={styles.header}>
            <h1>Daily Review</h1>
            <p className={styles.subtitle}>
              Spaced repetition for long-term memory
            </p>
          </header>

          {loading ? (
            <div className={styles.emptyState}>Loading...</div>
          ) : dueWords.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>🎉</div>
              <h2>All caught up!</h2>
              <p>No words due for review today. Come back later.</p>
            </div>
          ) : finished ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>🏆</div>
              <h2>Session complete!</h2>
              <p>
                You reviewed {reviewed} word{reviewed !== 1 ? "s" : ""}.
              </p>
              <button className={styles.restartBtn} onClick={() => {
                setCurrentIndex(0);
                setFinished(false);
                setReviewed(0);
                loadDueWords();
              }}>
                Start New Session
              </button>
            </div>
          ) : (
            <>
              <div className={styles.progress}>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{
                      width: `${((currentIndex) / dueWords.length) * 100}%`,
                    }}
                  ></div>
                </div>
                <span className={styles.progressText}>
                  {currentIndex + 1} / {dueWords.length}
                </span>
              </div>

              <div className={styles.cardArea}>
                <FlipCard
                  key={currentWord.id}
                  word={currentWord}
                  isFlipped={isFlipped}
                  onFlip={handleFlip}
                />
              </div>

              {isFlipped && !showRating && (
                <div className={styles.nextBtnWrapper}>
                  <button className={styles.nextBtn} onClick={handleNext}>
                    Next
                  </button>
                </div>
              )}
            </>
          )}

          {showRating && <RatingModal onRate={handleRate} />}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ReviewPage;
