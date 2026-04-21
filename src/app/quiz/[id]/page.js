"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "./quizSession.module.scss";
import { getQuiz, getQuizResults, submitAnswer } from "@/services/api/quiz";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import PageHeader from "@/app/components/PageHeader";
import Confetti from "@/app/components/Confetti";

export default function QuizSession() {
  const params = useParams();
  const router = useRouter();
  const [quiz, setQuiz] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [finished, setFinished] = useState(false);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuiz();
  }, []);

  const loadQuiz = async () => {
    try {
      const data = await getQuiz(params.id);
      setQuiz(data);
      const firstUnanswered = data.questions.findIndex((q) => q.userAnswer === null);
      if (firstUnanswered === -1) {
        const full = await getQuizResults(params.id);
        setResults(full);
        setFinished(true);
      } else {
        setCurrentIndex(firstUnanswered);
      }
    } catch (error) {
      console.error("Error loading quiz:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = async (answer) => {
    const question = quiz.questions[currentIndex];
    try {
      const result = await submitAnswer(question.id, answer);
      setFeedback({ isCorrect: result.isCorrect, userAnswer: answer });
    } catch (error) {
      console.error("Error submitting answer:", error);
    }
  };

  const handleNext = async () => {
    setFeedback(null);
    setUserInput("");
    if (currentIndex + 1 < quiz.questions.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      const full = await getQuizResults(params.id);
      setResults(full);
      setFinished(true);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <PageHeader title="Quiz" subtitle="Loading..." />
        <div className={styles.content}>
          <div className={styles.emptyState}>Loading quiz...</div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!quiz) {
    return (
      <ProtectedRoute>
        <PageHeader title="Quiz" subtitle="Not found" />
        <div className={styles.content}>
          <div className={styles.emptyState}>Quiz not found</div>
        </div>
      </ProtectedRoute>
    );
  }

  // Results
  if (finished && results) {
    const scorePercent = (results.score / results.totalItems) * 100;
    return (
      <ProtectedRoute>
        <PageHeader title="Quiz" subtitle="Results" />
        <div className={styles.content}>
          <div className={styles.resultsCard}>
            <div className={styles.resultsTitle}>Session complete!</div>
            <div className={`${styles.scoreCircle} ${scorePercent >= 70 ? styles.scoreGood : styles.scoreBad}`}>
              <span className={styles.scoreNum}>{results.score}</span>
              <span className={styles.scoreTotal}>/ {results.totalItems}</span>
            </div>
            <div className={styles.scoreLabel}>
              {scorePercent >= 90
                ? "Excellent!"
                : scorePercent >= 70
                  ? "Great job!"
                  : scorePercent >= 50
                    ? "Keep practicing!"
                    : "Don't give up!"}
            </div>

            <div className={styles.breakdown}>
              {results.questions?.map((q, i) => (
                <div
                  key={q.id}
                  className={`${styles.breakdownItem} ${q.isCorrect ? styles.breakdownCorrect : styles.breakdownWrong}`}
                >
                  <span className={styles.breakdownNum}>{i + 1}</span>
                  <span className={styles.breakdownAnswer}>{q.userAnswer || "\u2014"}</span>
                  {!q.isCorrect && (
                    <span className={styles.breakdownCorrectAnswer}>{q.correctAnswer}</span>
                  )}
                  <span>{q.isCorrect ? "\u2713" : "\u2717"}</span>
                </div>
              ))}
            </div>

            <button className={styles.backBtn} onClick={() => router.push("/quiz")}>
              Back to Quizzes
            </button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const question = quiz.questions[currentIndex];
  const isMCQ = quiz.type === "multiple_choice";

  return (
    <ProtectedRoute>
      <PageHeader title="Quiz" subtitle="Test your memory" />
      <div className={styles.content} style={{ position: "relative" }}>
        <Confetti show={feedback?.isCorrect} />

        {/* Progress */}
        <div className={styles.progressRow}>
          {Array.from({ length: quiz.questions.length }).map((_, i) => (
            <div
              key={i}
              className={`${styles.progressDot} ${i <= currentIndex ? styles.progressDotActive : ""}`}
            />
          ))}
        </div>
        <div className={styles.questionMeta}>
          Question {currentIndex + 1} / {quiz.questions.length}
        </div>

        <h2 className={styles.questionText}>{question.questionText}</h2>

        {/* MCQ */}
        {isMCQ && question.options && (
          <div className={styles.options}>
            {question.options.map((option, i) => {
              const isPicked = feedback?.userAnswer === option;
              const showResult = feedback !== null;
              const isCorrect = showResult && option === question.correctAnswer;
              let cls = styles.option;
              if (showResult && isCorrect) cls += ` ${styles.optionCorrect}`;
              else if (showResult && isPicked) cls += ` ${styles.optionWrong}`;
              else if (showResult) cls += ` ${styles.optionDim}`;
              return (
                <button
                  key={i}
                  className={cls}
                  onClick={() => !feedback && handleSubmitAnswer(option)}
                  disabled={!!feedback}
                >
                  <span className={styles.optionLetter}>{String.fromCharCode(65 + i)}</span>
                  {option}
                </button>
              );
            })}
          </div>
        )}

        {/* Fill in the blank */}
        {!isMCQ && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!userInput.trim() || feedback) return;
              handleSubmitAnswer(userInput.trim());
            }}
            className={styles.fillForm}
          >
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type your answer..."
              disabled={!!feedback}
              autoFocus
              className={`${styles.fillInput} ${feedback ? (feedback.isCorrect ? styles.fillCorrect : styles.fillWrong) : ""}`}
            />
            {!feedback && (
              <button type="submit" className={styles.fillSubmit} disabled={!userInput.trim()}>
                Submit
              </button>
            )}
          </form>
        )}

        {/* Feedback */}
        {feedback && (
          <div className={`${styles.feedbackBar} ${feedback.isCorrect ? styles.feedbackCorrect : styles.feedbackWrong}`}>
            {feedback.isCorrect ? "\u2713 Correct!" : "\u2717 Incorrect"}
          </div>
        )}

        {/* Next button */}
        {feedback && (
          <button className={styles.nextBtn} onClick={handleNext}>
            {currentIndex + 1 < quiz.questions.length ? "Next question \u2192" : "See Results"}
          </button>
        )}
      </div>
    </ProtectedRoute>
  );
}
