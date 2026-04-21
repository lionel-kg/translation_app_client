"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { getDashboardStats } from "@/services/api/dashboard";
import PageHeader from "@/app/components/PageHeader";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import styles from "./page.module.scss";

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .catch(() => {});
  }, []);

  const streak = stats?.streak || 0;
  const streakDots = Array.from({ length: 7 }, (_, i) => i < streak);

  return (
    <ProtectedRoute>
      <PageHeader title="Polyglot" subtitle="Your language notebook" />
      <div className={styles.content}>
        {/* Hero — passport-style header */}
        <div className={styles.hero}>
          <div className={styles.heroMeta}>Carnet &middot; Day {streak || 1}</div>
          <div className={styles.heroTitle}>
            Bonjour, <em className={styles.heroName}>{user?.email?.split("@")[0] || "Explorer"}</em>
          </div>
          <div className={styles.heroSub}>
            <strong>{stats?.wordsDueForReview || 0} words</strong> to review &middot;{" "}
            <strong>{stats?.pendingTranslations || 0} translations</strong> waiting
          </div>

          {/* Fox stamp */}
          <div className={styles.stamp}>
            <div className={styles.stampInner}>{"\u{1F98A}"}</div>
          </div>

          {/* Streak */}
          <div className={styles.streakRow}>
            <span className={styles.streakLabel}>STREAK</span>
            {streakDots.map((active, i) => (
              <span key={i} className={`${styles.streakDot} ${active ? styles.streakDotActive : ""}`}>
                {active ? "\u2713" : ""}
              </span>
            ))}
            <span className={styles.streakCount}>{streak}</span>
          </div>
        </div>

        {/* Today's recommended */}
        <div className={styles.sectionLabel}>Aujourd'hui &middot; Recommended</div>
        <Link href="/translations" className={styles.featuredCard}>
          <div className={styles.chipRow}>
            <span className={`${styles.chip} ${styles.chipTerra}`}>Translation</span>
            <span className={`${styles.chip} ${styles.chipSage}`}>
              {stats?.pendingTranslations || 0} pending
            </span>
          </div>
          <div className={styles.featuredTitle}>Start a translation challenge</div>
          <div className={styles.featuredPreview}>
            "Practice your English by translating French texts..."
          </div>
        </Link>

        {/* Quick links grid */}
        <div className={styles.quickGrid}>
          {[
            { href: "/words", icon: "\u{1F4DA}", label: "Vocabulary", sub: `${stats?.totalWords || 0} words`, color: "sage" },
            { href: "/review", icon: "\u{1F501}", label: "Review", sub: `${stats?.wordsDueForReview || 0} due`, color: "gold" },
            { href: "/quiz", icon: "\u{1F3AF}", label: "Quiz", sub: stats?.recentBestQuiz ? `Best: ${stats.recentBestQuiz.score}/${stats.recentBestQuiz.totalItems}` : "Start now", color: "blue" },
            { href: "/translations", icon: "\u270D\uFE0F", label: "Translate", sub: `${stats?.pendingTranslations || 0} waiting`, color: "terra" },
          ].map((item) => (
            <Link key={item.href} href={item.href} className={styles.quickCard}>
              <div className={`${styles.quickIcon} ${styles[`quickIcon_${item.color}`]}`}>
                {item.icon}
              </div>
              <div className={styles.quickLabel}>{item.label}</div>
              <div className={styles.quickSub}>{item.sub}</div>
            </Link>
          ))}
        </div>

        {/* Fox note */}
        <div className={styles.foxNote}>
          <div className={styles.foxEmoji}>{"\u{1F98A}"}</div>
          <div>
            <div className={styles.foxText}>
              "Ready to learn something new today? Your vocabulary is waiting!"
            </div>
            <div className={styles.foxSig}>&mdash; Renard, ton compagnon</div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
