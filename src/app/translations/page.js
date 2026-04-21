"use client";
import React, { useEffect, useState } from "react";
import { getTranslation, saveUserResponse } from "@/services/api/translations";
import styles from "./translations.module.scss";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import PageHeader from "@/app/components/PageHeader";
import Confetti from "@/app/components/Confetti";

export default function TranslationsPage() {
  const [translations, setTranslations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [userResponse, setUserResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const res = await getTranslation();
    setTranslations(res);
  };

  const openDetail = (t) => {
    setSelected(t);
    setUserResponse(t.userResponse || "");
    setSubmitted(false);
  };

  const closeDetail = () => {
    setSelected(null);
    setUserResponse("");
    setSubmitted(false);
  };

  const handleSave = async () => {
    if (!selected) return;
    setLoading(true);
    try {
      await saveUserResponse(selected.id, userResponse);
      setSubmitted(true);
      await loadData();
    } catch (error) {
      console.error("Error saving:", error);
    } finally {
      setLoading(false);
    }
  };

  // Detail view
  if (selected) {
    return (
      <ProtectedRoute>
        <PageHeader title="Translate" subtitle="From French, with feeling" />
        <div className={styles.content} style={{ position: "relative" }}>
          <Confetti show={submitted} />

          <button className={styles.backBtn} onClick={closeDetail}>
            &larr; Back to challenges
          </button>

          <div className={styles.chipRow}>
            <span className={`${styles.chip} ${styles.chipSage}`}>
              Level {selected.difficultyLevel || "?"}
            </span>
            <span className={`${styles.chip} ${styles.chipBlue}`}>
              French &rarr; English
            </span>
          </div>

          <h2 className={styles.detailTitle}>{selected.title}</h2>

          <div className={styles.sourceBox}>
            <div className={styles.sourceLine} />
            <div
              className={styles.sourceText}
              dangerouslySetInnerHTML={{ __html: selected.textContent }}
            />
          </div>

          <div className={styles.responseSection}>
            <div className={styles.responseLabel}>Your translation</div>
            <textarea
              className={styles.textarea}
              value={userResponse}
              onChange={(e) => setUserResponse(e.target.value)}
              placeholder="Write your English translation here..."
            />
            <div className={styles.charCount}>
              {userResponse.length} chars
            </div>
          </div>

          <button
            className={styles.submitBtn}
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit translation \u2192"}
          </button>

          {submitted && (
            <div className={styles.feedback}>
              <div className={styles.feedbackHeader}>
                <span style={{ fontSize: 20 }}>{"\u{1F98A}"}</span>
                <span className={styles.feedbackTitle}>Bravo !</span>
              </div>
              <div className={styles.feedbackText}>
                Your translation has been submitted. Check your email for detailed corrections.
              </div>
            </div>
          )}

          {selected.coachNotes && (
            <div className={styles.coachNote}>
              <strong>Coach:</strong> {selected.coachNotes.nuance || JSON.stringify(selected.coachNotes)}
            </div>
          )}
        </div>
      </ProtectedRoute>
    );
  }

  // List view
  const pending = translations.filter((t) => !t.userResponse);
  const done = translations.filter((t) => t.userResponse);

  return (
    <ProtectedRoute>
      <PageHeader title="Translate" subtitle="From French, with feeling" />
      <div className={styles.content}>
        <div className={styles.meta}>
          {pending.length} pending &middot; {done.length} done
        </div>

        <div className={styles.list}>
          {translations.map((t) => (
            <div
              key={t.id}
              className={`${styles.card} ${t.userResponse ? styles.cardDone : ""}`}
              onClick={() => openDetail(t)}
            >
              {t.userResponse && (
                <div className={styles.doneStamp}>
                  <div className={styles.doneStampInner}>DONE</div>
                </div>
              )}
              <div className={styles.chipRow}>
                <span
                  className={`${styles.chip} ${
                    !t.difficultyLevel || t.difficultyLevel === "1"
                      ? styles.chipSage
                      : t.difficultyLevel === "2"
                        ? styles.chipGold
                        : styles.chipTerra
                  }`}
                >
                  LVL {t.difficultyLevel || "?"}
                </span>
              </div>
              <div className={styles.cardTitle}>{t.title}</div>
              <div className={styles.cardPreview}>
                &ldquo;{t.textContent?.replace(/<[^>]+>/g, "").slice(0, 100)}&rdquo;
              </div>
            </div>
          ))}
        </div>
      </div>
    </ProtectedRoute>
  );
}
