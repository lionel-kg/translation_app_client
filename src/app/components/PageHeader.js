"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import styles from "./PageHeader.module.scss";

export default function PageHeader({ title, subtitle, right }) {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <div className={styles.header}>
      <div className={styles.row}>
        <h1 className={styles.title}>{title}</h1>
        <div className={styles.actions}>
          {right}
          <button className={styles.logoutBtn} onClick={handleLogout} title="Logout">
            ↗
          </button>
        </div>
      </div>
      {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
    </div>
  );
}
