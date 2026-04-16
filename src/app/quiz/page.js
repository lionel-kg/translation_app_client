"use client";
import React, { useState, useEffect } from "react";
import { clsx } from "clsx";
import { useRouter } from "next/navigation";
import { HelpCircle, Pencil, Trophy } from "lucide-react";
import styles from "./quiz.module.scss";
import { generateQuiz, getQuizHistory } from "@/services/api/quiz";
import ProtectedRoute from "@/app/components/ProtectedRoute";

const QuizPage = () => {
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
      <div className={styles.container}>
        <div className={styles.orb1}></div>
        <div className={styles.orb2}></div>

        <div className={styles.contentWrapper}>
          <header className={styles.header}>
            <h1>Quiz</h1>
            <p className={styles.subtitle}>
              Test your vocabulary knowledge
            </p>
          </header>

          {error && <div className={styles.error}>{error}</div>}

          {/* Quiz type cards */}
          <div className={styles.quizTypes}>
            <div
              className={clsx(styles.typeCard, styles.mcq)}
              onClick={() => !loading && startQuiz("multiple_choice")}
            >
              <div className={styles.typeIcon}>
                <HelpCircle size={32} />
              </div>
              <h3>Multiple Choice</h3>
              <p>Match definitions to expressions. 4 options per question.</p>
              <button
                className={styles.startBtn}
                disabled={loading === "multiple_choice"}
              >
                {loading === "multiple_choice" ? "Starting..." : "Start Quiz"}
              </button>
            </div>

            <div
              className={clsx(styles.typeCard, styles.fill)}
              onClick={() => !loading && startQuiz("fill_in_the_blank")}
            >
              <div className={styles.typeIcon}>
                <Pencil size={32} />
              </div>
              <h3>Fill in the Blank</h3>
              <p>Complete sentences with the correct expression.</p>
              <button
                className={styles.startBtn}
                disabled={loading === "fill_in_the_blank"}
              >
                {loading === "fill_in_the_blank"
                  ? "Starting..."
                  : "Start Quiz"}
              </button>
            </div>
          </div>

          {/* History */}
          {history.length > 0 && (
            <div className={styles.historySection}>
              <h2>
                <Trophy size={20} />
                Quiz History
              </h2>
              <div className={styles.historyList}>
                {history.map((quiz) => (
                  <div key={quiz.id} className={styles.historyItem}>
                    <div className={styles.historyInfo}>
                      <span className={styles.historyType}>
                        {quiz.type === "multiple_choice"
                          ? "Multiple Choice"
                          : "Fill in the Blank"}
                      </span>
                      <span className={styles.historyDate}>
                        {new Date(quiz.completedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className={styles.historyScore}>
                      <span
                        className={clsx(
                          styles.score,
                          quiz.score / quiz.totalItems >= 0.7
                            ? styles.scoreGood
                            : styles.scoreBad,
                        )}
                      >
                        {quiz.score}/{quiz.totalItems}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default QuizPage;
