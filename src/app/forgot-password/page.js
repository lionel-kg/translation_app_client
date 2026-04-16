"use client";
import React, { useState } from "react";
import Link from "next/link";
import { forgotPassword } from "@/services/api/auth";
import styles from "./forgot-password.module.scss";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await forgotPassword(email);
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.orb1}></div>
      <div className={styles.orb2}></div>

      <div className={styles.card}>
        <div className={styles.header}>
          <h1>Reset Password</h1>
          <p>Enter your email to receive a reset link</p>
        </div>

        {sent ? (
          <div className={styles.success}>
            <p>If an account with that email exists, a reset link has been sent. Check your inbox.</p>
            <Link href="/login" className={styles.backLink}>
              Back to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.form}>
            {error && <div className={styles.error}>{error}</div>}

            <div className={styles.field}>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        )}

        <p className={styles.switchLink}>
          Remember your password? <Link href="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
