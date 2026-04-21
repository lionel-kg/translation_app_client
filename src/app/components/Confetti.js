"use client";
import React from "react";

const COLORS = ["#c75d3a", "#d4a84a", "#6f8f6a", "#3a5a8a", "#b03a2e"];

export default function Confetti({ show, colors = COLORS }) {
  if (!show) return null;

  const bits = Array.from({ length: 28 }, (_, i) => {
    const ang = (i / 28) * Math.PI * 2 + Math.random() * 0.3;
    const dist = 60 + Math.random() * 90;
    const dx = Math.cos(ang) * dist;
    const dy = Math.sin(ang) * dist;
    const rot = (Math.random() - 0.5) * 540;
    const c = colors[i % colors.length];
    const delay = Math.random() * 0.15;

    return (
      <span
        key={i}
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: 8,
          height: 12,
          background: c,
          borderRadius: 2,
          animation: `confetti-fly 1.2s ${delay}s cubic-bezier(.18,.8,.35,1) forwards`,
          "--dx": `${dx}px`,
          "--dy": `${dy}px`,
          "--rot": `${rot}deg`,
        }}
      />
    );
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        overflow: "hidden",
        zIndex: 50,
      }}
    >
      {bits}
    </div>
  );
}
