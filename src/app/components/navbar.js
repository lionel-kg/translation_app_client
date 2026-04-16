"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  X,
  BookOpen,
  Languages,
  LayoutDashboard,
  RefreshCw,
  Brain,
  LogOut,
  LogIn,
} from "lucide-react";
import { clsx } from "clsx";
import { useAuth } from "@/context/AuthContext";
import styles from "./navbar.module.scss";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  const navItems = [
    { name: "Dashboard", href: "/", icon: <LayoutDashboard size={18} /> },
    { name: "Vocabulary", href: "/words", icon: <BookOpen size={18} /> },
    {
      name: "Translations",
      href: "/translations",
      icon: <Languages size={18} />,
    },
    { name: "Review", href: "/review", icon: <RefreshCw size={18} /> },
    { name: "Quiz", href: "/quiz", icon: <Brain size={18} /> },
  ];

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        {/* LOGO */}
        <Link href="/" className={styles.logo}>
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
            🚀
          </div>
          <span>
            English
            <span style={{ fontWeight: 400, color: "#94a3b8" }}>Master</span>
          </span>
        </Link>

        {/* DESKTOP LINKS */}
        <div className={styles.navLinks}>
          {user &&
            navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  styles.link,
                  pathname === item.href && styles.active,
                )}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
        </div>

        {/* AUTH SECTION (Desktop) */}
        <div className={styles.authSection}>
          {!loading && user ? (
            <div className={styles.userInfo}>
              <span className={styles.userEmail}>{user.email}</span>
              <button className={styles.logoutBtn} onClick={handleLogout}>
                <LogOut size={16} />
                Logout
              </button>
            </div>
          ) : (
            !loading && (
              <Link href="/login" className={styles.loginBtn}>
                <LogIn size={16} />
                Sign In
              </Link>
            )
          )}
        </div>

        {/* MOBILE HAMBURGER BUTTON */}
        <button className={styles.menuBtn} onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* MOBILE MENU DROPDOWN */}
        <div className={clsx(styles.mobileMenu, isOpen && styles.isOpen)}>
          {user &&
            navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  styles.link,
                  pathname === item.href && styles.active,
                )}
                onClick={() => setIsOpen(false)}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}

          {!loading && user ? (
            <button
              className={clsx(styles.link, styles.mobileLogout)}
              onClick={() => {
                setIsOpen(false);
                handleLogout();
              }}
            >
              <LogOut size={18} />
              Logout
            </button>
          ) : (
            !loading && (
              <Link
                href="/login"
                className={styles.link}
                onClick={() => setIsOpen(false)}
              >
                <LogIn size={18} />
                Sign In
              </Link>
            )
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
