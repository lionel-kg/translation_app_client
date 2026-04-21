"use client";
import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import styles from "./navbar.module.scss";

const navItems = [
  { id: "dashboard", href: "/", icon: "\u{1F3E0}", label: "Home" },
  { id: "translations", href: "/translations", icon: "\u270D\uFE0F", label: "Write" },
  { id: "vocabulary", href: "/words", icon: "\u{1F4DA}", label: "Words" },
  { id: "review", href: "/review", icon: "\u{1F501}", label: "Review" },
  { id: "quiz", href: "/quiz", icon: "\u{1F3AF}", label: "Quiz" },
];

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();

  // Don't show nav on auth pages
  const authPages = ["/login", "/register", "/forgot-password", "/reset-password"];
  if (authPages.includes(pathname)) return null;

  if (loading || !user) return null;

  return (
    <nav className={styles.navbar}>
      {/* Perforation edge */}
      <div className={styles.perforation} />
      <div className={styles.navItems}>
        {navItems.map((item) => {
          const isActive = pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link key={item.id} href={item.href} className={`${styles.navItem} ${isActive ? styles.active : ""}`}>
              <span className={styles.navIcon}>{item.icon}</span>
              <span className={styles.navLabel}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default Navbar;
