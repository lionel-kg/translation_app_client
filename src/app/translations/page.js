"use client";
import React, { useEffect, useState } from "react";
import { getTranslation, saveUserResponse } from "@/services/api/translations";
import { clsx } from "clsx";
import styles from "./translations.module.scss";
import ProtectedRoute from "@/app/components/ProtectedRoute";

const TranslationsPage = () => {
  const [translations, setTranslations] = useState([]);
  const [selectedTranslation, setSelectedTranslation] = useState(null);
  const [userResponse, setUserResponse] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const res = await getTranslation();
    setTranslations(res);
  };

  const openDetail = (translation) => {
    setSelectedTranslation(translation);
    setUserResponse(translation.userResponse || "");
  };

  const closeDetail = () => {
    setSelectedTranslation(null);
    setUserResponse("");
  };

  const handleSave = async () => {
    if (!selectedTranslation) return;
    setLoading(true);
    try {
      await saveUserResponse(selectedTranslation.id, userResponse);
      // Optionnel: Ajouter un Toast ici
      await loadData();
      closeDetail();
    } catch (error) {
      console.error("Erreur sauvegarde", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
    <div className={styles.container}>
      {/* Background Orbs */}
      <div className={clsx(styles.orb, styles.orb1)}></div>
      <div className={clsx(styles.orb, styles.orb2)}></div>

      <div className={styles.contentWrapper}>
        <header className={styles.header}>
          <h1>Translation Challenges</h1>
          <p style={{ color: "#94a3b8", marginTop: "0.5rem" }}>
            Practice your writing skills.
          </p>
        </header>

        {/* --- GRILLE --- */}
        <div className={styles.grid}>
          {translations.map((t) => (
            <div
              key={t.id}
              onClick={() => openDetail(t)}
              className={clsx(
                styles.card,
                t.userResponse && styles.cardDone, // Ajoute la classe si fait
              )}
            >
              <h3>{t.title}</h3>

              {/* Aperçu du texte sans HTML */}
              <div className={styles.preview}>
                {t.textContent.replace(/<[^>]+>/g, "")}
              </div>

              <div className={styles.meta}>
                <span>Level: {t.difficultyLevel}</span>
                {t.userResponse && (
                  <span className={styles.status}>Completed</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* --- MODAL --- */}
        {selectedTranslation && (
          <div className={styles.modalOverlay} onClick={closeDetail}>
            <div
              className={styles.modalContent}
              onClick={(e) => e.stopPropagation()}
            >
              <button className={styles.closeBtn} onClick={closeDetail}>
                ✕
              </button>

              <h2>{selectedTranslation.title}</h2>

              {/* Texte Original (Style sombre) */}
              <div
                className={styles.originalText}
                dangerouslySetInnerHTML={{
                  __html: selectedTranslation.textContent,
                }}
              />

              {/* Zone de réponse */}
              <div className={styles.inputGroup}>
                <label>Your Translation</label>
                <textarea
                  value={userResponse}
                  onChange={(e) => setUserResponse(e.target.value)}
                  placeholder="Translate the text above here..."
                  autoFocus
                />
              </div>

              {/* Actions */}
              <div className={styles.actions}>
                <button className={styles.btnCancel} onClick={closeDetail}>
                  Cancel
                </button>
                <button
                  className={styles.btnSave}
                  onClick={handleSave}
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Submit Translation"}
                </button>
              </div>

              {/* Notes Coach */}
              {selectedTranslation.coachNotes && (
                <div className={styles.coachNotes}>
                  <strong>💡 Coach Note:</strong>{" "}
                  {selectedTranslation.coachNotes.nuance}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
    </ProtectedRoute>
  );
};

export default TranslationsPage;
