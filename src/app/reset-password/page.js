"use client";
import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { resetPassword } from "@/services/api/auth";
import styles from "./reset-password.module.scss";

const ResetPasswordPage = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

    const validationErrors = [];
    if (password.length < 8) {
      validationErrors.push("Password must be at least 8 characters");
    }
    if (!/[A-Z]/.test(password)) {
      validationErrors.push("Password must contain an uppercase letter");
    }
    if (!/[a-z]/.test(password)) {
      validationErrors.push("Password must contain a lowercase letter");
    }
    if (!/[0-9]/.test(password)) {
      validationErrors.push("Password must contain a number");
    }
    if (password !== confirmPassword) {
      validationErrors.push("Passwords do not match");
    }

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      await resetPassword(token, password);
      setSuccess(true);
    } catch (err) {
      setErrors([err.response?.data?.error || "Reset failed"]);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className={styles.container}>
        <div className={styles.orb1}></div>
        <div className={styles.orb2}></div>
        <div className={styles.card}>
          <div className={styles.header}>
            <h1>Invalid Link</h1>
            <p>This reset link is missing or malformed.</p>
          </div>
          <p className={styles.switchLink}>
            <Link href="/forgot-password">Request a new link</Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.orb1}></div>
      <div className={styles.orb2}></div>

      <div className={styles.card}>
        <div className={styles.header}>
          <h1>New Password</h1>
          <p>Enter your new password below</p>
        </div>

        {success ? (
          <div className={styles.success}>
            <p>Your password has been reset successfully!</p>
            <Link href="/login" className={styles.backLink}>
              Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.form}>
            {errors.length > 0 && (
              <div className={styles.errorList}>
                {errors.map((err, i) => (
                  <div key={i} className={styles.errorItem}>
                    {err}
                  </div>
                ))}
              </div>
            )}

            <div className={styles.field}>
              <label htmlFor="password">New Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 8 chars, upper + lower + number"
                required
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat your password"
                required
              />
            </div>

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}

        <p className={styles.switchLink}>
          <Link href="/login">Back to Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
