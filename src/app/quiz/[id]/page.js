"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { clsx } from "clsx";
import { CheckCircle, XCircle, ArrowRight } from "lucide-react";
import styles from "./quizSession.module.scss";
import { getQuiz, getQuizResults, submitAnswer } from "@/services/api/quiz";
import ProtectedRoute from "@/app/components/ProtectedRoute";

const QuizSession = () => {
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

      // Find first unanswered question
      const firstUnanswered = data.questions.findIndex(
        (q) => q.userAnswer === null,
      );
      if (firstUnanswered === -1) {
        // All answered - show results
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
      setFeedback({
        isCorrect: result.isCorrect,
        userAnswer: answer,
      });
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
      // Quiz complete - load full results
      const full = await getQuizResults(params.id);
      setResults(full);
      setFinished(true);
    }
  };

  const handleMCQClick = (option) => {
    if (feedback) return;
    handleSubmitAnswer(option);
  };

  const handleFillSubmit = (e) => {
    e.preventDefault();
    if (!userInput.trim() || feedback) return;
    handleSubmitAnswer(userInput.trim());
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className={styles.container}>
          <div className={styles.loading}>Loading quiz...</div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!quiz) {
    return (
      <ProtectedRoute>
        <div className={styles.container}>
          <div className={styles.loading}>Quiz not found</div>
        </div>
      </ProtectedRoute>
    );
  }

  // Results screen
  if (finished && results) {
    const scorePercent = (results.score / results.totalItems) * 100;
    return (
      <ProtectedRoute>
        <div className={styles.container}>
          <div className={styles.orb1}></div>
          <div className={styles.orb2}></div>
          <div className={styles.contentWrapper}>
            <div className={styles.resultsCard}>
              <h2>Quiz Complete!</h2>
              <div
                className={clsx(
                  styles.scoreCircle,
                  scorePercent >= 70 ? styles.good : styles.bad,
                )}
              >
                <span className={styles.scoreNum}>{results.score}</span>
                <span className={styles.scoreTotal}>
                  / {results.totalItems}
                </span>
              </div>
              <p className={styles.scoreLabel}>
                {scorePercent >= 90
                  ? "Excellent!"
                  : scorePercent >= 70
                    ? "Great job!"
                    : scorePercent >= 50
                      ? "Keep practicing!"
                      : "Don't give up!"}
              </p>

              {/* Question breakdown */}
              <div className={styles.breakdown}>
                {results.questions.map((q, i) => (
                  <div
                    key={q.id}
                    className={clsx(
                      styles.breakdownItem,
                      q.isCorrect ? styles.correct : styles.incorrect,
                    )}
                  >
                    <span className={styles.breakdownNum}>{i + 1}</span>
                    <span className={styles.breakdownAnswer}>
                      {q.userAnswer || "—"}
                    </span>
                    {!q.isCorrect && (
                      <span className={styles.correctAnswer}>
                        {q.correctAnswer}
                      </span>
                    )}
                    {q.isCorrect ? (
                      <CheckCircle size={18} className={styles.iconCorrect} />
                    ) : (
                      <XCircle size={18} className={styles.iconIncorrect} />
                    )}
                  </div>
                ))}
              </div>

              <button
                className={styles.backBtn}
                onClick={() => router.push("/quiz")}
              >
                Back to Quizzes
              </button>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const question = quiz.questions[currentIndex];
  const isMCQ = quiz.type === "multiple_choice";

  return (
    <ProtectedRoute>
      <div className={styles.container}>
        <div className={styles.orb1}></div>
        <div className={styles.orb2}></div>

        <div className={styles.contentWrapper}>
          {/* Progress */}
          <div className={styles.progress}>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{
                  width: `${(currentIndex / quiz.questions.length) * 100}%`,
                }}
              ></div>
            </div>
            <span className={styles.progressText}>
              {currentIndex + 1} / {quiz.questions.length}
            </span>
          </div>

          <div className={styles.questionCard}>
            <div className={styles.questionType}>
              {isMCQ ? "Multiple Choice" : "Fill in the Blank"}
            </div>

            <h2 className={styles.questionText}>{question.questionText}</h2>

            {/* MCQ Options */}
            {isMCQ && question.options && (
              <div className={styles.options}>
                {question.options.map((option, i) => (
                  <button
                    key={i}
                    className={clsx(
                      styles.optionBtn,
                      feedback &&
                        option === feedback.userAnswer &&
                        (feedback.isCorrect
                          ? styles.optionCorrect
                          : styles.optionWrong),
                      feedback &&
                        !feedback.isCorrect &&
                        option !== feedback.userAnswer &&
                        styles.optionDim,
                    )}
                    onClick={() => handleMCQClick(option)}
                    disabled={!!feedback}
                  >
                    <span className={styles.optionLetter}>
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className={styles.optionText}>{option}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Fill in the blank */}
            {!isMCQ && (
              <form onSubmit={handleFillSubmit} className={styles.fillForm}>
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Type your answer..."
                  disabled={!!feedback}
                  autoFocus
                  className={clsx(
                    styles.fillInput,
                    feedback &&
                      (feedback.isCorrect
                        ? styles.inputCorrect
                        : styles.inputWrong),
                  )}
                />
                {!feedback && (
                  <button
                    type="submit"
                    className={styles.submitBtn}
                    disabled={!userInput.trim()}
                  >
                    Submit
                  </button>
                )}
              </form>
            )}

            {/* Feedback */}
            {feedback && (
              <div
                className={clsx(
                  styles.feedback,
                  feedback.isCorrect
                    ? styles.feedbackCorrect
                    : styles.feedbackWrong,
                )}
              >
                {feedback.isCorrect ? (
                  <>
                    <CheckCircle size={20} /> Correct!
                  </>
                ) : (
                  <>
                    <XCircle size={20} /> Incorrect
                  </>
                )}
              </div>
            )}

            {/* Next button */}
            {feedback && (
              <button className={styles.nextBtn} onClick={handleNext}>
                {currentIndex + 1 < quiz.questions.length ? (
                  <>
                    Next <ArrowRight size={18} />
                  </>
                ) : (
                  "See Results"
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default QuizSession;
