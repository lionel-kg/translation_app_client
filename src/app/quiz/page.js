"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./quiz.module.scss";
import { generateQuiz, getQuizHistory } from "@/services/api/quiz";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import PageHeader from "@/app/components/PageHeader";

export default function QuizPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const data = await getQuizHistory();
      setHistory(data);
    } catch (err) {
      console.error("Error loading history:", err);
    }
  };

  const startQuiz = async (type) => {
    setLoading(type);
    setError("");
    try {
      const quiz = await generateQuiz(type, 10);
      router.push(`/quiz/${quiz.id}`);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to start quiz");
    } finally {
      setLoading(null);
    }
  };

  return (
    <ProtectedRoute>
      <PageHeader title="Quiz" subtitle="Test your memory" />
      <div className={styles.content}>
        {error && <div className={styles.error}>{error}</div>}

        {/* Quiz type cards */}
        <div className={styles.typeGrid}>
          <button
            className={`${styles.typeCard} ${styles.typeCard_terra}`}
            onClick={() => !loading && startQuiz("multiple_choice")}
            disabled={loading === "multiple_choice"}
          >
            <div className={styles.typeIcon}>{"\u{1F3AF}"}</div>
            <div className={styles.typeLabel}>Multiple choice</div>
            <div className={styles.typeSub}>10 Q &middot; 4 options</div>
          </button>
          <button
            className={`${styles.typeCard} ${styles.typeCard_blue}`}
            onClick={() => !loading && startQuiz("fill_in_the_blank")}
            disabled={loading === "fill_in_the_blank"}
          >
            <div className={styles.typeIcon}>{"\u270F\uFE0F"}</div>
            <div className={styles.typeLabel}>Fill the blank</div>
            <div className={styles.typeSub}>10 Q &middot; type it</div>
          </button>
        </div>

        {/* History */}
        {history.length > 0 && (
          <>
            <div className={styles.historyLabel}>{"\u{1F3C6}"} History</div>
            <div className={styles.historyList}>
              {history.map((h) => {
                const pct = h.score / h.totalItems;
                const good = pct >= 0.8;
                return (
                  <div key={h.id} className={styles.historyItem}>
                    <div className={`${styles.historyScore} ${good ? styles.historyScoreGood : styles.historyScoreWarn}`}>
                      {h.score}/{h.totalItems}
                    </div>
                    <div className={styles.historyInfo}>
                      <div className={styles.historyType}>
                        {h.type === "multiple_choice" ? "Multiple choice" : "Fill blank"}
                      </div>
                      <div className={styles.historyDate}>
                        {new Date(h.completedAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className={styles.historyStar}>{good ? "\u2605" : "\u2022"}</div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </ProtectedRoute>
  );
}
