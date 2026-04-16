"use client";
import React from "react";
import styles from "./RatingModal.module.scss";

const ratings = [
  { value: 0, label: "Again", color: "#ef4444" },
  { value: 1, label: "Hard", color: "#f97316" },
  { value: 2, label: "Difficult", color: "#eab308" },
  { value: 3, label: "OK", color: "#84cc16" },
  { value: 4, label: "Good", color: "#22c55e" },
  { value: 5, label: "Perfect", color: "#10b981" },
];

const RatingModal = ({ onRate }) => {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h3 className={styles.title}>How well did you know this?</h3>
        <div className={styles.buttons}>
          {ratings.map((r) => (
            <button
              key={r.value}
              className={styles.rateBtn}
              style={{
                background: `${r.color}20`,
                borderColor: `${r.color}50`,
                color: r.color,
              }}
              onClick={() => onRate(r.value)}
            >
              <span className={styles.rateValue}>{r.value}</span>
              <span className={styles.rateLabel}>{r.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RatingModal;
