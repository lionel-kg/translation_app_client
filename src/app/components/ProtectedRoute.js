"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#f5f1e6",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#6b6257",
          fontFamily: "'Fraunces', serif",
          fontSize: "1.1rem",
        }}
      >
        Loading...
      </div>
    );
  }

  if (!user) return null;
  return children;
};

export default ProtectedRoute;
