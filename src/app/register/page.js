"use client";
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./register.module.scss";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

    const validationErrors = [];
    if (password.length < 8) validationErrors.push("Password must be at least 8 characters");
    if (!/[A-Z]/.test(password)) validationErrors.push("Password must contain an uppercase letter");
    if (!/[a-z]/.test(password)) validationErrors.push("Password must contain a lowercase letter");
    if (!/[0-9]/.test(password)) validationErrors.push("Password must contain a number");
    if (password !== confirmPassword) validationErrors.push("Passwords do not match");

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      await register(email, password);
      router.push("/");
    } catch (err) {
      const serverErrors = err.response?.data?.errors || [
        err.response?.data?.error || "Registration failed",
      ];
      setErrors(Array.isArray(serverErrors) ? serverErrors : [serverErrors]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.stampIcon}>
          <div className={styles.stampInner}>{"\u{1F98A}"}</div>
        </div>

        <div className={styles.header}>
          <h1>Create Account</h1>
          <p>Start your language journey</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {errors.length > 0 && (
            <div className={styles.errorList}>
              {errors.map((err, i) => (
                <div key={i} className={styles.errorItem}>{err}</div>
              ))}
            </div>
          )}

          <div className={styles.field}>
            <label htmlFor="email">Email</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
          </div>
          <div className={styles.field}>
            <label htmlFor="password">Password</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 8 chars, upper + lower + number" required />
          </div>
          <div className={styles.field}>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Repeat your password" required />
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? "Creating account..." : "Create Account \u2192"}
          </button>
        </form>

        <p className={styles.switchLink}>
          Already have an account? <Link href="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
